import { Chain, hederaTestnet, sepolia } from "viem/chains"

export const chains: Record<string, Chain> = {
  [hederaTestnet.id]: hederaTestnet,
  [sepolia.id]: sepolia,
}
