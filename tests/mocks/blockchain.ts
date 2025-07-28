import { vi } from 'vitest';

// Mock blockchain responses for different scenarios
export const MOCK_ADDRESSES = {
  UNLOCK: '0x1FF7e338d5E582138C46044dc238543Ce555C963',
  LOCK: '0x1234567890123456789012345678901234567890',
  USER1: '0xabcdefABCDEF1234567890123456789012345678',
  USER2: '0xfedcba0987654321098765432109876543210987',
  ZERO: '0x0000000000000000000000000000000000000000'
};

export const MOCK_VALUES = {
  KEY_PRICE: '1000000000000000000', // 1 ETH
  BALANCE: '5',
  VERSION: '14',
  CHAIN_ID: '8453',
  EXPIRATION: '1735689600', // Jan 1, 2025
  MAX_KEYS: '100',
  DURATION: '31536000' // 1 year
};

export const MOCK_TRANSACTION = {
  hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  blockNumber: 12345,
  gasUsed: { toString: () => '21000' },
  wait: vi.fn(() => Promise.resolve({
    blockNumber: 12345,
    gasUsed: { toString: () => '21000' }
  }))
};

// Mock contract methods for PublicLock
export const createMockPublicLockContract = (overrides: Record<string, any> = {}) => {
  const defaultMethods = {
    // ERC721 Read Functions
    balanceOf: vi.fn(() => Promise.resolve(MOCK_VALUES.BALANCE)),
    ownerOf: vi.fn(() => Promise.resolve(MOCK_ADDRESSES.USER1)),
    getApproved: vi.fn(() => Promise.resolve(MOCK_ADDRESSES.ZERO)),
    tokenURI: vi.fn(() => Promise.resolve('https://example.com/token/1')),
    totalSupply: vi.fn(() => Promise.resolve('10')),
    supportsInterface: vi.fn(() => Promise.resolve(true)),

    // Lock Configuration Read Functions
    keyPrice: vi.fn(() => Promise.resolve(MOCK_VALUES.KEY_PRICE)),
    maxKeysPerAddress: vi.fn(() => Promise.resolve('5')),
    maxNumberOfKeys: vi.fn(() => Promise.resolve(MOCK_VALUES.MAX_KEYS)),
    expirationDuration: vi.fn(() => Promise.resolve(MOCK_VALUES.DURATION)),
    name: vi.fn(() => Promise.resolve('Test Lock')),
    symbol: vi.fn(() => Promise.resolve('TL')),
    tokenAddress: vi.fn(() => Promise.resolve(MOCK_ADDRESSES.ZERO)),
    transferFeeBasisPoints: vi.fn(() => Promise.resolve('100')),

    // Key Status Read Functions
    getHasValidKey: vi.fn(() => Promise.resolve(true)),
    isValidKey: vi.fn(() => Promise.resolve(true)),
    keyExpirationTimestampFor: vi.fn(() => Promise.resolve(MOCK_VALUES.EXPIRATION)),
    keyManagerOf: vi.fn(() => Promise.resolve(MOCK_ADDRESSES.USER1)),
    totalKeys: vi.fn(() => Promise.resolve('2')),

    // Pricing Read Functions
    getCancelAndRefundValue: vi.fn(() => Promise.resolve('900000000000000000')),
    getTransferFee: vi.fn(() => Promise.resolve('10000000000000000')),
    purchasePriceFor: vi.fn(() => Promise.resolve(MOCK_VALUES.KEY_PRICE)),

    // Access Control Read Functions
    hasRole: vi.fn(() => Promise.resolve(true)),
    isLockManager: vi.fn(() => Promise.resolve(true)),
    isOwner: vi.fn(() => Promise.resolve(true)),
    owner: vi.fn(() => Promise.resolve(MOCK_ADDRESSES.USER1)),

    // Write Functions
    purchase: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),
    extend: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),
    grantKeys: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),
    approve: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),
    transferFrom: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),
    cancelAndRefund: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),
    updateKeyPricing: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),
    withdraw: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),
    grantRole: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),

    ...overrides
  };

  return defaultMethods;
};

