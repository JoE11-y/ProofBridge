/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  Chain,
  createPublicClient,
  createWalletClient,
  http,
  keccak256,
  toHex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import BigNumber from 'bignumber.js';
import { randomUUID } from 'crypto';
import { getTime } from 'date-fns';
import { sepolia, hederaTestnet } from 'viem/chains';
import {
  T_AdManagerOrderParams,
  T_CloseAdRequest,
  T_CloseAdRequestContractDetails,
  T_CreatFundAdRequest,
  T_CreatFundAdRequestContractDetails,
  T_CreateAdRequest,
  T_CreateAdRequestContractDetails,
  T_CreateOrderRequest,
  T_CreateOrderRequestContractDetails,
  T_CreateUnlockOrderContractDetails,
  T_FetchRoot,
  T_LockForOrderRequest,
  T_LockForOrderRequestContractDetails,
  T_OrderParams,
  T_OrderPortalParams,
  T_RequestValidation,
  T_UnlockOrderContractDetails,
  T_WithdrawFromAdRequest,
  T_WithdrawFromAdRequestContractDetails,
} from './types';
import { AD_MANAGER_ABI } from './abis/adManager.abi';
import { ORDER_PORTAL_ABI } from './abis/orderPortal.abi';
import { env } from '@libs/configs';
import { getTypedHash, verifyTypedData } from './ethers/typedData';
import { ethLocalnet, hederaLocalnet } from '../viem/localnet';

@Injectable()
export class ViemService {
  private readonly MILLISECOND = 1000;
  static FIVE_MINUTES: number = 300000;
  static TEN_MINUTES: number = 600000;

  constructor() {}
  getClient(chainId: string): { wallet: any; client: any } {
    let chain: Chain;

    const id = Number(chainId);

    if (id === sepolia.id) {
      chain = sepolia;
    } else if (id === hederaTestnet.id) {
      chain = hederaTestnet;
    } else if (id === ethLocalnet.id) {
      chain = ethLocalnet;
    } else if (id === hederaLocalnet.id) {
      chain = hederaLocalnet;
    } else {
      throw new Error(`Unsupported chainId: ${chainId}`);
    }

    const adminKey = env.admin as `0x${string}`;

    if (!adminKey) {
      throw new Error(
        'Missing/invalid ADMIN_SECRET (expected 0x-prefixed 32-byte hex).',
      );
    }

    const wallet = createWalletClient({
      chain,
      transport: http(),
      account: privateKeyToAccount(adminKey),
    });

    const client = createPublicClient({
      chain,
      transport: http(),
    });

    return {
      wallet,
      client,
    };
  }
  async getCreateAdRequestContractDetails(
    data: T_CreateAdRequest,
  ): Promise<T_CreateAdRequestContractDetails> {
    const {
      adChainId,
      adContractAddress,
      adId,
      adToken,
      orderChainId,
      adRecipient,
    } = data;
    const { client, wallet } = this.getClient(adChainId.toString());
    const token: `0x${string}` = keccak256(toHex(randomUUID()));
    const timeToMilliseconds: number =
      getTime(new Date()) + ViemService.TEN_MINUTES;

    const timeToExpire: bigint = BigInt(
      BigNumber(timeToMilliseconds).div(this.MILLISECOND).toFixed(0),
    );

    const message = await client.readContract({
      address: adContractAddress,
      abi: AD_MANAGER_ABI,
      functionName: 'createAdRequestHash',
      args: [adId, adToken, orderChainId, adRecipient, token, timeToExpire],
    });

    const signature = await wallet.signMessage({
      message: { raw: message },
    });

    return {
      contractAddress: adContractAddress,
      signature,
      authToken: token,
      timeToExpire: Number(timeToExpire),
      adId,
      adToken,
      orderChainId: orderChainId.toString(),
      adRecipient,
      reqHash: message,
    };
  }

  async getFundAdRequestContractDetails(
    data: T_CreatFundAdRequest,
  ): Promise<T_CreatFundAdRequestContractDetails> {
    const { adChainId, adContractAddress, adId, amount } = data;
    const { client, wallet } = this.getClient(adChainId.toString());
    const token: `0x${string}` = keccak256(toHex(randomUUID()));

    const timeToMilliseconds: number =
      getTime(new Date()) + ViemService.FIVE_MINUTES;

    const timeToExpire: bigint = BigInt(
      BigNumber(timeToMilliseconds).div(this.MILLISECOND).toFixed(0),
    );

    const message = await client.readContract({
      address: adContractAddress,
      abi: AD_MANAGER_ABI,
      functionName: 'fundAdRequestHash',
      args: [adId, BigInt(amount), token, timeToExpire],
    });

    const signature = await wallet.signMessage({
      message: { raw: message },
    });
    return {
      contractAddress: adContractAddress,
      signature,
      authToken: token,
      timeToExpire: Number(timeToExpire),
      adId,
      amount,
      reqHash: message,
    };
  }

