import { describe, it, expect } from 'vitest';
import { 
  UNLOCK_TOOLS, 
  READ_FUNCTIONS, 
  WRITE_FUNCTIONS, 
  isReadFunction, 
  isWriteFunction 
} from '../../src/tools.js';

describe('Tools Configuration', () => {
  describe('UNLOCK_TOOLS array', () => {
    it('should contain 55 tools', () => {
      expect(UNLOCK_TOOLS).toHaveLength(55);
    });

    it('should have valid tool structure', () => {
      UNLOCK_TOOLS.forEach((tool, index) => {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('inputSchema');
        
        expect(typeof tool.name).toBe('string');
        expect(typeof tool.description).toBe('string');
        expect(typeof tool.inputSchema).toBe('object');
        
        // Validate tool name is not empty
        expect(tool.name.length).toBeGreaterThan(0);
        
        // Validate description is not empty
        expect(tool.description.length).toBeGreaterThan(0);
        
        // Validate input schema structure
        expect(tool.inputSchema).toHaveProperty('type');
        expect(tool.inputSchema.type).toBe('object');
        expect(tool.inputSchema).toHaveProperty('properties');
        expect(tool.inputSchema).toHaveProperty('required');
        
        // All tools should require chainId
        expect(tool.inputSchema.required).toContain('chainId');
        expect(tool.inputSchema.properties).toHaveProperty('chainId');
      });
    });

    it('should have unique tool names', () => {
      const toolNames = UNLOCK_TOOLS.map(tool => tool.name);
      const uniqueNames = new Set(toolNames);
      
      expect(uniqueNames.size).toBe(toolNames.length);
    });

    it('should include all essential Unlock protocol functions', () => {
      const toolNames = UNLOCK_TOOLS.map(tool => tool.name);
      const essentialUnlockFunctions = [
        'createLock',
        'createUpgradeableLock', 
        'upgradeLock',
        'chainIdRead',
        'unlockVersion',
        'governanceToken',
        'getGlobalTokenSymbol',
        'publicLockLatestVersion'
      ];

      essentialUnlockFunctions.forEach(funcName => {
        expect(toolNames).toContain(funcName);
      });
    });

    it('should include essential PublicLock functions', () => {
      const toolNames = UNLOCK_TOOLS.map(tool => tool.name);
      const essentialLockFunctions = [
        'balanceOf',
        'purchase',
        'grantKeys',
        'getHasValidKey',
        'keyPrice',
        'transferFrom',
        'updateKeyPricing',
        'withdraw'
      ];

      essentialLockFunctions.forEach(funcName => {
        expect(toolNames).toContain(funcName);
      });
    });
  });

  describe('Function categorization', () => {
    it('should have correct read functions count', () => {
      expect(READ_FUNCTIONS).toHaveLength(38); // Updated for new Unlock functions
    });

    it('should have correct write functions count', () => {
      expect(WRITE_FUNCTIONS).toHaveLength(17); // Updated for new Unlock functions
    });

    it('should have all functions categorized', () => {
      const totalCategorized = READ_FUNCTIONS.length + WRITE_FUNCTIONS.length;
      expect(totalCategorized).toBe(55); // All tools should be categorized
    });

    it('should not have overlapping functions', () => {
      const readSet = new Set(READ_FUNCTIONS);
      const writeSet = new Set(WRITE_FUNCTIONS);
      
      READ_FUNCTIONS.forEach(func => {
        expect(writeSet.has(func)).toBe(false);
      });
    });

    it('should include new Unlock protocol functions in categorization', () => {
      const newUnlockReadFunctions = [
        'chainIdRead', 
        'unlockVersion', 
        'governanceToken', 
        'getGlobalTokenSymbol', 
        'publicLockLatestVersion'
      ];
      
      const newUnlockWriteFunctions = [
        'createLock',
        'createUpgradeableLock', 
        'upgradeLock'
      ];

      newUnlockReadFunctions.forEach(func => {
        expect(READ_FUNCTIONS).toContain(func);
      });

      newUnlockWriteFunctions.forEach(func => {
        expect(WRITE_FUNCTIONS).toContain(func);
      });
    });
  });

  describe('Helper functions', () => {
    describe('isReadFunction', () => {
      it('should correctly identify read functions', () => {
        const readFunctionSamples = [
          'balanceOf',
          'keyPrice', 
          'getHasValidKey',
          'unlockVersion',
          'governanceToken'
        ];

        readFunctionSamples.forEach(func => {
          expect(isReadFunction(func)).toBe(true);
        });
      });

      it('should correctly reject write functions', () => {
        const writeFunctionSamples = [
          'purchase',
          'createLock',
          'grantKeys',
          'upgradeLock'
        ];

        writeFunctionSamples.forEach(func => {
          expect(isReadFunction(func)).toBe(false);
        });
      });

      it('should return false for unknown functions', () => {
        expect(isReadFunction('unknownFunction')).toBe(false);
        expect(isReadFunction('')).toBe(false);
      });
    });

    describe('isWriteFunction', () => {
      it('should correctly identify write functions', () => {
        const writeFunctionSamples = [
          'purchase',
          'createLock', 
          'grantKeys',
          'upgradeLock',
          'withdraw'
        ];

        writeFunctionSamples.forEach(func => {
          expect(isWriteFunction(func)).toBe(true);
        });
      });

      it('should correctly reject read functions', () => {
        const readFunctionSamples = [
          'balanceOf',
          'keyPrice',
          'unlockVersion'
        ];

        readFunctionSamples.forEach(func => {
          expect(isWriteFunction(func)).toBe(false);
        });
      });

      it('should return false for unknown functions', () => {
        expect(isWriteFunction('unknownFunction')).toBe(false);
        expect(isWriteFunction('')).toBe(false);
      });
    });
  });

  describe('Tool input schemas validation', () => {
    it('should have proper chainId validation in all tools', () => {
      UNLOCK_TOOLS.forEach(tool => {
        const chainIdProperty = tool.inputSchema.properties.chainId;
        
        expect(chainIdProperty).toBeDefined();
        expect(chainIdProperty.type).toBe('number');
        expect(chainIdProperty.enum).toEqual([8453, 84532]);
      });
    });

    it('should have proper address pattern validation where needed', () => {
      const addressFields = ['lockAddress', '_keyOwner', '_recipient', '_tokenAddress'];
      
      UNLOCK_TOOLS.forEach(tool => {
        Object.keys(tool.inputSchema.properties).forEach(propName => {
          if (addressFields.some(field => propName.includes(field.replace('_', '')))) {
            const property = tool.inputSchema.properties[propName];
            if (property.type === 'string') {
              expect(property.pattern).toBe('^0x[a-fA-F0-9]{40}$');
            }
          }
        });
      });
    });

    it('should validate specific tool schemas', () => {
      // Test createLock tool
      const createLockTool = UNLOCK_TOOLS.find(tool => tool.name === 'createLock');
      expect(createLockTool).toBeDefined();
      expect(createLockTool!.inputSchema.required).toEqual([
        'chainId', '_lockCreator', '_expirationDuration', 
        '_tokenAddress', '_keyPrice', '_maxNumberOfKeys', '_lockName'
      ]);

      // Test balanceOf tool  
      const balanceOfTool = UNLOCK_TOOLS.find(tool => tool.name === 'balanceOf');
      expect(balanceOfTool).toBeDefined();
      expect(balanceOfTool!.inputSchema.required).toEqual(['chainId', '_keyOwner']);
      
      // Test unlockVersion tool
      const unlockVersionTool = UNLOCK_TOOLS.find(tool => tool.name === 'unlockVersion');
      expect(unlockVersionTool).toBeDefined();
      expect(unlockVersionTool!.inputSchema.required).toEqual(['chainId']);
    });
  });
});