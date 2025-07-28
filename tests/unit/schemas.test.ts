import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';
import {
  AddressSchema,
  ChainIdSchema,
  UintSchema,
  BytesSchema,
  BalanceOfSchema,
  CreateLockSchema,
  PurchaseSchema,
  UnlockVersionSchema,
  GovernanceTokenSchema,
  CreateUpgradeableLockSchema,
  UpgradeLockSchema,
  FUNCTION_SCHEMAS
} from '../../src/schemas.js';

describe('Schema Validation', () => {
  describe('Base Schemas', () => {
    describe('AddressSchema', () => {
      it('should validate correct Ethereum addresses', () => {
        const validAddresses = [
          '0x1234567890123456789012345678901234567890',
          '0xabcdefABCDEF1234567890123456789012345678',
          '0x0000000000000000000000000000000000000000'
        ];

        validAddresses.forEach(address => {
          expect(() => AddressSchema.parse(address)).not.toThrow();
        });
      });

      it('should reject invalid addresses', () => {
        const invalidAddresses = [
          '0x123', // too short
          '1234567890123456789012345678901234567890', // missing 0x
          '0xGGGG567890123456789012345678901234567890', // invalid characters
          '0x12345678901234567890123456789012345678901' // too long
        ];

        invalidAddresses.forEach(address => {
          expect(() => AddressSchema.parse(address)).toThrow(ZodError);
        });
      });
    });

    describe('ChainIdSchema', () => {
      it('should validate supported chain IDs', () => {
        expect(() => ChainIdSchema.parse(8453)).not.toThrow(); // Base
        expect(() => ChainIdSchema.parse(84532)).not.toThrow(); // Base Sepolia
      });

      it('should reject unsupported chain IDs', () => {
        const invalidChainIds = [1, 137, 42161, 1337];
        
        invalidChainIds.forEach(chainId => {
          expect(() => ChainIdSchema.parse(chainId)).toThrow(ZodError);
        });
      });
    });

    describe('UintSchema', () => {
      it('should validate positive integer strings', () => {
        const validUints = ['0', '1', '123456789', '1000000000000000000'];
        
        validUints.forEach(uint => {
          expect(() => UintSchema.parse(uint)).not.toThrow();
        });
      });

      it('should reject invalid uint strings', () => {
        const invalidUints = ['-1', '12.34', 'abc', '', '1e10'];
        
        invalidUints.forEach(uint => {
          expect(() => UintSchema.parse(uint)).toThrow(ZodError);
        });
      });
    });

    describe('BytesSchema', () => {
      it('should validate hex strings', () => {
        const validBytes = ['0x', '0x1234', '0xabcdef', '0x1234567890abcdef'];
        
        validBytes.forEach(bytes => {
          expect(() => BytesSchema.parse(bytes)).not.toThrow();
        });
      });

      it('should reject invalid hex strings', () => {
        const invalidBytes = ['1234', '0xGGGG', 'not-hex'];
        
        invalidBytes.forEach(bytes => {
          expect(() => BytesSchema.parse(bytes)).toThrow(ZodError);
        });
      });
    });
  });

  describe('PublicLock Function Schemas', () => {
    describe('BalanceOfSchema', () => {
      it('should validate correct balanceOf parameters', () => {
        const validParams = {
          chainId: 8453,
          lockAddress: '0x1234567890123456789012345678901234567890',
          _keyOwner: '0xabcdefABCDEF1234567890123456789012345678'
        };

        expect(() => BalanceOfSchema.parse(validParams)).not.toThrow();
      });

      it('should make lockAddress optional', () => {
        const validParamsWithoutLock = {
          chainId: 8453,
          _keyOwner: '0xabcdefABCDEF1234567890123456789012345678'
        };

        expect(() => BalanceOfSchema.parse(validParamsWithoutLock)).not.toThrow();
      });

      it('should reject missing required fields', () => {
        const invalidParams = {
          chainId: 8453
          // missing _keyOwner
        };

        expect(() => BalanceOfSchema.parse(invalidParams)).toThrow(ZodError);
      });
    });

    describe('PurchaseSchema', () => {
      it('should validate correct purchase parameters', () => {
        const validParams = {
          chainId: 8453,
          lockAddress: '0x1234567890123456789012345678901234567890',
          _values: ['1000000000000000000'],
          _recipients: ['0xabcdefABCDEF1234567890123456789012345678'],
          _referrers: ['0x0000000000000000000000000000000000000000'],
          _keyManagers: ['0xabcdefABCDEF1234567890123456789012345678'],
          _data: ['0x']
        };

        expect(() => PurchaseSchema.parse(validParams)).not.toThrow();
      });

      it('should validate multiple recipients', () => {
        const validParams = {
          chainId: 8453,
          _values: ['1000000000000000000', '2000000000000000000'],
          _recipients: [
            '0x1234567890123456789012345678901234567890',
            '0xabcdefABCDEF1234567890123456789012345678'
          ],
          _referrers: [
            '0x0000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000'
          ],
          _keyManagers: [
            '0x1234567890123456789012345678901234567890',
            '0xabcdefABCDEF1234567890123456789012345678'
          ],
          _data: ['0x', '0x1234']
        };

        expect(() => PurchaseSchema.parse(validParams)).not.toThrow();
      });
    });
  });

  describe('Unlock Protocol Function Schemas', () => {
    describe('CreateLockSchema', () => {
      it('should validate correct createLock parameters', () => {
        const validParams = {
          chainId: 8453,
          _lockCreator: '0x1234567890123456789012345678901234567890',
          _expirationDuration: '31536000', // 1 year
          _tokenAddress: '0x0000000000000000000000000000000000000000', // ETH
          _keyPrice: '1000000000000000000', // 1 ETH
          _maxNumberOfKeys: '100',
          _lockName: 'Test Lock'
        };

        expect(() => CreateLockSchema.parse(validParams)).not.toThrow();
      });

      it('should require all parameters', () => {
        const incompleteParams = {
          chainId: 8453,
          _lockCreator: '0x1234567890123456789012345678901234567890'
          // missing other required fields
        };

        expect(() => CreateLockSchema.parse(incompleteParams)).toThrow(ZodError);
      });
    });

    describe('CreateUpgradeableLockSchema', () => {
      it('should validate upgradeable lock parameters', () => {
        const validParams = {
          chainId: 8453,
          data: '0x1234567890abcdef'
        };

        expect(() => CreateUpgradeableLockSchema.parse(validParams)).not.toThrow();
      });

      it('should accept empty data', () => {
        const validParams = {
          chainId: 8453,
          data: '0x'
        };

        expect(() => CreateUpgradeableLockSchema.parse(validParams)).not.toThrow();
      });
    });

    describe('UpgradeLockSchema', () => {
      it('should validate upgrade parameters', () => {
        const validParams = {
          chainId: 8453,
          lockAddress: '0x1234567890123456789012345678901234567890',
          version: '15'
        };

        expect(() => UpgradeLockSchema.parse(validParams)).not.toThrow();
      });
    });

    describe('Protocol Info Schemas', () => {
      it('should validate protocol info requests', () => {
        const validParams = { chainId: 8453 };

        expect(() => UnlockVersionSchema.parse(validParams)).not.toThrow();
        expect(() => GovernanceTokenSchema.parse(validParams)).not.toThrow();
      });
    });
  });

  describe('FUNCTION_SCHEMAS mapping', () => {
    it('should include all expected function schemas', () => {
      const expectedFunctions = [
        'balanceOf',
        'purchase',
        'createLock',
        'createUpgradeableLock',
        'upgradeLock',
        'unlockVersion',
        'governanceToken',
        'chainIdRead'
      ];

      expectedFunctions.forEach(funcName => {
        expect(FUNCTION_SCHEMAS).toHaveProperty(funcName);
        expect(FUNCTION_SCHEMAS[funcName as keyof typeof FUNCTION_SCHEMAS]).toBeDefined();
      });
    });

    it('should validate real function calls', () => {
      // Test a read function
      const balanceOfArgs = {
        chainId: 8453,
        _keyOwner: '0x1234567890123456789012345678901234567890'
      };
      
      expect(() => FUNCTION_SCHEMAS.balanceOf.parse(balanceOfArgs)).not.toThrow();

      // Test a write function
      const purchaseArgs = {
        chainId: 8453,
        _values: ['1000000000000000000'],
        _recipients: ['0x1234567890123456789012345678901234567890'],
        _referrers: ['0x0000000000000000000000000000000000000000'],
        _keyManagers: ['0x1234567890123456789012345678901234567890'],
        _data: ['0x']
      };
      
      expect(() => FUNCTION_SCHEMAS.purchase.parse(purchaseArgs)).not.toThrow();
    });
  });
});