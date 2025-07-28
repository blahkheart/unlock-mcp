# Unlock-MCP

**Unlock MCP** is an MCP server that provides comprehensive access to **Unlock Protocol** on **Base** and **Base-Sepolia** networks. This server exposes a number of public read and write functions from the Unlock Protocol smart contracts, enabling AI agents to interact with membership, subscription, and access control functionality.

## 🚀 Features

### Complete Function Coverage
- **55 Tools**: All public read and write functions from PublicLock contract plus essential Unlock protocol functions
- **PublicLock Functions**: Complete coverage of membership, pricing, transfers, and access control
- **Unlock Protocol Functions**: Lock creation, upgrades, and protocol information
- **Read Functions**: Query membership status, pricing, metadata, configuration, and protocol info
- **Write Functions**: Purchase keys, manage memberships, configure locks, create locks, and handle upgrades

### Two Operating Modes
| Mode | Key Location | Gas Payer | Transport | Use Case |
|------|--------------|-----------|-----------|----------|
| `stdio` | Server `.env` | **Server** | stdio | Claude Desktop, MCP clients |
| `proxy` | Browser/Wallet | **Client** | HTTP/SSE | n8n, web applications |

### Enterprise Ready
- ✅ **Comprehensive Input Validation** with Zod schemas
- ✅ **Proper Error Handling** with detailed logging
- ✅ **Type Safety** throughout the codebase
- ✅ **n8n Integration** with dedicated endpoints
- ✅ **Health Monitoring** and graceful shutdown
- ✅ **Extensive Documentation** for all tools

---

## 📦 Quick Start

### 1. Installation
```bash
git clone <repo-url> unlock-mcp
cd unlock-mcp
npm install
cp .env.example .env
```

### 2. Configuration
Edit `.env` with your settings:
```bash
# Required: Choose RPC provider
INFURA_API_KEY=your_infura_project_id
# OR
ALCHEMY_API_KEY=your_alchemy_api_key

# Required: Unlock Protocol contract addresses
# Base Mainnet
UNLOCK_ADDRESS=0x1FF7e338d5E582138C46044dc238543Ce555C963
# Base Sepolia (for testing)
# UNLOCK_ADDRESS=0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06

# Optional: Default lock address
LOCK_ADDRESS=0x...

# Required for stdio mode only
PRIVATE_KEY=0x...  # ⚠️ Use test wallet with minimal funds
```

### 3. Build
```bash
npm run build
```

### 4A. Run stdio Mode (Claude Desktop)

**Start the server:**
```bash
MCP_MODE=stdio node dist/index.js
```

**Claude Desktop configuration:**
```json
{
  "mcpServers": {
    "unlock": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/unlock-mcp/dist/index.js"],
      "env": { "MCP_MODE": "stdio" }
    }
  }
}
```

### 4B. Run proxy Mode (n8n, HTTP APIs)

**Start the server:**
```bash
MCP_MODE=proxy node dist/index.js
```

**For Claude Desktop with SSE:**
```json
{
  "mcpServers": {
    "unlock": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/unlock-mcp/dist/index.js"],
      "env": { "MCP_MODE": "proxy" },
      "transport": { 
        "type": "sse", 
        "url": "http://localhost:3000/sse" 
      }
    }
  }
}
```

---

## 🔧 n8n Integration

The proxy mode is optimized for n8n workflows with:

### MCP Client Tool Node
```bash
# Install n8n community MCP node
npm install n8n-nodes-mcp
```

### Available Endpoints
- `GET /tools` - List all available MCP tools
- `POST /tools/call` - Execute MCP tools with validation
- `GET /health` - Health check and server status
- `GET /sse` - Server-Sent Events for real-time connection
- `GET /` - API documentation

### Example n8n Workflow
1. Add **MCP Client Tool** node
2. Configure server URL: `http://localhost:3000`
3. Use tools like `getHasValidKey`, `purchase`, `grantKeys`, etc.

---

## 🛠️ Available Tools