// Mock contract methods for Unlock Protocol
export const createMockUnlockContract = (overrides: Record<string, any> = {}) => {
  const defaultMethods = {
    // Protocol Read Functions
    chainId: vi.fn(() => Promise.resolve(MOCK_VALUES.CHAIN_ID)),
    unlockVersion: vi.fn(() => Promise.resolve(MOCK_VALUES.VERSION)),
    governanceToken: vi.fn(() => Promise.resolve('0xUDTTokenAddress')),
    getGlobalTokenSymbol: vi.fn(() => Promise.resolve('UDT')),
    publicLockLatestVersion: vi.fn(() => Promise.resolve('15')),
    grossNetworkProduct: vi.fn(() => Promise.resolve('1000000000000000000000')),

    // Protocol Write Functions
    createLock: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),
    createUpgradeableLock: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),
    upgradeLock: vi.fn(() => Promise.resolve({ ...MOCK_TRANSACTION })),

    ...overrides
  };

  return defaultMethods;
};

// Mock ethers providers and signers
export const createMockProvider = (overrides: Record<string, any> = {}) => ({
  getNetwork: vi.fn(() => Promise.resolve({ chainId: 8453 })),
  getBalance: vi.fn(() => Promise.resolve('1000000000000000000')),
  getTransactionCount: vi.fn(() => Promise.resolve(42)),
  ...overrides
});

export const createMockSigner = (overrides: Record<string, any> = {}) => ({
  address: MOCK_ADDRESSES.USER1,
  getAddress: vi.fn(() => Promise.resolve(MOCK_ADDRESSES.USER1)),
  getBalance: vi.fn(() => Promise.resolve('1000000000000000000')),
  signTransaction: vi.fn(() => Promise.resolve('0xsignedtx')),
  ...overrides
});

// Mock ethers Interface for transaction encoding
export const createMockInterface = (overrides: Record<string, any> = {}) => ({
  encodeFunctionData: vi.fn(() => '0x1234567890abcdef'),
  decodeFunctionData: vi.fn(() => ['arg1', 'arg2']),
  parseLog: vi.fn(() => ({ name: 'Transfer', args: [] })),
  ...overrides
});

// Test scenarios for different conditions
export const SCENARIOS = {
  SUCCESSFUL_READ: {
    name: 'successful-read',
    mockContract: createMockPublicLockContract()
  },
  SUCCESSFUL_WRITE: {
    name: 'successful-write',
    mockContract: createMockPublicLockContract()
  },
  FAILED_TRANSACTION: {
    name: 'failed-transaction',
    mockContract: createMockPublicLockContract({
      purchase: vi.fn(() => Promise.reject(new Error('Transaction failed')))
    })
  },
  INVALID_KEY: {
    name: 'invalid-key',
    mockContract: createMockPublicLockContract({
      getHasValidKey: vi.fn(() => Promise.resolve(false)),
      isValidKey: vi.fn(() => Promise.resolve(false))
    })
  },
  EMPTY_LOCK: {
    name: 'empty-lock',
    mockContract: createMockPublicLockContract({
      balanceOf: vi.fn(() => Promise.resolve('0')),
      totalSupply: vi.fn(() => Promise.resolve('0'))
    })
  },
  HIGH_FEE_LOCK: {
    name: 'high-fee-lock',
    mockContract: createMockPublicLockContract({
      keyPrice: vi.fn(() => Promise.resolve('10000000000000000000')), // 10 ETH
      transferFeeBasisPoints: vi.fn(() => Promise.resolve('1000')) // 10%
    })
  }
};

// Helper to set up mocked ethers for different scenarios
export const setupMockEthers = (scenario: keyof typeof SCENARIOS = 'SUCCESSFUL_READ') => {
  const scenarioConfig = SCENARIOS[scenario];
  
  return {
    JsonRpcProvider: vi.fn(() => createMockProvider()),
    Wallet: vi.fn(() => createMockSigner()),
    Contract: vi.fn(() => scenarioConfig.mockContract),
    Interface: vi.fn(() => createMockInterface())
  };
};