  async getWithdrawFromAdRequestContractDetails(
    data: T_WithdrawFromAdRequest,
  ): Promise<T_WithdrawFromAdRequestContractDetails> {
    const { adChainId, adContractAddress, adId, amount, to } = data;
    const { client, wallet } = this.getClient(adChainId.toString());
    const token: `0x${string}` = keccak256(toHex(randomUUID()));

    const timeToMilliseconds: number =
      getTime(new Date()) + ViemService.FIVE_MINUTES;

    const timeToExpire: bigint = BigInt(
      BigNumber(timeToMilliseconds).div(this.MILLISECOND).toFixed(0),
    );

    const message = await client.readContract({
      address: adContractAddress,
      abi: AD_MANAGER_ABI,
      functionName: 'withdrawFromAdRequestHash',
      args: [adId, BigInt(amount), to, token, timeToExpire],
    });

    const signature = await wallet.signMessage({
      message: { raw: message },
    });
    return {
      contractAddress: adContractAddress,
      signature,
      authToken: token,
      timeToExpire: Number(timeToExpire),
      adId,
      amount,
      to,
      reqHash: message,
    };
  }

  async getCloseAdRequestContractDetails(
    data: T_CloseAdRequest,
  ): Promise<T_CloseAdRequestContractDetails> {
    const { adChainId, adContractAddress, adId, to } = data;
    const { client, wallet } = this.getClient(adChainId.toString());
    const token: `0x${string}` = keccak256(toHex(randomUUID()));

    const timeToMilliseconds: number =
      getTime(new Date()) + ViemService.FIVE_MINUTES;

    const timeToExpire: bigint = BigInt(
      BigNumber(timeToMilliseconds).div(this.MILLISECOND).toFixed(0),
    );

    const message = await client.readContract({
      address: adContractAddress,
      abi: AD_MANAGER_ABI,
      functionName: 'closeAdRequestHash',
      args: [adId, to, token, timeToExpire],
    });

    const signature = await wallet.signMessage({
      message: { raw: message },
    });

    return {
      contractAddress: adContractAddress,
      signature,
      authToken: token,
      timeToExpire: Number(timeToExpire),
      adId,
      to,
      reqHash: message,
    };
  }

  async getLockForOrderRequestContractDetails(
    data: T_LockForOrderRequest,
  ): Promise<T_LockForOrderRequestContractDetails> {
    const { adChainId, orderParams } = data;
    const { client, wallet } = this.getClient(adChainId.toString());
    const token: `0x${string}` = keccak256(toHex(randomUUID()));

    const timeToMilliseconds: number =
      getTime(new Date()) + ViemService.TEN_MINUTES;
    const timeToExpire: bigint = BigInt(
      BigNumber(timeToMilliseconds).div(this.MILLISECOND).toFixed(0),
    );

    const orderHash = getTypedHash(data.orderParams);

    const message = await client.readContract({
      address: orderParams.adManager,
      abi: AD_MANAGER_ABI,
      functionName: 'lockForOrderRequestHash',
      args: [orderParams.adId, orderHash, token, timeToExpire],
    });

    const signature = await wallet.signMessage({
      message: { raw: message },
    });

    return {
      contractAddress: orderParams.adManager,
      signature,
      authToken: token,
      timeToExpire: Number(timeToExpire),
      orderParams,
      reqHash: message,
      orderHash: orderHash as `0x${string}`,
    };
  }