### 📖 Read Functions (30 tools)

#### Unlock Protocol Information
- `chainIdRead` - Get current network chain ID
- `unlockVersion` - Get Unlock protocol version
- `governanceToken` - Get UDT governance token address
- `getGlobalTokenSymbol` - Get global token symbol
- `publicLockLatestVersion` - Get latest lock template version

#### PublicLock ERC721 & Membership
- `balanceOf` - Get number of keys owned
- `ownerOf` - Get owner of specific token
- `tokenURI` - Get metadata URI
- `totalSupply` - Get total keys created
- `getHasValidKey` - Check if address has valid key
- `isValidKey` - Check if specific token is valid
- `keyExpirationTimestampFor` - Get key expiration time

#### Lock Configuration
- `keyPrice` - Get current key price
- `maxKeysPerAddress` - Get max keys per address
- `maxNumberOfKeys` - Get maximum total keys
- `expirationDuration` - Get key validity duration
- `name`/`symbol` - Get lock metadata
- `tokenAddress` - Get payment token
- `transferFeeBasisPoints` - Get transfer fee

#### Pricing & Fees
- `purchasePriceFor` - Calculate purchase price
- `getCancelAndRefundValue` - Get refund amount
- `getTransferFee` - Calculate transfer fee

#### Access Control
- `owner` - Get lock owner
- `isLockManager` - Check manager status
- `hasRole` - Check role permissions

### ✍️ Write Functions (27 tools)

#### Lock Creation & Management
- `createLock` - Deploy new basic PublicLock contract
- `createUpgradeableLock` - Deploy upgradeable lock with custom data
- `upgradeLock` - Upgrade existing lock to new version

#### Key Management
- `purchase` - Buy keys for recipients
- `grantKeys` - Issue keys administratively  
- `extend` - Extend key duration
- `renewMembershipFor` - Renew membership

#### Key Transfers
- `transferFrom` - Transfer key ownership
- `approve` - Approve address for transfer
- `lendKey`/`unlendKey` - Temporary key lending
- `shareKey` - Share key time with others

#### Lock Administration
- `updateKeyPricing` - Change price and payment token
- `updateLockConfig` - Modify lock settings
- `setLockMetadata` - Update name, symbol, URI
- `withdraw` - Extract funds from lock

#### Access Control
- `grantRole`/`revokeRole` - Manage permissions
- `setOwner` - Transfer ownership

#### Advanced Features
- `cancelAndRefund` - Cancel with refund
- `setReferrerFee` - Configure referral rewards
- `mergeKeys` - Combine key durations

---

## 🔍 Example Usage

### Get Protocol Information
```bash
# Get current protocol version
{
  "name": "unlockVersion",
  "arguments": {
    "chainId": 8453
  }
}

# Get UDT governance token address
{
  "name": "governanceToken",
  "arguments": {
    "chainId": 8453
  }
}
```

### Create a New Lock
```bash
# Deploy basic lock
{
  "name": "createLock",
  "arguments": {
    "chainId": 8453,
    "_lockCreator": "0x...",
    "_expirationDuration": "31536000",
    "_tokenAddress": "0x0000000000000000000000000000000000000000",
    "_keyPrice": "1000000000000000000",
    "_maxNumberOfKeys": "100",
    "_lockName": "My Membership Lock"
  }
}

# Deploy upgradeable lock with custom initialization
{
  "name": "createUpgradeableLock",
  "arguments": {
    "chainId": 8453,
    "data": "0x..."
  }
}
```

### Check Membership Status
```bash
{
  "name": "getHasValidKey",
  "arguments": {
    "chainId": 8453,
    "lockAddress": "0x...",
    "_keyOwner": "0x..."
  }
}
```

### Purchase a Key
```bash
{
  "name": "purchase", 
  "arguments": {
    "chainId": 8453,
    "lockAddress": "0x...",
    "_values": ["1000000000000000000"],
    "_recipients": ["0x..."],
    "_referrers": ["0x0000000000000000000000000000000000000000"],
    "_keyManagers": ["0x..."],
    "_data": ["0x"]
  }
}
```

