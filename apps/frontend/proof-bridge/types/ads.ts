import { Address } from "viem"

export interface ICreateAdRequest {
  routeId: string
  creatorDstAddress: string
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
