import { vi } from 'vitest';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set up test environment variables
process.env.NODE_ENV = 'test';
process.env.MCP_MODE = 'stdio';
process.env.UNLOCK_ADDRESS = '0x1FF7e338d5E582138C46044dc238543Ce555C963';
process.env.INFURA_API_KEY = 'test-infura-key';
process.env.PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000001';

// Mock external dependencies
vi.mock('ethers', () => ({
  ethers: {
    JsonRpcProvider: vi.fn(),
    Wallet: vi.fn(),
    Contract: vi.fn(),
    Interface: vi.fn(() => ({
      encodeFunctionData: vi.fn(() => '0x1234567890abcdef')
    }))
  }
}));

// Global test utilities
global.createMockTransaction = () => ({
  hash: '0x1234567890abcdef',
  wait: vi.fn(() => Promise.resolve({
    blockNumber: 12345,
    gasUsed: { toString: () => '21000' }
  }))
});

global.createMockContract = (methods: Record<string, any> = {}) => {
  const defaultMethods = {
    balanceOf: vi.fn(() => Promise.resolve('5')),
    keyPrice: vi.fn(() => Promise.resolve('1000000000000000000')),
    getHasValidKey: vi.fn(() => Promise.resolve(true)),
    purchase: vi.fn(() => Promise.resolve(global.createMockTransaction())),
    createLock: vi.fn(() => Promise.resolve(global.createMockTransaction()))
  };
  
  return {
    ...defaultMethods,
    ...methods
  };
};