  async getCreateOrderRequestContractDetails(
    data: T_CreateOrderRequest,
  ): Promise<T_CreateOrderRequestContractDetails> {
    const { orderChainId, orderParams } = data;
    const { client, wallet } = this.getClient(orderChainId.toString());
    const token: `0x${string}` = keccak256(toHex(randomUUID()));

    const timeToMilliseconds: number =
      getTime(new Date()) + ViemService.TEN_MINUTES;

    const timeToExpire: bigint = BigInt(
      BigNumber(timeToMilliseconds).div(this.MILLISECOND).toFixed(0),
    );

    const orderHash = getTypedHash(data.orderParams);

    const message = await client.readContract({
      address: orderParams.orderPortal,
      abi: ORDER_PORTAL_ABI,
      functionName: 'createOrderRequestHash',
      args: [orderParams.adId, orderHash, token, timeToExpire],
    });

    const signature = await wallet.signMessage({
      message: { raw: message },
    });

    return {
      contractAddress: orderParams.orderPortal,
      signature,
      authToken: token,
      timeToExpire: Number(timeToExpire),
      orderParams,
      reqHash: message,
      orderHash: orderHash as `0x${string}`,
    };
  }

  async validateAdManagerRequest(data: T_RequestValidation): Promise<boolean> {
    const { chainId, contractAddress, reqHash } = data;

    const { client } = this.getClient(chainId.toString());

    const recorded = await client.readContract({
      address: contractAddress,
      abi: AD_MANAGER_ABI,
      functionName: 'checkRequestHashExists',
      args: [reqHash],
    });

    if (recorded) {
      return true;
    } else {
      return false;
    }
  }

  async validateOrderPortalRequest(
    data: T_RequestValidation,
  ): Promise<boolean> {
    const { chainId, contractAddress, reqHash } = data;

    const { client } = this.getClient(chainId.toString());

    const recorded = await client.readContract({
      address: contractAddress,
      abi: ORDER_PORTAL_ABI,
      functionName: 'checkRequestHashExists',
      args: [reqHash],
    });

    if (recorded) {
      return true;
    } else {
      return false;
    }
  }

  async fetchOnChainRoot(
    isAdCreator: boolean,
    data: T_FetchRoot,
  ): Promise<string> {
    if (isAdCreator) {
      return this.fetchAdChainRoot(data);
    } else {
      return this.fetchOrderChainRoot(data);
    }
  }

  async fetchAdChainRoot(data: T_FetchRoot): Promise<string> {
    const { chainId, contractAddress } = data;

    const { client } = this.getClient(chainId.toString());

    const root = await client.readContract({
      address: contractAddress,
      abi: AD_MANAGER_ABI,
      functionName: 'getMerkleRoot',
      args: [],
    });

    return root;
  }

  async fetchOrderChainRoot(data: T_FetchRoot): Promise<string> {
    const { chainId, contractAddress } = data;

    const { client } = this.getClient(chainId.toString());

    const root = await client.readContract({
      address: contractAddress,
      abi: ORDER_PORTAL_ABI,
      functionName: 'getMerkleRoot',
      args: [],
    });

    return root;
  }

  async getUnlockOrderContractDetails(
    data: T_CreateUnlockOrderContractDetails,
  ): Promise<T_UnlockOrderContractDetails> {
    const {
      chainId,
      contractAddress,
      isAdCreator,
      orderParams,
      nullifierHash,
      targetRoot,
      proof,
    } = data;

    const { client, wallet } = this.getClient(chainId.toString());
    const token: `0x${string}` = keccak256(toHex(randomUUID()));

    const timeToMilliseconds: number =
      getTime(new Date()) + ViemService.TEN_MINUTES;

    const timeToExpire: bigint = BigInt(
      BigNumber(timeToMilliseconds).div(this.MILLISECOND).toFixed(0),
    );

    const orderHash = getTypedHash(data.orderParams);

    const message = await client.readContract({
      address: contractAddress,
      abi: isAdCreator ? ORDER_PORTAL_ABI : AD_MANAGER_ABI,
      functionName: 'unlockOrderRequestHash',
      args: [orderParams.adId, orderHash, targetRoot, token, timeToExpire],
    });

    const signature = await wallet.signMessage({
      message: { raw: message },
    });

    const orderParamsFinal = isAdCreator
      ? (orderParams as T_OrderPortalParams)
      : (orderParams as T_AdManagerOrderParams);

    return {
      contractAddress,
      signature,
      authToken: token,
      timeToExpire: Number(timeToExpire),
      orderParams: orderParamsFinal,
      nullifierHash,
      targetRoot,
      proof,
      reqHash: message,
      orderHash: orderHash as `0x${string}`,
    };
  }

  orderTypeHash(orderParams: T_OrderParams): string {
    return getTypedHash(orderParams);
  }

  verifyOrderSignature(
    address: `0x${string}`,
    orderHash: `0x${string}`,
    signature: `0x${string}`,
  ): boolean {
    return verifyTypedData(orderHash, signature, address);
  }
}
