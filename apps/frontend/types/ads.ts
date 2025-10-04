import { Address } from "viem"

export interface ICreateAdRequest {
  routeId: string
  creatorDstAddress: string
  fundAmount: string
  minAmount?: string
  maxAmount?: string
  metadata: {
    title: string
    description: string
  }
}

export interface ICreateAdResponse {
  contractAddress: Address
  signature: Address
  authToken: Address
  timeToExpire: number
  adId: string
  adToken: Address
  orderChainId: string
  adRecipient: Address
  reqHash: Address
  chainId: number
}

export interface IFundAdResponse {
  contractAddress: Address
  signature: Address
  authToken: Address
  timeToExpire: number
  adId: string
  adToken: Address
  orderChainId: string
  adRecipient: Address
  reqHash: Address
  chainId: number
  amount: number
}

export interface ITopUpAdRequest {
  adId: string
  poolAmountTopUp: string
  amountBigInt: BigInt
}

export interface IWithdrawFromAdRequest {
  adId: string
  poolAmountWithdraw: string
  amountBigInt: BigInt
  to: Address
}

export interface IWithdrawFromAdResponse {
  chainId: string
  contractAddress: Address
  signature: Address
  authToken: Address
  timeToExpire: number
  adId: string
  amount: string
  to: Address
  reqHash: Address
}

export interface ICloseAdRequest {
  adId: string
  to: Address
}

export interface ICloseAdResponse {
  chainId: string
  contractAddress: Address
  signature: Address
  authToken: Address
  timeToExpire: number
  adId: string
  amount: string
  to: Address
  reqHash: Address
}

export interface IUpdateAdRequest {
  status?: "ACTIVE" | "INACTIVE"
  minAmount?: string
  maxAmount?: string
  metadata?: {
    title?: string
    description?: string
  }
  adId: string
}

export interface IUpdateAdResponse {
  id: string
  creatorAddress: string
  minAmount: {}
  maxAmount: {}
  metadata: {}
}

export interface IConfirmAdTxRequest {
  adId: string
  txHash: Address
  signature: Address
}

export interface IAd {
  id: string
  creatorAddress: string
  routeId: string
  adTokenId: string
  orderTokenId: string
  poolAmount: string
  availableAmount: string
  minAmount: string
  maxAmount: string
  status: "ACTIVE" | "PAUSED" | "INACTIVE" | "EXHAUSTED" | "CLOSED"
  metadata: { title?: string; description?: string }
  createdAt: string
  updatedAt: string
  adToken: {
    name: string
    symbol: string
    address: string
    decimals: number
    chainId: string
  }
  orderToken: {
    name: string
    symbol: string
    address: string
    decimals: number
    chainId: string
  }
}

export interface IGetAdsParams {
  creatorAddress?: Address
  routeId?: string
  status?: "ACTIVE" | "PAUSED" | "INACTIVE" | "EXHAUSTED" | "CLOSED"
  cursor?: string
  limit?: number
}
