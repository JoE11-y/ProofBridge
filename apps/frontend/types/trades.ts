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
