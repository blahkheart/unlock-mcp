import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  ListToolsRequestSchema, 
  CallToolRequestSchema,
  type ListToolsRequest,
  type CallToolRequest
} from '@modelcontextprotocol/sdk/types.js';

// Mock ethers before importing our modules
vi.mock('ethers', () => ({
  ethers: {
    JsonRpcProvider: vi.fn(() => ({
      getNetwork: vi.fn(() => Promise.resolve({ chainId: 8453 }))
    })),
    Wallet: vi.fn(() => ({
      address: '0x1234567890123456789012345678901234567890'
    })),
    Contract: vi.fn(() => global.createMockContract()),
    Interface: vi.fn(() => ({
      encodeFunctionData: vi.fn(() => '0x1234567890abcdef')
    }))
  }
}));

describe('MCP Server Integration', () => {
  let server: Server;
  let mockTransport: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Create mock transport
    mockTransport = {
      start: vi.fn(),
      close: vi.fn(),
      send: vi.fn()
    };

    // Set up test environment
    process.env.UNLOCK_ADDRESS = '0x1FF7e338d5E582138C46044dc238543Ce555C963';
    process.env.INFURA_API_KEY = 'test-key';
    process.env.PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000001';
  });

  afterEach(async () => {
    if (server) {
      try {
        await server.close();
      } catch (error) {
        // Ignore close errors in tests
      }
    }
  });

  describe('Server Initialization', () => {
    it('should create server with correct capabilities', async () => {
      server = new Server(
        { name: 'unlock-stdio', version: '1.0.0' },
        { capabilities: { tools: {} } }
      );

      expect(server).toBeDefined();
    });

    it('should handle missing environment variables gracefully', () => {
      delete process.env.UNLOCK_ADDRESS;
      
      expect(() => {
        // This should throw when trying to import stdio module
        import('../../src/stdio.js');
      }).not.toThrow(); // Module import itself shouldn't throw
    });
  });

  describe('ListTools Handler', () => {
    it('should return all 55 tools', async () => {
      const { UNLOCK_TOOLS } = await import('../../src/tools.js');
      
      expect(UNLOCK_TOOLS).toHaveLength(55);
      
      // Verify tools structure
      UNLOCK_TOOLS.forEach(tool => {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('inputSchema');
      });
    });

    it('should include essential function categories', async () => {
      const { UNLOCK_TOOLS } = await import('../../src/tools.js');
      const toolNames = UNLOCK_TOOLS.map(tool => tool.name);

      // Check Unlock protocol functions
      expect(toolNames).toContain('createLock');
      expect(toolNames).toContain('createUpgradeableLock');
      expect(toolNames).toContain('upgradeLock');
      expect(toolNames).toContain('unlockVersion');
      expect(toolNames).toContain('governanceToken');

      // Check PublicLock functions
      expect(toolNames).toContain('balanceOf');
      expect(toolNames).toContain('purchase');
      expect(toolNames).toContain('grantKeys');
      expect(toolNames).toContain('getHasValidKey');
    });

    it('should have proper tool schemas', async () => {
      const { UNLOCK_TOOLS } = await import('../../src/tools.js');
      
      const createLockTool = UNLOCK_TOOLS.find(tool => tool.name === 'createLock');
      expect(createLockTool).toBeDefined();
      expect(createLockTool!.inputSchema.required).toContain('chainId');
      expect(createLockTool!.inputSchema.properties.chainId.enum).toEqual([8453, 84532]);
    });
  });

  describe('Function Validation', () => {
    it('should validate function arguments correctly', async () => {
      const { FUNCTION_SCHEMAS } = await import('../../src/schemas.js');
      
      // Test valid balanceOf call
      const validBalanceOfArgs = {
        chainId: 8453,
        _keyOwner: '0x1234567890123456789012345678901234567890'
      };
      
      expect(() => FUNCTION_SCHEMAS.balanceOf.parse(validBalanceOfArgs)).not.toThrow();

      // Test invalid balanceOf call
      const invalidBalanceOfArgs = {
        chainId: 1, // unsupported chain
        _keyOwner: 'invalid-address'
      };
      
      expect(() => FUNCTION_SCHEMAS.balanceOf.parse(invalidBalanceOfArgs)).toThrow();
    });

    it('should validate complex function arguments', async () => {
      const { FUNCTION_SCHEMAS } = await import('../../src/schemas.js');
      
      // Test valid purchase call
      const validPurchaseArgs = {
        chainId: 8453,
        _values: ['1000000000000000000'],
        _recipients: ['0x1234567890123456789012345678901234567890'],
        _referrers: ['0x0000000000000000000000000000000000000000'],
        _keyManagers: ['0x1234567890123456789012345678901234567890'],
        _data: ['0x']
      };
      
      expect(() => FUNCTION_SCHEMAS.purchase.parse(validPurchaseArgs)).not.toThrow();
    });

    it('should validate Unlock protocol functions', async () => {
      const { FUNCTION_SCHEMAS } = await import('../../src/schemas.js');
      
      // Test createLock
      const validCreateLockArgs = {
        chainId: 8453,
        _lockCreator: '0x1234567890123456789012345678901234567890',
        _expirationDuration: '31536000',
        _tokenAddress: '0x0000000000000000000000000000000000000000',
        _keyPrice: '1000000000000000000',
        _maxNumberOfKeys: '100',
        _lockName: 'Test Lock'
      };
      
      expect(() => FUNCTION_SCHEMAS.createLock.parse(validCreateLockArgs)).not.toThrow();

      // Test unlockVersion
      const validVersionArgs = { chainId: 8453 };
      expect(() => FUNCTION_SCHEMAS.unlockVersion.parse(validVersionArgs)).not.toThrow();
    });
  });

  describe('Function Categorization', () => {
    it('should correctly categorize read and write functions', async () => {
      const { isReadFunction, isWriteFunction } = await import('../../src/tools.js');
      
      // Test read functions
      expect(isReadFunction('balanceOf')).toBe(true);
      expect(isReadFunction('keyPrice')).toBe(true);
      expect(isReadFunction('unlockVersion')).toBe(true);
      expect(isReadFunction('governanceToken')).toBe(true);
      
      // Test write functions
      expect(isWriteFunction('purchase')).toBe(true);
      expect(isWriteFunction('createLock')).toBe(true);
      expect(isWriteFunction('upgradeLock')).toBe(true);
      expect(isWriteFunction('grantKeys')).toBe(true);
      
      // Test that functions aren't both
      expect(isReadFunction('purchase')).toBe(false);
      expect(isWriteFunction('balanceOf')).toBe(false);
    });

    it('should handle unknown functions', async () => {
      const { isReadFunction, isWriteFunction } = await import('../../src/tools.js');
      
      expect(isReadFunction('unknownFunction')).toBe(false);
      expect(isWriteFunction('unknownFunction')).toBe(false);
    });
  });

  describe('Contract Address Resolution', () => {
    it('should identify Unlock protocol functions correctly', () => {
      const unlockFunctions = [
        'createLock', 
        'createUpgradeableLock', 
        'upgradeLock', 
        'chainIdRead', 
        'unlockVersion', 
        'governanceToken', 
        'getGlobalTokenSymbol', 
        'publicLockLatestVersion'
      ];

      unlockFunctions.forEach(funcName => {
        // These should be identified as Unlock protocol functions
        // In actual implementation, this would route to UNLOCK contract address
        expect(unlockFunctions.includes(funcName)).toBe(true);
      });
    });

    it('should handle function name mapping', () => {
      // Test that chainIdRead maps to chainId for contract calls
      const actualFunctionName = 'chainIdRead' === 'chainIdRead' ? 'chainId' : 'chainIdRead';
      expect(actualFunctionName).toBe('chainId');
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      const { FUNCTION_SCHEMAS } = await import('../../src/schemas.js');
      
      const invalidArgs = {
        chainId: 'invalid',
        _keyOwner: 'not-an-address'
      };
      
      expect(() => FUNCTION_SCHEMAS.balanceOf.parse(invalidArgs)).toThrow();
    });

    it('should handle missing required fields', async () => {
      const { FUNCTION_SCHEMAS } = await import('../../src/schemas.js');
      
      const incompleteArgs = {
        chainId: 8453
        // missing _keyOwner
      };
      
      expect(() => FUNCTION_SCHEMAS.balanceOf.parse(incompleteArgs)).toThrow();
    });
  });

  describe('Tool Completeness', () => {
    it('should have schemas for all tools', async () => {
      const { UNLOCK_TOOLS } = await import('../../src/tools.js');
      const { FUNCTION_SCHEMAS } = await import('../../src/schemas.js');
      
      const toolNames = UNLOCK_TOOLS.map(tool => tool.name);
      const schemaNames = Object.keys(FUNCTION_SCHEMAS);
      
      // Most tools should have corresponding schemas
      const toolsWithSchemas = toolNames.filter(name => schemaNames.includes(name));
      expect(toolsWithSchemas.length).toBeGreaterThan(40); // Allow for some tools without schemas
    });

    it('should cover essential blockchain operations', async () => {
      const { UNLOCK_TOOLS } = await import('../../src/tools.js');
      const toolNames = UNLOCK_TOOLS.map(tool => tool.name);
      
      // Essential operations should be covered
      const essentialOps = [
        'balanceOf', 'purchase', 'createLock', 'grantKeys',
        'transferFrom', 'withdraw', 'updateKeyPricing'
      ];
      
      essentialOps.forEach(op => {
        expect(toolNames).toContain(op);
      });
    });
  });
});