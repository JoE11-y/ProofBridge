import { Address } from "viem"

export interface IChain {
  name: string
  chainId: string
  adManagerAddress: Address
  orderPortalAddress: Address
  createdAt: string
  updatedAt: string
}
