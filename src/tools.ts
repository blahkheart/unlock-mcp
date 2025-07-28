import type { Tool } from "@modelcontextprotocol/sdk/types.js";

// Tool definitions for all Unlock Protocol functions
export const UNLOCK_TOOLS: Tool[] = [
  // Unlock Factory Functions
  {
    name: "createLock",
    description: "Deploy a new PublicLock contract",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532], description: "Chain ID (Base=8453, Base-Sepolia=84532)" },
        _lockCreator: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Address of the lock creator" },
        _expirationDuration: { type: "string", pattern: "^\\d+$", description: "Duration in seconds for key validity" },
        _tokenAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Payment token address (0x0 for ETH)" },
        _keyPrice: { type: "string", pattern: "^\\d+$", description: "Price per key in wei" },
        _maxNumberOfKeys: { type: "string", pattern: "^\\d+$", description: "Maximum number of keys (0 for unlimited)" },
        _lockName: { type: "string", description: "Name of the lock" }
      },
      required: ["chainId", "_lockCreator", "_expirationDuration", "_tokenAddress", "_keyPrice", "_maxNumberOfKeys", "_lockName"]
    }
  },
  {
    name: "createUpgradeableLock",
    description: "Deploy a new upgradeable PublicLock contract with initialization data",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532], description: "Chain ID (Base=8453, Base-Sepolia=84532)" },
        data: { type: "string", pattern: "^0x[a-fA-F0-9]*$", description: "Initialization data for the lock contract" }
      },
      required: ["chainId", "data"]
    }
  },

  // Unlock Protocol Read Functions
  {
    name: "chainIdRead",
    description: "Get the chain ID for the current network",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532], description: "Chain ID (Base=8453, Base-Sepolia=84532)" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "unlockVersion",
    description: "Get the current version of the Unlock protocol",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532], description: "Chain ID (Base=8453, Base-Sepolia=84532)" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "governanceToken",
    description: "Get the UDT governance token address",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532], description: "Chain ID (Base=8453, Base-Sepolia=84532)" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "getGlobalTokenSymbol",
    description: "Get the global token symbol for the protocol",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532], description: "Chain ID (Base=8453, Base-Sepolia=84532)" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "publicLockLatestVersion",
    description: "Get the latest PublicLock template version number",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532], description: "Chain ID (Base=8453, Base-Sepolia=84532)" }
      },
      required: ["chainId"]
    }
  },

  // Unlock Protocol Write Functions
  {
    name: "upgradeLock",
    description: "Upgrade a lock contract to a new version",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532], description: "Chain ID (Base=8453, Base-Sepolia=84532)" },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Address of the lock to upgrade" },
        version: { type: "string", pattern: "^\\d+$", description: "Version number to upgrade to" }
      },
      required: ["chainId", "lockAddress", "version"]
    }
  },

  // PublicLock Read Functions
  {
    name: "balanceOf",
    description: "Get the number of keys owned by an address",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Lock contract address" },
        _keyOwner: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Address to check balance for" }
      },
      required: ["chainId", "_keyOwner"]
    }
  },
  {
    name: "getApproved",
    description: "Get the approved address for a specific token",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID to check approval for" }
      },
      required: ["chainId", "_tokenId"]
    }
  },
  {
    name: "ownerOf",
    description: "Get the owner of a specific token",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID to get owner for" }
      },
      required: ["chainId", "_tokenId"]
    }
  },
  {
    name: "tokenByIndex",
    description: "Get token ID by index in total supply",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _index: { type: "string", pattern: "^\\d+$", description: "Index in total supply" }
      },
      required: ["chainId", "_index"]
    }
  },
  {
    name: "tokenOfOwnerByIndex",
    description: "Get token ID by owner and index",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _keyOwner: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Owner address" },
        _index: { type: "string", pattern: "^\\d+$", description: "Index in owner's tokens" }
      },
      required: ["chainId", "_keyOwner", "_index"]
    }
  },
  {
    name: "tokenURI",
    description: "Get metadata URI for a token",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID to get URI for" }
      },
      required: ["chainId", "_tokenId"]
    }
  },
  {
    name: "totalSupply",
    description: "Get total number of keys created",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "supportsInterface",
    description: "Check if contract supports a specific interface",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        interfaceId: { type: "string", pattern: "^0x[a-fA-F0-9]+$", description: "Interface ID to check" }
      },
      required: ["chainId", "interfaceId"]
    }
  },

  // Lock Configuration Read Functions
  {
    name: "expirationDuration",
    description: "Get duration keys are valid for",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "freeTrialLength",
    description: "Get free trial period length",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "gasRefundValue",
    description: "Get gas refund amount",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "keyPrice",
    description: "Get current key price",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "maxKeysPerAddress",
    description: "Get maximum keys per address",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "maxNumberOfKeys",
    description: "Get maximum total keys",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "name",
    description: "Get lock name",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "numberOfOwners",
    description: "Get number of key owners",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "publicLockVersion",
    description: "Get lock contract version",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "refundPenaltyBasisPoints",
    description: "Get refund penalty percentage",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "symbol",
    description: "Get lock symbol",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "tokenAddress",
    description: "Get payment token address",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },
  {
    name: "transferFeeBasisPoints",
    description: "Get transfer fee percentage",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },

  // Key Status/Validation Read Functions
  {
    name: "getHasValidKey",
    description: "Check if address has valid key",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _keyOwner: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Address to check" }
      },
      required: ["chainId", "_keyOwner"]
    }
  },
  {
    name: "isValidKey",
    description: "Check if specific token is valid",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID to check" }
      },
      required: ["chainId", "_tokenId"]
    }
  },
  {
    name: "keyExpirationTimestampFor",
    description: "Get expiration timestamp for a key",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID to check" }
      },
      required: ["chainId", "_tokenId"]
    }
  },
  {
    name: "keyManagerOf",
    description: "Get key manager address",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID to check" }
      },
      required: ["chainId", "_tokenId"]
    }
  },
  {
    name: "totalKeys",
    description: "Get total keys for an address",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _keyOwner: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Address to check" }
      },
      required: ["chainId", "_keyOwner"]
    }
  },

  // Pricing/Fee Read Functions
  {
    name: "getCancelAndRefundValue",
    description: "Get refund amount for cancellation",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID to check refund for" }
      },
      required: ["chainId", "_tokenId"]
    }
  },
  {
    name: "getTransferFee",
    description: "Get transfer fee amount",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID" },
        _time: { type: "string", pattern: "^\\d+$", description: "Transfer timestamp" }
      },
      required: ["chainId", "_tokenId", "_time"]
    }
  },
  {
    name: "purchasePriceFor",
    description: "Calculate purchase price for recipient",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _recipient: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Recipient address" },
        _referrer: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Referrer address" },
        _data: { type: "string", pattern: "^0x[a-fA-F0-9]*$", description: "Additional data" }
      },
      required: ["chainId", "_recipient", "_referrer", "_data"]
    }
  },

  // Access Control Read Functions
  {
    name: "hasRole",
    description: "Check if account has role",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        role: { type: "string", pattern: "^0x[a-fA-F0-9]+$", description: "Role identifier" },
        account: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Account to check" }
      },
      required: ["chainId", "role", "account"]
    }
  },
  {
    name: "isLockManager",
    description: "Check if address is lock manager",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        account: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Account to check" }
      },
      required: ["chainId", "account"]
    }
  },
  {
    name: "isOwner",
    description: "Check if address is owner",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        account: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Account to check" }
      },
      required: ["chainId", "account"]
    }
  },
  {
    name: "owner",
    description: "Get lock owner address",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }
      },
      required: ["chainId"]
    }
  },

  // Write Functions - Key Purchase
  {
    name: "purchase",
    description: "Purchase keys for multiple recipients",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _values: { type: "array", items: { type: "string", pattern: "^\\d+$" }, description: "Payment amounts for each key" },
        _recipients: { type: "array", items: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }, description: "Recipient addresses" },
        _referrers: { type: "array", items: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }, description: "Referrer addresses" },
        _keyManagers: { type: "array", items: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }, description: "Key manager addresses" },
        _data: { type: "array", items: { type: "string", pattern: "^0x[a-fA-F0-9]*$" }, description: "Additional data for each purchase" }
      },
      required: ["chainId", "_values", "_recipients", "_referrers", "_keyManagers", "_data"]
    }
  },
  {
    name: "extend",
    description: "Extend key duration",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _value: { type: "string", pattern: "^\\d+$", description: "Payment amount" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID to extend" },
        _referrer: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Referrer address" },
        _data: { type: "string", pattern: "^0x[a-fA-F0-9]*$", description: "Additional data" }
      },
      required: ["chainId", "_value", "_tokenId", "_referrer", "_data"]
    }
  },

  // Write Functions - Key Management
  {
    name: "grantKeys",
    description: "Grant keys to recipients",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _recipients: { type: "array", items: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }, description: "Recipient addresses" },
        _expirationTimestamps: { type: "array", items: { type: "string", pattern: "^\\d+$" }, description: "Expiration timestamps" },
        _keyManagers: { type: "array", items: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }, description: "Key manager addresses" }
      },
      required: ["chainId", "_recipients", "_expirationTimestamps", "_keyManagers"]
    }
  },
  {
    name: "setKeyExpiration",
    description: "Set key expiration time",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID" },
        _newExpiration: { type: "string", pattern: "^\\d+$", description: "New expiration timestamp" }
      },
      required: ["chainId", "_tokenId", "_newExpiration"]
    }
  },

  // Write Functions - Key Transfer
  {
    name: "approve",
    description: "Approve address to transfer token",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _approved: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Address to approve" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID to approve" }
      },
      required: ["chainId", "_approved", "_tokenId"]
    }
  },
  {
    name: "transferFrom",
    description: "Transfer key between addresses",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _from: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "From address" },
        _to: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "To address" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID to transfer" }
      },
      required: ["chainId", "_from", "_to", "_tokenId"]
    }
  },

  // Write Functions - Key Cancellation
  {
    name: "cancelAndRefund",
    description: "Cancel key and get refund",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _tokenId: { type: "string", pattern: "^\\d+$", description: "Token ID to cancel" }
      },
      required: ["chainId", "_tokenId"]
    }
  },

  // Write Functions - Lock Configuration
  {
    name: "updateKeyPricing",
    description: "Update key price and payment token",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _keyPrice: { type: "string", pattern: "^\\d+$", description: "New key price in wei" },
        _tokenAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Payment token address" }
      },
      required: ["chainId", "_keyPrice", "_tokenAddress"]
    }
  },
  {
    name: "updateLockConfig",
    description: "Update lock configuration settings",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _newExpirationDuration: { type: "string", pattern: "^\\d+$", description: "New expiration duration in seconds" },
        _maxNumberOfKeys: { type: "string", pattern: "^\\d+$", description: "Maximum number of keys" },
        _maxKeysPerAccount: { type: "string", pattern: "^\\d+$", description: "Maximum keys per account" }
      },
      required: ["chainId", "_newExpirationDuration", "_maxNumberOfKeys", "_maxKeysPerAccount"]
    }
  },
  {
    name: "setLockMetadata",
    description: "Update lock metadata",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _lockName: { type: "string", description: "New lock name" },
        _lockSymbol: { type: "string", description: "New lock symbol" },
        _baseTokenURI: { type: "string", description: "New base token URI" }
      },
      required: ["chainId", "_lockName", "_lockSymbol", "_baseTokenURI"]
    }
  },

  // Write Functions - Fee/Revenue
  {
    name: "setReferrerFee",
    description: "Set referrer fee",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _referrer: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Referrer address" },
        _feeBasisPoint: { type: "string", pattern: "^\\d+$", description: "Fee in basis points (100 = 1%)" }
      },
      required: ["chainId", "_referrer", "_feeBasisPoint"]
    }
  },
  {
    name: "withdraw",
    description: "Withdraw funds from lock",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        _tokenAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Token to withdraw" },
        _recipient: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Recipient address" },
        _amount: { type: "string", pattern: "^\\d+$", description: "Amount to withdraw in wei" }
      },
      required: ["chainId", "_tokenAddress", "_recipient", "_amount"]
    }
  },

  // Write Functions - Access Control
  {
    name: "grantRole",
    description: "Grant role to account",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        role: { type: "string", pattern: "^0x[a-fA-F0-9]+$", description: "Role identifier" },
        account: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Account to grant role to" }
      },
      required: ["chainId", "role", "account"]
    }
  },
  {
    name: "revokeRole",
    description: "Revoke role from account",
    inputSchema: {
      type: "object",
      properties: {
        chainId: { type: "number", enum: [8453, 84532] },
        lockAddress: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" },
        role: { type: "string", pattern: "^0x[a-fA-F0-9]+$", description: "Role identifier" },
        account: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$", description: "Account to revoke role from" }
      },
      required: ["chainId", "role", "account"]
    }
  }
];

