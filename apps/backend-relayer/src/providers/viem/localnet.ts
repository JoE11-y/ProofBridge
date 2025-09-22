import { Chain, defineChain } from 'viem';

export const ethLocalnet: Chain = defineChain({
  id: 1337,
  name: 'ETH LOCALNET',
  nativeCurrency: {
    decimals: 18,
    name: 'ETHEREYM',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
});

export const hederaLocalnet: Chain = defineChain({
  id: 196,
  name: 'HEDERA LOCALNET',
  nativeCurrency: {
    decimals: 18,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:5600'],
    },
  },
});
