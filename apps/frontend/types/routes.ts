import { Address } from "viem"

export interface IRoute {
  id: string
  metadata: {}
  createdAt: string
  updatedAt: string
  orderToken: IToken
  adToken: IToken
}

export interface IGetRoutesParams {
  limit?: string
  cursor?: string
  orderTokenId?: string
  adTokenId?: string
  orderChainId: string
  adChainId: string
}

interface IToken {
  id: string
  symbol: string
  name: string
  address: Address
  decimals: number
  kind: string
  chain: {
    id: string
    name: string
    chainId: string
  }
}
