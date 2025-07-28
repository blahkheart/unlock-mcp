# Unlock MCP Testing Guide

This directory contains comprehensive tests for the Unlock MCP server, covering all aspects from unit tests to end-to-end integration testing.

## 🧪 Testing Strategy

### Test Layers

1. **Unit Tests** (`tests/unit/`)
   - Schema validation
   - Tool definitions
   - Utility functions
   - Individual component logic

2. **Integration Tests** (`tests/integration/`)
   - MCP server functionality
   - Contract interaction logic
   - Function categorization
   - Error handling

3. **End-to-End Tests** (`tests/e2e/`)
   - Full server workflows
   - HTTP API testing
   - Real protocol interactions
   - Both stdio and proxy modes

4. **Mock Utilities** (`tests/mocks/`)
   - Blockchain interaction mocks
   - Contract response simulation
   - Error scenario testing

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run specific test suites
npm run test:integration
npm run test:e2e
```

### Advanced Testing

```bash
# Test specific files
npm test tests/unit/schemas.test.ts

# Test with specific timeout
npm test -- --timeout=30000

# Test with verbose output
npm test -- --reporter=verbose

# Test with coverage for specific files
npm test -- --coverage --coverage-reporter=text
```

## 🎯 Test Coverage

### Current Coverage Targets

- **Schemas**: 100% - All validation logic must be tested
- **Tools**: 95% - All tool definitions and categorization
- **Integration**: 90% - Core MCP functionality
- **E2E**: 80% - Happy path and error scenarios

### Coverage Reports

After running `npm run test:coverage`, view reports at:
- **HTML**: `coverage/index.html`
- **Terminal**: Displayed automatically
- **CI/CD**: Uploaded to Codecov

## 🔧 Test Configuration

### Vitest Configuration

Key settings in `vitest.config.ts`:
- **Environment**: Node.js
- **Timeout**: 10 seconds
- **Setup**: Automatic mock initialization
- **Coverage**: V8 provider with HTML/JSON output

### Mock Setup

Global mocks configured in `tests/setup.ts`:
- **Ethers.js**: Complete blockchain abstraction
- **Environment**: Test-specific variables
- **Utilities**: Helper functions for contracts

## 🧩 Test Structure

### Unit Tests

```typescript
// Example: Schema validation test
describe('AddressSchema', () => {
  it('should validate correct Ethereum addresses', () => {
    expect(() => AddressSchema.parse('0x1234...')).not.toThrow();
  });
  
  it('should reject invalid addresses', () => {
    expect(() => AddressSchema.parse('invalid')).toThrow();
  });
});
```

### Integration Tests

```typescript
// Example: MCP server test
describe('MCP Server', () => {
  it('should return all 55 tools', async () => {
    const { UNLOCK_TOOLS } = await import('../../src/tools.js');
    expect(UNLOCK_TOOLS).toHaveLength(55);
  });
});
```

### E2E Tests

```typescript
// Example: HTTP API test
describe('Proxy Server', () => {
  it('should handle tool calls', async () => {
    const response = await request(app)
      .post('/tools/call')
      .send({ name: 'balanceOf', arguments: { ... } })
      .expect(200);
  });
});
```

## 🎭 Mock Scenarios

### Available Scenarios

- **SUCCESSFUL_READ**: Normal read operations
- **SUCCESSFUL_WRITE**: Normal write operations  
- **FAILED_TRANSACTION**: Transaction failures
- **INVALID_KEY**: Invalid/expired keys
- **EMPTY_LOCK**: Locks with no keys
- **HIGH_FEE_LOCK**: Expensive lock operations

### Using Scenarios

```typescript
import { SCENARIOS, setupMockEthers } from '../mocks/blockchain.js';

// Use specific scenario
vi.mock('ethers', () => ({
  ethers: setupMockEthers('FAILED_TRANSACTION')
}));
```

## 🔍 Testing Best Practices

### Writing Good Tests

1. **Descriptive Names**: Test names should explain what they test
2. **Single Responsibility**: Each test should verify one thing
3. **Arrange-Act-Assert**: Clear test structure
4. **Mock External Dependencies**: Don't rely on real blockchain
5. **Test Error Cases**: Cover both success and failure paths

### Common Patterns

```typescript
// Good: Descriptive and specific
it('should validate Ethereum addresses with correct format', () => {
  // Test implementation
});

// Bad: Vague and unclear
it('should work', () => {
  // Test implementation
});
```

### Mock Best Practices

```typescript
// Use typed mocks
const mockContract = createMockPublicLockContract({
  balanceOf: vi.fn(() => Promise.resolve('5'))
});

// Verify mock calls
expect(mockContract.balanceOf).toHaveBeenCalledWith(expectedAddress);
```

## 🐛 Debugging Tests

### Common Issues

1. **Module Import Errors**: Ensure correct paths and mock setup
2. **Async/Await**: Use proper async handling in tests
3. **Mock Cleanup**: Clear mocks between tests
4. **Environment Variables**: Set test-specific values

### Debug Commands

```bash
# Run single test with debug output
npm test -- --run tests/unit/schemas.test.ts --reporter=verbose

# Debug with Node inspector
node --inspect-brk node_modules/.bin/vitest run

# Check test environment
npm test -- --reporter=verbose | grep "Environment"
```

## 📊 CI/CD Integration

### GitHub Actions

Tests run automatically on:
- **Push** to main/develop branches
- **Pull requests** to main
- **Multiple Node.js versions** (18, 20, 22)

### Test Matrix

- **Node Versions**: 18.x, 20.x, 22.x
- **Test Suites**: Unit, Integration, E2E
- **Coverage**: Generated and uploaded
- **Security**: Dependency auditing
- **Compatibility**: Startup and validation tests

### Manual MCP Testing

For manual testing with real MCP clients:

```bash
# Build the project
npm run build

# Test with MCP Inspector
npm run test:mcp

# Test with Claude Desktop (add to config)
{
  "mcpServers": {
    "unlock-test": {
      "command": "node",
      "args": ["/path/to/unlock-mcp/dist/src/index.js"],
      "env": { "MCP_MODE": "stdio" }
    }
  }
}
```

## 📈 Contributing to Tests

When adding new features:

1. **Add Unit Tests**: For new schemas, tools, utilities
2. **Add Integration Tests**: For MCP protocol compliance
3. **Add E2E Tests**: For user-facing functionality
4. **Update Mocks**: If adding new contract interactions
5. **Update Documentation**: Keep this guide current

### Test Coverage Requirements

All PRs must maintain minimum coverage:
- **Functions**: 90%
- **Lines**: 85%
- **Branches**: 80%

## 🎯 Future Testing Improvements

- [ ] Property-based testing with fast-check
- [ ] Performance benchmarks with autocannon
- [ ] Visual regression testing for documentation
- [ ] Mutation testing for test quality
- [ ] Integration with real testnets (optional)