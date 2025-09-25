import { createConfig } from "wagmi"
import { hederaTestnet, sepolia } from "viem/chains"
import { http } from "viem"

export const config = createConfig({
  chains: [hederaTestnet, sepolia],

  transports: {
    [hederaTestnet.id]: http(),
    [sepolia.id]: http(),
  },
})
