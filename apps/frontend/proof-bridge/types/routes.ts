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
  fromTokenId?: string
  toTokenId?: string
  fromChainId: string
  toChainId: string
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
