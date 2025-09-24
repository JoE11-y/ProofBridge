import { writeFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { hederaTestnet as hederaLocalnet } from 'viem/chains';

import MerkleManagerArtifact from '../../../contracts/out/MerkleManager.sol/MerkleManager.json';
import VerifierArtifact from '../../../contracts/out/Verifier.sol/HonkVerifier.json';
import AdManagerArtifact from '../../../contracts/out/AdManager.sol/AdManager.json';
import OrderPortalArtifact from '../../../contracts/out/OrderPortal.sol/OrderPortal.json';
import Erc20MockArtifact from '../../../contracts/out/ERC20Mock.sol/ERC20Mock.json';

import { createPublicClient, createWalletClient, http } from 'viem';
import { ethLocalnet } from '../../src/providers/viem/localnet';
import { AddressLike, ChainData, fundEthAddress } from './utils';
import { adminSetup } from './contract-actions';
import { privateKeyToAccount } from 'viem/accounts';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

export async function deployContracts(isEth = true): Promise<ChainData> {
  // Log which network we're deploying to
  console.log(`Deploying ${isEth ? 'ETH' : 'HEDERA'} contracts...`);

  // Validate environment and setup chain configuration
  const managerKey = process.env.MANAGER_KEY;
  if (!managerKey) {
    throw new Error('MANAGER_KEY not set in environment');
  }
  const chain = isEth ? ethLocalnet : hederaLocalnet;

  // Initialize clients
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  const wallet = createWalletClient({
    chain,
    transport: http(),
    account: privateKeyToAccount(managerKey as AddressLike),
  });

  const managerAddress = wallet.account.address;

  // Fund manager account if on Ethereum network
  if (isEth) {
    await fundEthAddress(publicClient, managerAddress, '1');
  }
  console.log('Using manager address:', wallet.account.address);

  // Deploy mock ERC20 token
  const hash = await wallet.deployContract({
    abi: Erc20MockArtifact.abi,
    bytecode: Erc20MockArtifact.bytecode.object as `0x${string}`,
    args: [],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const erc20Address = receipt.contractAddress!;
  console.log('ERC20Mock deployed to:', erc20Address);

  // Deploy Verifier contract
  const txHash = await wallet.deployContract({
    abi: VerifierArtifact.abi,
    bytecode: VerifierArtifact.bytecode.object as `0x${string}`,
    args: [],
  });
  const txReceipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  const verifierAddress = txReceipt.contractAddress!;
  console.log('Verifier deployed to:', verifierAddress);

  // Deploy MerkleManager contract
  const mmHash = await wallet.deployContract({
    abi: MerkleManagerArtifact.abi,
    bytecode: MerkleManagerArtifact.bytecode.object as `0x${string}`,
    args: [managerAddress],
  });
  const mmReceipt = await publicClient.waitForTransactionReceipt({
    hash: mmHash,
  });
  const merkleManagerAddress = mmReceipt.contractAddress!;
  console.log('MerkleManager deployed to:', merkleManagerAddress);

  // Deploy AdManager contract
  const adHash = await wallet.deployContract({
    abi: AdManagerArtifact.abi,
    bytecode: AdManagerArtifact.bytecode.object as `0x${string}`,
    args: [managerAddress, verifierAddress, merkleManagerAddress],
  });
  const adReceipt = await publicClient.waitForTransactionReceipt({
    hash: adHash,
  });
  const adManagerAddress = adReceipt.contractAddress!;
  console.log('AdManager deployed to:', adManagerAddress);

  // Deploy OrderPortal contract
  const orderHash = await wallet.deployContract({
    abi: OrderPortalArtifact.abi,
    bytecode: OrderPortalArtifact.bytecode.object as `0x${string}`,
    args: [managerAddress, verifierAddress, merkleManagerAddress],
  });
  const orderReceipt = await publicClient.waitForTransactionReceipt({
    hash: orderHash,
  });
  const orderPortalAddress = orderReceipt.contractAddress!;
  console.log('OrderPortal deployed to:', orderPortalAddress);

  // Create contracts data object
  const contracts: ChainData = {
    adManagerAddress,
    orderPortalAddress,
    chainId: chain.id.toString(),
    name: isEth ? 'ETH LOCALNET' : 'HEDERA LOCALNET',
    tokenName: 'ERC20Mock',
    tokenSymbol: 'E20M',
    tokenAddress: erc20Address,
    merkleManagerAddress,
    verifierAddress,
  };

  // Save contract addresses to file
  const filePath = path.join(
    __dirname,
    isEth ? 'eth-deployed-contracts.json' : 'hedera-deployed-contracts.json',
  );
  writeFileSync(filePath, JSON.stringify(contracts, null, 2));
  console.log('Contract addresses saved to:', filePath);

  return contracts;
}

export async function setupContract(
  chain1: ChainData,
  chain2: ChainData,
  isEth = true,
) {
  const managerKey = process.env.MANAGER_KEY;

  if (!managerKey) {
    throw new Error('MANAGER_KEY not set in environment');
  }
  const chain = isEth ? ethLocalnet : hederaLocalnet;

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  const account = privateKeyToAccount(managerKey as AddressLike);

  await adminSetup(publicClient, account, chain1, chain2);
}

export async function setupContracts() {
  const ethContracts = await deployContracts();
  const hederaContracts = await deployContracts(false);

  // const ethContracts = {
  //   adManagerAddress: '0xc21b39b9a2365d5ca5196d3ffbe88d69df623e6d',
  //   orderPortalAddress: '0x23ba431f5ba7a2f3fa5b23fe684909f0c92d48c0',
  //   chainId: '31337',
  //   name: 'ETH LOCALNET',
  //   tokenName: 'ERC20Mock',
  //   tokenSymbol: 'E20M',
  //   tokenAddress: '0x9521027d1eaf23bf7bc884d3a2ac51746c68ce7d',
  //   merkleManagerAddress: '0x98e170cfc30e70da1e466600138a7bf9ec540bf2',
  //   verifierAddress: '0xd19af5219c1a70e88ec83a1920cd5f1825165eb7',
  // };

  // const hederaContracts = {
  //   adManagerAddress: '0xf61c50d92a51a95eb64d629f6d01e67ca12cb035',
  //   orderPortalAddress: '0x6b380f858a3e6afdb5a8c1feb122abb367a5827b',
  //   chainId: '296',
  //   name: 'HEDERA LOCALNET',
  //   tokenName: 'ERC20Mock',
  //   tokenSymbol: 'E20M',
  //   tokenAddress: '0x38d99cb3093175c8350ca1abc983fc61611a17dc',
  //   merkleManagerAddress: '0xc1e29a3a6ab0de704768da78a1f39695346a762c',
  //   verifierAddress: '0x183d01dd27c0cb316fec6f5f2d023055c65bf01c',
  // };

  console.log('Setting up ETH contracts...');

  await setupContract(ethContracts, hederaContracts);

  console.log('Setting up HEDERA contracts...');

  await setupContract(hederaContracts, ethContracts, false);

  return { ethContracts, hederaContracts };
}
