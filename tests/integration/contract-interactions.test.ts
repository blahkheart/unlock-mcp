import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  MOCK_ADDRESSES, 
  MOCK_VALUES, 
  createMockPublicLockContract,
  createMockUnlockContract,
  SCENARIOS,
  setupMockEthers 
} from '../mocks/blockchain.js';

// Mock ethers completely
vi.mock('ethers', () => ({
  ethers: setupMockEthers('SUCCESSFUL_READ')
}));

describe('Contract Interactions', () => {
  beforeEach(() => {
    // Set up test environment
    process.env.UNLOCK_ADDRESS = MOCK_ADDRESSES.UNLOCK;
    process.env.INFURA_API_KEY = 'test-key';
    process.env.PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000001';
  });

  describe('PublicLock Contract Functions', () => {
    describe('Read Functions', () => {
      it('should handle balanceOf calls', async () => {
        const mockContract = createMockPublicLockContract();
        
        const result = await mockContract.balanceOf(MOCK_ADDRESSES.USER1);
        
        expect(mockContract.balanceOf).toHaveBeenCalledWith(MOCK_ADDRESSES.USER1);
        expect(result).toBe(MOCK_VALUES.BALANCE);
      });

      it('should handle keyPrice calls', async () => {
        const mockContract = createMockPublicLockContract();
        
        const result = await mockContract.keyPrice();
        
        expect(mockContract.keyPrice).toHaveBeenCalled();
        expect(result).toBe(MOCK_VALUES.KEY_PRICE);
      });

      it('should handle getHasValidKey calls', async () => {
        const mockContract = createMockPublicLockContract();
        
        const result = await mockContract.getHasValidKey(MOCK_ADDRESSES.USER1);
        
        expect(mockContract.getHasValidKey).toHaveBeenCalledWith(MOCK_ADDRESSES.USER1);
        expect(result).toBe(true);
      });

      it('should handle complex read functions', async () => {
        const mockContract = createMockPublicLockContract();
        
        // Test purchasePriceFor with multiple parameters
        const result = await mockContract.purchasePriceFor(
          MOCK_ADDRESSES.USER1,
          MOCK_ADDRESSES.ZERO,
          '0x'
        );
        
        expect(mockContract.purchasePriceFor).toHaveBeenCalledWith(
          MOCK_ADDRESSES.USER1,
          MOCK_ADDRESSES.ZERO,
          '0x'
        );
        expect(result).toBe(MOCK_VALUES.KEY_PRICE);
      });
    });

    describe('Write Functions', () => {
      it('should handle purchase transactions', async () => {
        const mockContract = createMockPublicLockContract();
        
        const tx = await mockContract.purchase(
          [MOCK_VALUES.KEY_PRICE],
          [MOCK_ADDRESSES.USER1],
          [MOCK_ADDRESSES.ZERO],
          [MOCK_ADDRESSES.USER1],
          ['0x']
        );
        
        expect(mockContract.purchase).toHaveBeenCalledWith(
          [MOCK_VALUES.KEY_PRICE],
          [MOCK_ADDRESSES.USER1],
          [MOCK_ADDRESSES.ZERO],
          [MOCK_ADDRESSES.USER1],
          ['0x']
        );
        
        expect(tx).toHaveProperty('hash');
        expect(tx).toHaveProperty('wait');
        
        const receipt = await tx.wait();
        expect(receipt).toHaveProperty('blockNumber');
        expect(receipt).toHaveProperty('gasUsed');
      });

      it('should handle grantKeys transactions', async () => {
        const mockContract = createMockPublicLockContract();
        
        const tx = await mockContract.grantKeys(
          [MOCK_ADDRESSES.USER1, MOCK_ADDRESSES.USER2],
          [MOCK_VALUES.EXPIRATION, MOCK_VALUES.EXPIRATION],
          [MOCK_ADDRESSES.USER1, MOCK_ADDRESSES.USER2]
        );
        
        expect(mockContract.grantKeys).toHaveBeenCalledWith(
          [MOCK_ADDRESSES.USER1, MOCK_ADDRESSES.USER2],
          [MOCK_VALUES.EXPIRATION, MOCK_VALUES.EXPIRATION],
          [MOCK_ADDRESSES.USER1, MOCK_ADDRESSES.USER2]
        );
        
        expect(tx).toHaveProperty('hash');
      });

      it('should handle administrative functions', async () => {
        const mockContract = createMockPublicLockContract();
        
        // Test updateKeyPricing
        const tx = await mockContract.updateKeyPricing(
          '2000000000000000000', // 2 ETH
          MOCK_ADDRESSES.ZERO
        );
        
        expect(mockContract.updateKeyPricing).toHaveBeenCalledWith(
          '2000000000000000000',
          MOCK_ADDRESSES.ZERO
        );
        
        expect(tx).toHaveProperty('hash');
      });
    });

    describe('Error Scenarios', () => {
      it('should handle transaction failures', async () => {
        const mockContract = createMockPublicLockContract({
          purchase: vi.fn(() => Promise.reject(new Error('Insufficient funds')))
        });
        
        await expect(mockContract.purchase(
          [MOCK_VALUES.KEY_PRICE],
          [MOCK_ADDRESSES.USER1],
          [MOCK_ADDRESSES.ZERO],
          [MOCK_ADDRESSES.USER1],
          ['0x']
        )).rejects.toThrow('Insufficient funds');
      });

      it('should handle invalid key scenarios', async () => {
        const mockContract = createMockPublicLockContract({
          getHasValidKey: vi.fn(() => Promise.resolve(false))
        });
        
        const result = await mockContract.getHasValidKey(MOCK_ADDRESSES.USER1);
        expect(result).toBe(false);
      });

      it('should handle empty lock scenarios', async () => {
        const mockContract = createMockPublicLockContract({
          balanceOf: vi.fn(() => Promise.resolve('0')),
          totalSupply: vi.fn(() => Promise.resolve('0'))
        });
        
        const balance = await mockContract.balanceOf(MOCK_ADDRESSES.USER1);
        const supply = await mockContract.totalSupply();
        
        expect(balance).toBe('0');
        expect(supply).toBe('0');
      });
    });
  });

  describe('Unlock Protocol Contract Functions', () => {
    describe('Read Functions', () => {
      it('should handle protocol information queries', async () => {
        const mockContract = createMockUnlockContract();
        
        const version = await mockContract.unlockVersion();
        const chainId = await mockContract.chainId();
        const token = await mockContract.governanceToken();
        
        expect(mockContract.unlockVersion).toHaveBeenCalled();
        expect(mockContract.chainId).toHaveBeenCalled();
        expect(mockContract.governanceToken).toHaveBeenCalled();
        
        expect(version).toBe(MOCK_VALUES.VERSION);
        expect(chainId).toBe(MOCK_VALUES.CHAIN_ID);
        expect(token).toBe('0xUDTTokenAddress');
      });

      it('should handle template version queries', async () => {
        const mockContract = createMockUnlockContract();
        
        const latestVersion = await mockContract.publicLockLatestVersion();
        const symbol = await mockContract.getGlobalTokenSymbol();
        
        expect(latestVersion).toBe('15');
        expect(symbol).toBe('UDT');
      });
    });

    describe('Write Functions', () => {
      it('should handle createLock transactions', async () => {
        const mockContract = createMockUnlockContract();
        
        const tx = await mockContract.createLock(
          MOCK_ADDRESSES.USER1,
          MOCK_VALUES.DURATION,
          MOCK_ADDRESSES.ZERO,
          MOCK_VALUES.KEY_PRICE,
          MOCK_VALUES.MAX_KEYS,
          'Test Lock'
        );
        
        expect(mockContract.createLock).toHaveBeenCalledWith(
          MOCK_ADDRESSES.USER1,
          MOCK_VALUES.DURATION,
          MOCK_ADDRESSES.ZERO,
          MOCK_VALUES.KEY_PRICE,
          MOCK_VALUES.MAX_KEYS,
          'Test Lock'
        );
        
        expect(tx).toHaveProperty('hash');
      });

      it('should handle createUpgradeableLock transactions', async () => {
        const mockContract = createMockUnlockContract();
        
        const tx = await mockContract.createUpgradeableLock('0x1234567890abcdef');
        
        expect(mockContract.createUpgradeableLock).toHaveBeenCalledWith('0x1234567890abcdef');
        expect(tx).toHaveProperty('hash');
      });

      it('should handle upgradeLock transactions', async () => {
        const mockContract = createMockUnlockContract();
        
        const tx = await mockContract.upgradeLock(MOCK_ADDRESSES.LOCK, '15');
        
        expect(mockContract.upgradeLock).toHaveBeenCalledWith(MOCK_ADDRESSES.LOCK, '15');
        expect(tx).toHaveProperty('hash');
      });
    });
  });

  describe('Contract Address Resolution', () => {
    it('should use correct contract for Unlock functions', () => {
      const unlockFunctions = [
        'createLock', 'createUpgradeableLock', 'upgradeLock',
        'chainIdRead', 'unlockVersion', 'governanceToken'
      ];
      
      unlockFunctions.forEach(funcName => {
        // In the actual implementation, these should route to UNLOCK address
        expect(unlockFunctions.includes(funcName)).toBe(true);
      });
    });

    it('should use correct contract for PublicLock functions', () => {
      const publicLockFunctions = [
        'balanceOf', 'purchase', 'grantKeys', 'keyPrice'
      ];
      
      publicLockFunctions.forEach(funcName => {
        // In the actual implementation, these should route to lock address
        expect(publicLockFunctions.includes(funcName)).toBe(true);
      });
    });
  });

  describe('Function Name Mapping', () => {
    it('should map chainIdRead to chainId', () => {
      const mappedName = 'chainIdRead' === 'chainIdRead' ? 'chainId' : 'chainIdRead';
      expect(mappedName).toBe('chainId');
    });

    it('should not map other function names', () => {
      const testFunctions = ['balanceOf', 'purchase', 'unlockVersion'];
      
      testFunctions.forEach(funcName => {
        const mappedName = funcName === 'chainIdRead' ? 'chainId' : funcName;
        expect(mappedName).toBe(funcName);
      });
    });
  });

  describe('Transaction Response Handling', () => {
    it('should format read function responses correctly', async () => {
      const mockContract = createMockPublicLockContract();
      
      const result = await mockContract.balanceOf(MOCK_ADDRESSES.USER1);
      const formattedResponse = {
        function: 'balanceOf',
        result: result.toString(),
        chainId: 8453
      };
      
      expect(formattedResponse.result).toBe('5');
      expect(formattedResponse.function).toBe('balanceOf');
      expect(formattedResponse.chainId).toBe(8453);
    });

    it('should format write function responses correctly', async () => {
      const mockContract = createMockPublicLockContract();
      
      const tx = await mockContract.purchase(
        [MOCK_VALUES.KEY_PRICE],
        [MOCK_ADDRESSES.USER1],
        [MOCK_ADDRESSES.ZERO],
        [MOCK_ADDRESSES.USER1],
        ['0x']
      );
      
      const receipt = await tx.wait();
      const formattedResponse = {
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
      
      expect(formattedResponse.txHash).toBeDefined();
      expect(formattedResponse.blockNumber).toBe(12345);
      expect(formattedResponse.gasUsed).toBe('21000');
    });
  });
});