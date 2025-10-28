import { createConfig } from "wagmi"
import {
  hederaTestnet,
  optimismSepolia,
  polygonAmoy,
  sepolia,
} from "viem/chains"
import { http } from "viem"

export const config = createConfig({
  chains: [hederaTestnet, sepolia, optimismSepolia, polygonAmoy],

  transports: {
    [hederaTestnet.id]: http(),
    [sepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [polygonAmoy.id]: http(),
  },
})
