import { Address } from "viem"

export interface IGetTokensParams {
  limit?: string
  cursor?: string
  chainId?: string
  address?: string
}

export interface IToken {
  id: string
  symbol: string
  name: string
  address: Address
  decimals: number
  kind: string
  createdAt: string
  updatedAt: string
  chain: {
    id: string
    name: string
    chainId: string
  }
}
