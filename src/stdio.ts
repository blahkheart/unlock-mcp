import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ethers } from "ethers";
import UnlockAbi from "../abis/UnlockV14_abi.json" with { type: "json" };
import PublicLockAbi from "../abis/PublicLockV15_abi.json" with { type: "json" };
import { rpc } from "./shared.js";
import { FUNCTION_SCHEMAS, type FunctionName } from "./schemas.js";
import { UNLOCK_TOOLS, isReadFunction, isWriteFunction } from "./tools.js";

// Validate environment variables
if (!process.env.UNLOCK_ADDRESS) {
  throw new Error("UNLOCK_ADDRESS environment variable is required");
}
if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY environment variable is required");
}
if (!process.env.INFURA_API_KEY && !process.env.ALCHEMY_API_KEY) {
  throw new Error("Either INFURA_API_KEY or ALCHEMY_API_KEY is required");
}

const UNLOCK = process.env.UNLOCK_ADDRESS;
const LOCK   = process.env.LOCK_ADDRESS;
const PK     = process.env.PRIVATE_KEY;

// Logging utility
function log(level: 'info' | 'error' | 'warn', message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logData = data ? ` ${JSON.stringify(data)}` : '';
  console.error(`[${timestamp}] ${level.toUpperCase()}: ${message}${logData}`);
}

// Initialize providers and signers with error handling
const providers: Record<number, ethers.JsonRpcProvider> = {};
const signers:   Record<number, ethers.Wallet>        = {};

try {
  for (const id of [8453, 84532]) {
    const rpcUrl = rpc(id as 8453 | 84532);
    providers[id] = new ethers.JsonRpcProvider(rpcUrl);
    signers[id]   = new ethers.Wallet(PK, providers[id]);
    log('info', `Initialized provider for chain ${id}`, { rpcUrl: rpcUrl.split('/').slice(0, 3).join('/') });
  }
} catch (error) {
  log('error', 'Failed to initialize providers', { error: error instanceof Error ? error.message : error });
  throw error;
}

const server = new Server(
  { 
    name: "unlock-stdio", 
    version: "1.0.0" 
  }, 
  { 
    capabilities: { 
      tools: {} 
    } 
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  log('info', 'Tools list requested');
  return { tools: UNLOCK_TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async ({ params: { name, arguments: args } }) => {
  try {
    log('info', 'Tool call received', { name, args });
    
    // Validate function name
    if (!(name in FUNCTION_SCHEMAS)) {
      throw new Error(`Unknown function: ${name}`);
    }
    
    // Validate input arguments
    const schema = FUNCTION_SCHEMAS[name as FunctionName];
    const validatedArgs = schema.parse(args);
    
    const chainId = validatedArgs.chainId;
    
    // Check if provider exists for chain
    if (!(chainId in providers)) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    
    // Determine contract address and ABI
    let contractAddress: string;
    let abi: any[];
    
    // Check if this is an Unlock protocol function
    const unlockFunctions = ["createLock", "createUpgradeableLock", "upgradeLock", "chainIdRead", "unlockVersion", "governanceToken", "getGlobalTokenSymbol", "publicLockLatestVersion"];
    
    if (unlockFunctions.includes(name)) {
      contractAddress = UNLOCK;
      abi = UnlockAbi;
      
      // For upgradeLock, we need the lockAddress parameter but still call Unlock contract
      if (name === "upgradeLock") {
        // Validation already ensures lockAddress is present in validatedArgs
      }
    } else {
      // This is a PublicLock function
      const lockAddr = 'lockAddress' in validatedArgs ? validatedArgs.lockAddress : undefined;
      const finalAddr = lockAddr || LOCK;
      if (!finalAddr) {
        throw new Error("lockAddress is required for PublicLock functions");
      }
      contractAddress = finalAddr as string;
      abi = PublicLockAbi;
    }
    
    // Prepare contract interaction
    const signer = signers[chainId];
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    // Map function names for special cases
    const actualFunctionName = name === "chainIdRead" ? "chainId" : name;
    
    // Check if function exists on contract
    if (!(actualFunctionName in contract)) {
      throw new Error(`Function ${actualFunctionName} not found on contract`);
    }
    
    // Prepare function arguments (exclude metadata fields)
    const txArgs = Object.entries(validatedArgs)
      .filter(([k]) => !["chainId", "lockAddress"].includes(k))
      .map(([, v]) => v);
    
    log('info', 'Calling contract function', { 
      function: actualFunctionName, 
      contractAddress, 
      chainId,
      argsCount: txArgs.length 
    });
    
    // Check if this is a read or write function
    if (isReadFunction(name)) {
      // For read functions, just call the function
      const result = await contract[actualFunctionName](...txArgs);
      log('info', 'Read function completed', { function: actualFunctionName, result: result.toString() });
      
      return { 
        content: [{ 
          type: "text", 
          text: `Function ${name} returned: ${result.toString()}` 
        }] 
      };
    } else if (isWriteFunction(name)) {
      // For write functions, send transaction and wait for confirmation
      const tx = await contract[actualFunctionName](...txArgs);
      log('info', 'Transaction sent', { function: actualFunctionName, txHash: tx.hash });
      
      const receipt = await tx.wait();
      log('info', 'Transaction mined', { 
        function: name, 
        txHash: tx.hash, 
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      });
      
      return { 
        content: [{ 
          type: "text", 
          text: `Transaction ${tx.hash} mined in block ${receipt.blockNumber}. Gas used: ${receipt.gasUsed.toString()}` 
        }] 
      };
    } else {
      throw new Error(`Function ${name} is not categorized as read or write`);
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log('error', 'Tool call failed', { name, error: errorMessage });
    
    return { 
      content: [{ 
        type: "text", 
        text: `Error: ${errorMessage}` 
      }], 
      isError: true 
    };
  }
});

// Start the server
async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    log('info', '🔓 Unlock MCP stdio server ready', { 
      toolsCount: UNLOCK_TOOLS.length,
      supportedChains: [8453, 84532],
      unlockAddress: UNLOCK,
      defaultLockAddress: LOCK || 'none'
    });
  } catch (error) {
    log('error', 'Failed to start server', { error: error instanceof Error ? error.message : error });
    process.exit(1);
  }
}

startServer();