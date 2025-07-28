import { z } from "zod";

// Base schemas for common types
export const AddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");
export const ChainIdSchema = z.union([z.literal(8453), z.literal(84532)]);
export const UintSchema = z.string().regex(/^\d+$/, "Must be a positive integer");
export const BytesSchema = z.string().regex(/^0x[a-fA-F0-9]*$/, "Invalid bytes format");

// Common base schema for all operations
const BaseOperationSchema = z.object({
  chainId: ChainIdSchema,
  lockAddress: AddressSchema.optional(),
});

// Read function schemas
export const BalanceOfSchema = BaseOperationSchema.extend({
  _keyOwner: AddressSchema,
});

export const GetApprovedSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
});

export const OwnerOfSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
});

export const TokenByIndexSchema = BaseOperationSchema.extend({
  _index: UintSchema,
});

export const TokenOfOwnerByIndexSchema = BaseOperationSchema.extend({
  _keyOwner: AddressSchema,
  _index: UintSchema,
});

export const TokenURISchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
});

export const SupportsInterfaceSchema = BaseOperationSchema.extend({
  interfaceId: BytesSchema,
});

export const GetHasValidKeySchema = BaseOperationSchema.extend({
  _keyOwner: AddressSchema,
});

export const IsValidKeySchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
});

export const KeyExpirationTimestampForSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
});

export const KeyManagerOfSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
});

export const TotalKeysSchema = BaseOperationSchema.extend({
  _keyOwner: AddressSchema,
});

export const IsRenewableSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
  _referrer: AddressSchema,
});

export const GetCancelAndRefundValueSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
});

export const GetTransferFeeSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
  _time: UintSchema,
});

export const PurchasePriceForSchema = BaseOperationSchema.extend({
  _recipient: AddressSchema,
  _referrer: AddressSchema,
  _data: BytesSchema,
});

export const ReferrerFeesSchema = BaseOperationSchema.extend({
  _referrer: AddressSchema,
});

export const HasRoleSchema = BaseOperationSchema.extend({
  role: BytesSchema,
  account: AddressSchema,
});

export const IsLockManagerSchema = BaseOperationSchema.extend({
  account: AddressSchema,
});

export const IsOwnerSchema = BaseOperationSchema.extend({
  account: AddressSchema,
});

// Write function schemas
export const PurchaseSchema = BaseOperationSchema.extend({
  _values: z.array(UintSchema),
  _recipients: z.array(AddressSchema),
  _referrers: z.array(AddressSchema),
  _keyManagers: z.array(AddressSchema),
  _data: z.array(BytesSchema),
});

export const ExtendSchema = BaseOperationSchema.extend({
  _value: UintSchema,
  _tokenId: UintSchema,
  _referrer: AddressSchema,
  _data: BytesSchema,
});

export const GrantKeysSchema = BaseOperationSchema.extend({
  _recipients: z.array(AddressSchema),
  _expirationTimestamps: z.array(UintSchema),
  _keyManagers: z.array(AddressSchema),
});

export const GrantKeyExtensionSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
  _duration: UintSchema,
});

export const SetKeyExpirationSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
  _newExpiration: UintSchema,
});

export const SetKeyManagerOfSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
  _keyManager: AddressSchema,
});

export const RenewMembershipForSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
  _referrer: AddressSchema,
});

export const ApproveSchema = BaseOperationSchema.extend({
  _approved: AddressSchema,
  _tokenId: UintSchema,
});

export const TransferFromSchema = BaseOperationSchema.extend({
  _from: AddressSchema,
  _to: AddressSchema,
  _tokenId: UintSchema,
});

export const SafeTransferFromSchema = BaseOperationSchema.extend({
  _from: AddressSchema,
  _to: AddressSchema,
  _tokenId: UintSchema,
  _data: BytesSchema.optional(),
});

export const LendKeySchema = BaseOperationSchema.extend({
  _from: AddressSchema,
  _recipient: AddressSchema,
  _tokenId: UintSchema,
});

export const UnlendKeySchema = BaseOperationSchema.extend({
  _recipient: AddressSchema,
  _tokenId: UintSchema,
});

