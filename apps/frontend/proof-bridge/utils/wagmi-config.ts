import { createConfig } from "wagmi"
import { hedera, sepolia } from "viem/chains"
import { http } from "viem"

export const config = createConfig({
  chains: [hedera, sepolia],

  transports: {
    [hedera.id]: http(),
    [sepolia.id]: http(),
  },
})
