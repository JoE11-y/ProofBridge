export type T_CreateAdRequest = {
  adContractAddress: `0x${string}`;
  adChainId: number;
  adId: string;
  adToken: `0x${string}`;
  orderChainId: number;
  adRecipient: `0x${string}`;
};

export type T_CreateAdRequestContractDetails = {
  contractAddress: string;
  signature: `0x${string}`;
  token: string;
  timeToExpire: number;
  adId: string;
  adToken: `0x${string}`;
  orderChainId: number;
  adRecipient: `0x${string}`;
  msgHash: `0x${string}`;
};

export type T_CreatFundAdRequest = {
  adContractAddress: `0x${string}`;
  adChainId: number;
  adId: string;
  amount: string;
};

export type T_CreatFundAdRequestContractDetails = {
  contractAddress: string;
  signature: `0x${string}`;
  token: string;
  timeToExpire: number;
  adId: string;
  amount: string;
  msgHash: `0x${string}`;
};

export type T_WithdrawFromAdRequest = {
  adContractAddress: `0x${string}`;
  adChainId: number;
  adId: string;
  amount: string;
  to: `0x${string}`;
};

export type T_WithdrawFromAdRequestContractDetails = {
  contractAddress: string;
  signature: `0x${string}`;
  token: string;
  timeToExpire: number;
  adId: string;
  amount: string;
  to: `0x${string}`;
  msgHash: `0x${string}`;
};

export type T_CloseAdRequest = {
  adContractAddress: `0x${string}`;
  adChainId: number;
  adId: string;
  to: `0x${string}`;
};

export type T_CloseAdRequestContractDetails = {
  contractAddress: string;
  signature: `0x${string}`;
  token: string;
  timeToExpire: number;
  adId: string;
  to: `0x${string}`;
  msgHash: `0x${string}`;
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
  adChainId: number;
  orderParams: T_OrderParams;
};

export type T_LockForOrderRequestContractDetails = {
  contractAddress: string;
  signature: `0x${string}`;
  token: string;
  timeToExpire: number;
  orderParams: T_AdManagerOrderParams;
  msgHash: `0x${string}`;
};

export type T_CreateOrderRequest = {
  orderChainId: number;
  orderParams: T_OrderParams;
};

export type T_CreateOrderRequestContractDetails = {
  contractAddress: string;
  signature: `0x${string}`;
  token: string;
  timeToExpire: number;
  orderParams: T_OrderPortalParams;
  msgHash: `0x${string}`;
};

export type T_RequestValidation = {
  chainId: number;
  contractAddress: `0x${string}`;
  msgHash: `0x${string}`;
};