export const ShareKeySchema = BaseOperationSchema.extend({
  _to: AddressSchema,
  _tokenIdFrom: UintSchema,
  _timeShared: UintSchema,
});

export const CancelAndRefundSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
});

export const ExpireAndRefundForSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
  _amount: UintSchema,
});

export const BurnSchema = BaseOperationSchema.extend({
  _tokenId: UintSchema,
});

export const UpdateKeyPricingSchema = BaseOperationSchema.extend({
  _keyPrice: UintSchema,
  _tokenAddress: AddressSchema,
});

export const UpdateLockConfigSchema = BaseOperationSchema.extend({
  _newExpirationDuration: UintSchema,
  _maxNumberOfKeys: UintSchema,
  _maxKeysPerAccount: UintSchema,
});

export const UpdateRefundPenaltySchema = BaseOperationSchema.extend({
  _freeTrialLength: UintSchema,
  _refundPenaltyBasisPoints: UintSchema,
});

export const UpdateTransferFeeSchema = BaseOperationSchema.extend({
  _transferFeeBasisPoints: UintSchema,
});

export const SetLockMetadataSchema = BaseOperationSchema.extend({
  _lockName: z.string(),
  _lockSymbol: z.string(),
  _baseTokenURI: z.string(),
});

export const SetReferrerFeeSchema = BaseOperationSchema.extend({
  _referrer: AddressSchema,
  _feeBasisPoint: UintSchema,
});

export const SetGasRefundValueSchema = BaseOperationSchema.extend({
  _refundValue: UintSchema,
});

export const WithdrawSchema = BaseOperationSchema.extend({
  _tokenAddress: AddressSchema,
  _recipient: AddressSchema,
  _amount: UintSchema,
});

export const GrantRoleSchema = BaseOperationSchema.extend({
  role: BytesSchema,
  account: AddressSchema,
});

export const RenounceRoleSchema = BaseOperationSchema.extend({
  role: BytesSchema,
  account: AddressSchema,
});

export const RevokeRoleSchema = BaseOperationSchema.extend({
  role: BytesSchema,
  account: AddressSchema,
});

export const SetOwnerSchema = BaseOperationSchema.extend({
  account: AddressSchema,
});

export const SetEventHooksSchema = BaseOperationSchema.extend({
  _onKeyPurchaseHook: AddressSchema,
  _onKeyCancelHook: AddressSchema,
  _onValidKeyHook: AddressSchema,
  _onTokenURIHook: AddressSchema,
  _onKeyTransferHook: AddressSchema,
  _onKeyExtendHook: AddressSchema,
  _onKeyGrantHook: AddressSchema,
  _onHasRoleHook: AddressSchema,
});

export const MergeKeysSchema = BaseOperationSchema.extend({
  _tokenIdFrom: UintSchema,
  _tokenIdTo: UintSchema,
  _amount: UintSchema,
});

export const MigrateSchema = BaseOperationSchema.extend({
  data: BytesSchema,
});

// Unlock contract schemas
export const CreateLockSchema = z.object({
  chainId: ChainIdSchema,
  _lockCreator: AddressSchema,
  _expirationDuration: UintSchema,
  _tokenAddress: AddressSchema,
  _keyPrice: UintSchema,
  _maxNumberOfKeys: UintSchema,
  _lockName: z.string(),
});

// Additional Unlock contract schemas
export const CreateUpgradeableLockSchema = z.object({
  chainId: ChainIdSchema,
  data: BytesSchema,
});

export const UpgradeLockSchema = z.object({
  chainId: ChainIdSchema,
  lockAddress: AddressSchema,
  version: UintSchema,
});

// Unlock read function schemas
export const ChainIdReadSchema = z.object({
  chainId: ChainIdSchema,
});

export const UnlockVersionSchema = z.object({
  chainId: ChainIdSchema,
});

export const GovernanceTokenSchema = z.object({
  chainId: ChainIdSchema,
});

export const GetGlobalTokenSymbolSchema = z.object({
  chainId: ChainIdSchema,
});

export const PublicLockLatestVersionSchema = z.object({
  chainId: ChainIdSchema,
});