// Helper to get read vs write functions
export const READ_FUNCTIONS = [
  // PublicLock read functions
  "balanceOf", "getApproved", "ownerOf", "tokenByIndex", "tokenOfOwnerByIndex", 
  "tokenURI", "totalSupply", "supportsInterface", "expirationDuration", 
  "freeTrialLength", "gasRefundValue", "keyPrice", "maxKeysPerAddress", 
  "maxNumberOfKeys", "name", "numberOfOwners", "publicLockVersion", 
  "refundPenaltyBasisPoints", "symbol", "tokenAddress", "transferFeeBasisPoints",
  "getHasValidKey", "isValidKey", "keyExpirationTimestampFor", "keyManagerOf", 
  "totalKeys", "getCancelAndRefundValue", "getTransferFee", "purchasePriceFor",
  "hasRole", "isLockManager", "isOwner", "owner",
  // Unlock protocol read functions
  "chainIdRead", "unlockVersion", "governanceToken", "getGlobalTokenSymbol", 
  "publicLockLatestVersion"
];

export const WRITE_FUNCTIONS = [
  // PublicLock write functions
  "purchase", "extend", "grantKeys", "setKeyExpiration", 
  "approve", "transferFrom", "cancelAndRefund", "updateKeyPricing", 
  "updateLockConfig", "setLockMetadata", "setReferrerFee", "withdraw", 
  "grantRole", "revokeRole",
  // Unlock protocol write functions
  "createLock", "createUpgradeableLock", "upgradeLock"
];

export function isReadFunction(functionName: string): boolean {
  return READ_FUNCTIONS.includes(functionName);
}

export function isWriteFunction(functionName: string): boolean {
  return WRITE_FUNCTIONS.includes(functionName);
}