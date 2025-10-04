export type T_CreateAdRequest = {
  adContractAddress: `0x${string}`;
  adChainId: bigint;
  adId: string;
  adToken: `0x${string}`;
  initialAmount: string;
  orderChainId: bigint;
  adRecipient: `0x${string}`;
};

export type T_CreateAdRequestContractDetails = {
  chainId: string;
  contractAddress: string;
  signature: `0x${string}`;
  authToken: string;
  timeToExpire: number;
  adId: string;
  adToken: `0x${string}`;
  initialAmount: string;
  orderChainId: string;
  adRecipient: `0x${string}`;
  reqHash: `0x${string}`;
};

export type T_CreatFundAdRequest = {
  adContractAddress: `0x${string}`;
  adChainId: bigint;
  adId: string;
  amount: string;
};

export type T_CreatFundAdRequestContractDetails = {
  chainId: string;
  contractAddress: string;
  signature: `0x${string}`;
  authToken: string;
  timeToExpire: number;
  adId: string;
  amount: string;
  reqHash: `0x${string}`;
};

export type T_WithdrawFromAdRequest = {
  adContractAddress: `0x${string}`;
  adChainId: bigint;
  adId: string;
  amount: string;
  to: `0x${string}`;
};

export type T_WithdrawFromAdRequestContractDetails = {
  chainId: string;
  contractAddress: string;
  signature: `0x${string}`;
  authToken: string;
  timeToExpire: number;
  adId: string;
  amount: string;
  to: `0x${string}`;
  reqHash: `0x${string}`;
};

export type T_CloseAdRequest = {
  adContractAddress: `0x${string}`;
  adChainId: bigint;
  adId: string;
  to: `0x${string}`;
};

export type T_CloseAdRequestContractDetails = {
  chainId: string;
  contractAddress: string;
  signature: `0x${string}`;
  authToken: string;
  timeToExpire: number;
  adId: string;
  to: `0x${string}`;
  reqHash: `0x${string}`;
};

export type T_OrderParams = {
  orderChainToken: string;
  adChainToken: string;
  amount: string;
  bridger: string;
  orderChainId: string;
  orderPortal: string;
  orderRecipient: string;
  adChainId: string;
  adManager: string;
  adId: string;
  adCreator: string;
  adRecipient: string;
  salt: string;
};

export type T_AdManagerOrderParams = {
  orderChainToken: string;
  adChainToken: string;
  amount: string;
  bridger: string;
  orderChainId: string;
  orderPortal: string;
  orderRecipient: string;
  adId: string;
  adCreator: string;
  adRecipient: string;
  salt: string;
};

export type T_OrderPortalParams = {
  orderChainToken: string;
  adChainToken: string;
  amount: string;
  bridger: string;
  orderRecipient: string;
  adChainId: string;
  adManager: string;
  adId: string;
  adCreator: string;
  adRecipient: string;
  salt: string;
};

export type T_LockForOrderRequest = {
  adChainId: bigint;
  orderParams: T_OrderParams;
};

export type T_LockForOrderRequestContractDetails = {
  chainId: string;
  contractAddress: string;
  signature: `0x${string}`;
  authToken: string;
  timeToExpire: number;
  orderParams: T_AdManagerOrderParams;
  reqHash: `0x${string}`;
  orderHash: `0x${string}`;
};

export type T_CreateOrderRequest = {
  orderChainId: bigint;
  orderParams: T_OrderParams;
};

export type T_CreateUnlockOrderContractDetails = {
  chainId: bigint;
  contractAddress: `0x${string}`;
  isAdCreator: boolean;
  orderParams: T_OrderParams;
  nullifierHash: string;
  targetRoot: string;
  proof: string;
};

export type T_UnlockOrderContractDetails = {
  chainId: string;
  contractAddress: `0x${string}`;
  signature: `0x${string}`;
  authToken: string;
  timeToExpire: number;
  orderParams: T_AdManagerOrderParams | T_OrderPortalParams;
  nullifierHash: string;
  targetRoot: string;
  proof: string;
  orderHash: `0x${string}`;
  reqHash: `0x${string}`;
};

export type T_CreateOrderRequestContractDetails = {
  chainId: string;
  contractAddress: string;
  signature: `0x${string}`;
  authToken: string;
  timeToExpire: number;
  orderParams: T_OrderPortalParams;
  orderHash: `0x${string}`;
  reqHash: `0x${string}`;
};

export type T_RequestValidation = {
  chainId: bigint;
  contractAddress: `0x${string}`;
  reqHash: `0x${string}`;
};

export type T_FetchRoot = {
  chainId: bigint;
  contractAddress: `0x${string}`;
};

export type T_FetchRootResponse = {
  root: string;
};
