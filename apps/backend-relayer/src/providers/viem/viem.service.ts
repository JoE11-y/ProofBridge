/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  Chain,
  createPublicClient,
  createWalletClient,
  http,
  keccak256,
  parseUnits,
  toHex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import BigNumber from 'bignumber.js';
import { randomUUID } from 'crypto';
import { getTime } from 'date-fns';
import { sepolia, hederaTestnet } from 'viem/chains';
import {
  T_CloseAdRequest,
  T_CloseAdRequestContractDetails,
  T_CreatFundAdRequest,
  T_CreatFundAdRequestContractDetails,
  T_CreateAdRequest,
  T_CreateAdRequestContractDetails,
  T_CreateOrderRequest,
  T_CreateOrderRequestContractDetails,
  T_LockForOrderRequest,
  T_LockForOrderRequestContractDetails,
  T_RequestValidation,
  T_WithdrawFromAdRequest,
  T_WithdrawFromAdRequestContractDetails,
} from '../common/types';
import { AD_MANAGER_ABI } from './abis/adManager.abi';
import { ORDER_PORTAL_ABI } from './abis/orderPortal.abi';
import { env } from '@libs/configs';
import { getTypedHash } from '../ethers/typedData';

@Injectable()
export class ViemService {
  private readonly MILLISECOND = 1000;
  static FIVE_MINUTES: number = 300000;
  static TEN_MINUTES: number = 600000;

  constructor() {}
  getClient(chainId: string): { wallet: any; client: any } {
    let chain: Chain;

    if (chainId === '11155111') {
      chain = sepolia;
    } else {
      chain = hederaTestnet;
    }

    const wallet = createWalletClient({
      chain,
      transport: http(),
      account: privateKeyToAccount(env.admin as `0x${string}`),
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
      token,
      timeToExpire: Number(timeToExpire),
      adId,
      adToken,
      orderChainId: orderChainId.toString(),
      adRecipient,
      msgHash: message,
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
      args: [adId, parseUnits(amount, 18), token, timeToExpire],
    });

    const signature = await wallet.signMessage({
      message: { raw: message },
    });
    return {
      contractAddress: adContractAddress,
      signature,
      token,
      timeToExpire: Number(timeToExpire),
      adId,
      amount,
      msgHash: message,
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
      args: [adId, parseUnits(amount, 18), to, token, timeToExpire],
    });

    const signature = await wallet.signMessage({
      message: { raw: message },
    });
    return {
      contractAddress: adContractAddress,
      signature,
      token,
      timeToExpire: Number(timeToExpire),
      adId,
      amount,
      to,
      msgHash: message,
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
      token,
      timeToExpire: Number(timeToExpire),
      adId,
      to,
      msgHash: message,
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
      token,
      timeToExpire: Number(timeToExpire),
      orderParams,
      msgHash: message,
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
      args: [orderHash, token, timeToExpire],
    });

    const signature = await wallet.signMessage({
      message: { raw: message },
    });

    return {
      contractAddress: orderParams.orderPortal,
      signature,
      token,
      timeToExpire: Number(timeToExpire),
      orderParams,
      msgHash: message,
    };
  }

  async validateAdManagerRequest(data: T_RequestValidation): Promise<boolean> {
    const { chainId, contractAddress, msgHash } = data;

    const { client } = this.getClient(chainId.toString());

    const recorded = await client.readContract({
      address: contractAddress,
      abi: AD_MANAGER_ABI,
      functionName: 'checkRequestHashExists',
      args: [msgHash],
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
    const { chainId, contractAddress, msgHash } = data;

    const { client } = this.getClient(chainId.toString());

    const recorded = await client.readContract({
      address: contractAddress,
      abi: AD_MANAGER_ABI,
      functionName: 'checkRequestHashExists',
      args: [msgHash],
    });

    if (recorded) {
      return true;
    } else {
      return false;
    }
  }
}