// Schema map for validation
export const FUNCTION_SCHEMAS = {
  // Read functions
  balanceOf: BalanceOfSchema,
  getApproved: GetApprovedSchema,
  ownerOf: OwnerOfSchema,
  tokenByIndex: TokenByIndexSchema,
  tokenOfOwnerByIndex: TokenOfOwnerByIndexSchema,
  tokenURI: TokenURISchema,
  totalSupply: BaseOperationSchema,
  supportsInterface: SupportsInterfaceSchema,
  expirationDuration: BaseOperationSchema,
  freeTrialLength: BaseOperationSchema,
  gasRefundValue: BaseOperationSchema,
  keyPrice: BaseOperationSchema,
  maxKeysPerAddress: BaseOperationSchema,
  maxNumberOfKeys: BaseOperationSchema,
  name: BaseOperationSchema,
  numberOfOwners: BaseOperationSchema,
  publicLockVersion: BaseOperationSchema,
  refundPenaltyBasisPoints: BaseOperationSchema,
  symbol: BaseOperationSchema,
  tokenAddress: BaseOperationSchema,
  transferFeeBasisPoints: BaseOperationSchema,
  getHasValidKey: GetHasValidKeySchema,
  isValidKey: IsValidKeySchema,
  keyExpirationTimestampFor: KeyExpirationTimestampForSchema,
  keyManagerOf: KeyManagerOfSchema,
  totalKeys: TotalKeysSchema,
  isRenewable: IsRenewableSchema,
  getCancelAndRefundValue: GetCancelAndRefundValueSchema,
  getTransferFee: GetTransferFeeSchema,
  purchasePriceFor: PurchasePriceForSchema,
  referrerFees: ReferrerFeesSchema,
  hasRole: HasRoleSchema,
  isLockManager: IsLockManagerSchema,
  isOwner: IsOwnerSchema,
  owner: BaseOperationSchema,
  unlockProtocol: BaseOperationSchema,
  
  // Write functions
  purchase: PurchaseSchema,
  extend: ExtendSchema,
  grantKeys: GrantKeysSchema,
  grantKeyExtension: GrantKeyExtensionSchema,
  setKeyExpiration: SetKeyExpirationSchema,
  setKeyManagerOf: SetKeyManagerOfSchema,
  renewMembershipFor: RenewMembershipForSchema,
  approve: ApproveSchema,
  transferFrom: TransferFromSchema,
  safeTransferFrom: SafeTransferFromSchema,
  lendKey: LendKeySchema,
  unlendKey: UnlendKeySchema,
  shareKey: ShareKeySchema,
  cancelAndRefund: CancelAndRefundSchema,
  expireAndRefundFor: ExpireAndRefundForSchema,
  burn: BurnSchema,
  updateKeyPricing: UpdateKeyPricingSchema,
  updateLockConfig: UpdateLockConfigSchema,
  updateRefundPenalty: UpdateRefundPenaltySchema,
  updateTransferFee: UpdateTransferFeeSchema,
  setLockMetadata: SetLockMetadataSchema,
  setReferrerFee: SetReferrerFeeSchema,
  setGasRefundValue: SetGasRefundValueSchema,
  withdraw: WithdrawSchema,
  grantRole: GrantRoleSchema,
  renounceRole: RenounceRoleSchema,
  revokeRole: RevokeRoleSchema,
  renounceLockManager: BaseOperationSchema,
  setOwner: SetOwnerSchema,
  setEventHooks: SetEventHooksSchema,
  mergeKeys: MergeKeysSchema,
  migrate: MigrateSchema,
  
  // Unlock contract functions
  createLock: CreateLockSchema,
  createUpgradeableLock: CreateUpgradeableLockSchema,
  upgradeLock: UpgradeLockSchema,
  
  // Unlock read functions
  chainIdRead: ChainIdReadSchema,
  unlockVersion: UnlockVersionSchema,
  governanceToken: GovernanceTokenSchema,
  getGlobalTokenSymbol: GetGlobalTokenSymbolSchema,
  publicLockLatestVersion: PublicLockLatestVersionSchema,
} as const;

export type FunctionName = keyof typeof FUNCTION_SCHEMAS;