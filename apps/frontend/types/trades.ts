import { Address } from "viem"
import { AdStatusT } from "./ads"
import { IToken } from "./tokens"

export interface ICreateTradeRequest {
  adId: string
  routeId: string
  amount: string
  bridgerDstAddress: Address
}

export interface ICreateTradeResponse {
  tradeId: string
  reqContractDetails: {
    chainId: string
    contractAddress: Address
    signature: Address
    authToken: Address
    timeToExpire: number
    orderParams: {
      orderChainToken: Address
      adChainToken: Address
      amount: string
      bridger: Address
      orderRecipient: Address
      adChainId: string
      adManager: Address
      adId: string
      adCreator: Address
      adRecipient: Address
      salt: string
    }
    orderHash: string
    reqHash: string
  }
}

export interface ILockFundsReponse {
  chainId: string
  contractAddress: Address
  signature: Address
  authToken: Address
  timeToExpire: number
  orderParams: {
    orderChainToken: string
    adChainToken: string
    amount: string
    bridger: string
    orderChainId: string
    srcOrderPortal: string
    orderRecipient: string
    adId: string
    adCreator: string
    adRecipient: string
    salt: string
  }
  orderHash: string
  reqHash: string
}

export interface IUnlockFundsResponse {
  chainId: string
  contractAddress: Address
  signature: Address
  authToken: string
  timeToExpire: number
  orderParams: {
    orderChainToken: Address
    adChainToken: Address
    amount: string
    bridger: Address
    orderChainId: string
    orderPortal: Address
    orderRecipient: Address
    adId: string
    adCreator: Address
    adRecipient: Address
    salt: string
    adChainId: string
  }
  nullifierHash: Address
  targetRoot: Address
  proof: Address
  orderHash: Address
  reqHash: Address
}

export interface IUnlockFundsRequest {
  id: string
  signature: Address
}

export interface IConfirmUnlockFundsRequest {
  id: string
  signature: Address
  txHash: Address
}

export interface IConfirmTradeTxRequest {
  tradeId: string
  txHash: Address
  signature: Address
}

export interface IConfirmTradeTxReponse {
  tradeId: string
  success: true
}

export interface IGetTradesParams {
  adCreatorAddress?: Address
  bridgerAddress?: Address
  routeId?: string
  cursor?: string
  limit?: number
  AdId?: string
  minAmount?: string
  maxAmount?: string
  orderTokenId?: string
  adTokenId?: string
}

export interface ITrade {
  id: string
  routeId: string
  adId: string
  adCreatorAddress: Address
  bridgerAddress: Address
  amount: string
  status: AdStatusT
  createdAt: string
  updatedAt: string
  ad: {
    id: string
    routeId: string
    creatorAddress: Address
  }
  route: {
    id: string
    adToken: IToken
    orderToken: IToken
  }
}

export interface ITradeParams {
  orderChainToken: Address
  adChainToken: Address
  amount: string
  bridger: Address
  orderRecipient: Address
  adId: string
  adCreator: Address
  adRecipient: Address
  salt: string
  orderChainId: string
  orderPortal: Address
  adChainId: string
  adManager: Address
}
