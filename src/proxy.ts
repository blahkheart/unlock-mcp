import express from "express";
import cors from "cors";
import { ethers } from "ethers";
import UnlockAbi from "../abis/UnlockV14_abi.json" with { type: "json" };
import PublicLockAbi from "../abis/PublicLockV15_abi.json" with { type: "json" };
import { rpc } from "./shared.js";
import { FUNCTION_SCHEMAS, type FunctionName } from "./schemas.js";
import { UNLOCK_TOOLS, isReadFunction, isWriteFunction } from "./tools.js";

const app = express();
app.use(cors({
  origin: true, // Allow all origins for development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Validate environment variables
if (!process.env.UNLOCK_ADDRESS) {
  throw new Error("UNLOCK_ADDRESS environment variable is required");
}
if (!process.env.INFURA_API_KEY && !process.env.ALCHEMY_API_KEY) {
  throw new Error("Either INFURA_API_KEY or ALCHEMY_API_KEY is required");
}

const UNLOCK = process.env.UNLOCK_ADDRESS;
const LOCK   = process.env.LOCK_ADDRESS;

// Initialize providers for read operations
const providers: Record<number, ethers.JsonRpcProvider> = {};
try {
  for (const id of [8453, 84532]) {
    const rpcUrl = rpc(id as 8453 | 84532);
    providers[id] = new ethers.JsonRpcProvider(rpcUrl);
    console.log(`Initialized read provider for chain ${id}`);
  }
} catch (error) {
  console.error('Failed to initialize providers:', error);
  throw error;
}

function buildTx(chainId: number, to: string, abi: any[], method: string, args: any[], value = "0") {
  try {
    const iface = new ethers.Interface(abi);
    const data = iface.encodeFunctionData(method, args);
    return { to, data, value, chainId };
  } catch (error) {
    throw new Error(`Failed to build transaction: ${error instanceof Error ? error.message : error}`);
  }
}

// Helper function to validate function arguments
function validateFunctionCall(functionName: string, args: any) {
  if (!(functionName in FUNCTION_SCHEMAS)) {
    throw new Error(`Unknown function: ${functionName}`);
  }
  
  const schema = FUNCTION_SCHEMAS[functionName as FunctionName];
  return schema.parse(args);
}

// Helper function to prepare contract arguments
function prepareContractArgs(validatedArgs: any): any[] {
  return Object.entries(validatedArgs)
    .filter(([k]) => !["chainId", "lockAddress"].includes(k))
    .map(([, v]) => v);
}

// MCP-compatible endpoints
app.get('/tools', (req, res) => {
  res.json({ tools: UNLOCK_TOOLS });
});

app.post('/tools/call', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;
    
    if (!name || !args) {
      return res.status(400).json({ error: 'Missing name or arguments' });
    }
    
    // Validate function and arguments
    const validatedArgs = validateFunctionCall(name, args);
    const chainId = validatedArgs.chainId;
    
    // Check if this is a read function that can be executed directly
    if (isReadFunction(name)) {
      // Execute read function directly
      const provider = providers[chainId];
      if (!provider) {
        return res.status(400).json({ error: `Unsupported chain ID: ${chainId}` });
      }
      
      let contractAddress: string;
      let abi: any[];
      
      // Check if this is an Unlock protocol function
      const unlockFunctions = ["createLock", "createUpgradeableLock", "upgradeLock", "chainIdRead", "unlockVersion", "governanceToken", "getGlobalTokenSymbol", "publicLockLatestVersion"];
      
      if (unlockFunctions.includes(name)) {
        contractAddress = UNLOCK;
        abi = UnlockAbi;
      } else {
        // This is a PublicLock function
        const lockAddr = 'lockAddress' in validatedArgs ? validatedArgs.lockAddress : undefined;
        const finalAddr = lockAddr || LOCK;
        if (!finalAddr) {
          return res.status(400).json({ error: "lockAddress is required for PublicLock functions" });
        }
        contractAddress = finalAddr as string;
        abi = PublicLockAbi;
      }
      
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const contractArgs = prepareContractArgs(validatedArgs);
      
      // Map function names for special cases
      const actualFunctionName = name === "chainIdRead" ? "chainId" : name;
      
      const result = await contract[actualFunctionName](...contractArgs);
      
      res.json({
        success: true,
        result: result.toString(),
        function: name,
        chainId
      });
    } else {
      // For write functions, return transaction data for client to sign
      let contractAddress: string;
      let abi: any[];
      
      // Check if this is an Unlock protocol function
      const unlockFunctions = ["createLock", "createUpgradeableLock", "upgradeLock", "chainIdRead", "unlockVersion", "governanceToken", "getGlobalTokenSymbol", "publicLockLatestVersion"];
      
      if (unlockFunctions.includes(name)) {
        contractAddress = UNLOCK;
        abi = UnlockAbi;
      } else {
        // This is a PublicLock function
        const lockAddr = 'lockAddress' in validatedArgs ? validatedArgs.lockAddress : undefined;
        const finalAddr = lockAddr || LOCK;
        if (!finalAddr) {
          return res.status(400).json({ error: "lockAddress is required for PublicLock functions" });
        }
        contractAddress = finalAddr as string;
        abi = PublicLockAbi;
      }
      
      const contractArgs = prepareContractArgs(validatedArgs);
      
      // Map function names for special cases
      const actualFunctionName = name === "chainIdRead" ? "chainId" : name;
      
      const txData = buildTx(chainId, contractAddress, abi, actualFunctionName, contractArgs);
      
      res.json({
        success: true,
        transaction: txData,
        function: name,
        chainId
      });
    }
    
  } catch (error) {
    console.error('Tool call error:', error);
    res.status(400).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Legacy endpoints for backward compatibility
app.post("/unlock/:method", async (req, res) => {
  try {
    const { chainId, args } = req.body;
    const method = req.params.method;
    
    if (!chainId || !args) {
      return res.status(400).json({ error: 'Missing chainId or args' });
    }
    
    // Validate using new schema system
    const functionArgs = { chainId, ...args };
    const validatedArgs = validateFunctionCall(method, functionArgs);
    const contractArgs = prepareContractArgs(validatedArgs);
    
    const txData = buildTx(chainId, UNLOCK, UnlockAbi, method, contractArgs);
    res.json(txData);
  } catch (error) {
    console.error('Unlock method error:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.post("/lock/:method", async (req, res) => {
  try {
    const { chainId, lockAddress, args } = req.body;
    const method = req.params.method;
    
    if (!chainId) {
      return res.status(400).json({ error: 'Missing chainId' });
    }
    
    const addr = lockAddress || LOCK;
    if (!addr) {
      return res.status(400).json({ error: "lockAddress required" });
    }
    
    // Validate using new schema system
    const functionArgs = { chainId, lockAddress: addr, ...args };
    const validatedArgs = validateFunctionCall(method, functionArgs);
    const contractArgs = prepareContractArgs(validatedArgs);
    
    const txData = buildTx(chainId, addr, PublicLockAbi, method, contractArgs);
    res.json(txData);
  } catch (error) {
    console.error('Lock method error:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Enhanced SSE endpoint for n8n integration
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
  
  // Send initial connection message
  res.write(`data: ${JSON.stringify({ 
    type: 'connection', 
    message: 'Connected to Unlock MCP proxy server',
    timestamp: new Date().toISOString(),
    tools: UNLOCK_TOOLS.length
  })}\n\n`);
  
  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({ 
      type: 'heartbeat', 
      timestamp: new Date().toISOString() 
    })}\n\n`);
  }, 30000);
  
  req.on('close', () => {
    clearInterval(keepAlive);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    tools: UNLOCK_TOOLS.length,
    supportedChains: [8453, 84532],
    unlockAddress: UNLOCK,
    defaultLockAddress: LOCK || null
  });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Unlock MCP Proxy Server',
    version: '1.0.0',
    description: 'Model Context Protocol server for Unlock Protocol on Base networks',
    endpoints: {
      'GET /': 'This documentation',
      'GET /health': 'Health check',
      'GET /tools': 'List available MCP tools',
      'POST /tools/call': 'Execute MCP tool',
      'GET /sse': 'Server-Sent Events endpoint',
      'POST /unlock/:method': 'Legacy Unlock contract methods',
      'POST /lock/:method': 'Legacy PublicLock contract methods'
    },
    supportedChains: [8453, 84532],
    toolsCount: UNLOCK_TOOLS.length
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔓 Unlock MCP proxy server listening on port ${PORT}`);
  console.log(`Available tools: ${UNLOCK_TOOLS.length}`);
  console.log(`Supported chains: Base (8453), Base-Sepolia (84532)`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});