### Upgrade an Existing Lock
```bash
{
  "name": "upgradeLock",
  "arguments": {
    "chainId": 8453,
    "lockAddress": "0x...",
    "version": "15"
  }
}
```

### Grant Administrative Keys
```bash
{
  "name": "grantKeys",
  "arguments": {
    "chainId": 8453, 
    "lockAddress": "0x...",
    "_recipients": ["0x...", "0x..."],
    "_expirationTimestamps": ["1735689600", "1735689600"], 
    "_keyManagers": ["0x...", "0x..."]
  }
}
```

---

## 🏗️ Architecture

### Validation Pipeline
```
Request → Zod Schema → Function Call → Result/Error
```

### Error Handling
- **Input Validation**: Comprehensive Zod schemas for all parameters
- **Network Errors**: Automatic retry and detailed error messages  
- **Transaction Failures**: Clear error reporting with gas estimation
- **Logging**: Structured logs with timestamps and context

### Security Features
- Environment variable validation
- Address format verification
- Role-based access control
- Safe error handling without data leaks

---

## 📚 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MCP_MODE` | No | Operating mode | `stdio` or `proxy` |
| `INFURA_API_KEY` | Yes* | Infura project ID | `abc123...` |
| `ALCHEMY_API_KEY` | Yes* | Alchemy API key | `xyz789...` |
| `UNLOCK_ADDRESS` | Yes | Unlock factory address | `0x1FF7e338d5E5...` |
| `LOCK_ADDRESS` | No | Default lock address | `0x...` |
| `PRIVATE_KEY` | stdio only | Wallet private key | `0x...` |
| `PORT` | No | Proxy server port | `3000` |

*Choose one RPC provider

---

## 🧪 Testing

### Comprehensive Test Suite

This project includes a complete testing framework covering:

- **77 Tests** across unit, integration, and E2E layers
- **Mock Blockchain Interactions** for reliable testing
- **MCP Protocol Compliance** verification
- **CI/CD Integration** with GitHub Actions

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test tests/unit          # Unit tests only
npm run test:integration         # Integration tests
npm run test:e2e                # End-to-end tests

# Watch mode for development
npm run test:watch

# Interactive UI
npm run test:ui
```

### Test MCP Inspector

```bash
# Test with official MCP Inspector
npm run test:mcp

# Manual testing
npm run build
npx @modelcontextprotocol/inspector node dist/src/index.js
```

### Health Check API (Proxy Mode)
```bash
# Health status
curl http://localhost:3000/health

# List all 55 tools
curl http://localhost:3000/tools

# Execute function
curl -X POST http://localhost:3000/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "keyPrice",
    "arguments": {
      "chainId": 8453,
      "lockAddress": "0x..."
    }
  }'
```

### Test Coverage

Current test coverage includes:
- **Schema Validation**: 100% coverage of all input validation
- **Tool Definitions**: Complete verification of 55 tools
- **Function Categorization**: Read vs write function classification
- **Contract Interactions**: Mocked blockchain operations
- **Error Handling**: Comprehensive error scenario testing

---

## 📋 Contract Addresses

### Base Mainnet (Chain ID: 8453)
- **Unlock Protocol**: `0x1FF7e338d5E582138C46044dc238543Ce555C963`

### Base Sepolia (Chain ID: 84532)  
- **Unlock Protocol**: `0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06`

---

## 🤝 Contributing

This implementation follows MCP best practices:
- Type-safe function signatures
- Comprehensive input validation
- Detailed error handling
- Extensive logging
- Clear documentation

Perfect for building membership systems, subscription services, and access control mechanisms with AI assistance.

---

## ⚠️ Security Notice

- Use test networks for development
- Never commit private keys to version control
- Use dedicated wallets with minimal funds
- Validate all inputs in production environments
- Monitor transaction costs and set appropriate limits