import {
  hederaTestnet,
  optimismSepolia,
  polygonAmoy,
  sepolia,
} from "viem/chains"

export const chain_icons: Record<string, string> = {
  [sepolia.id]: "/assets/logos/eth.svg",
  [hederaTestnet.id]: "/assets/logos/hbar.png",
  [polygonAmoy.id]: "/assets/logos/hbar.png",
  [optimismSepolia.id]: "/assets/logos/hbar.png",
}
