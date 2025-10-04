import { TypedDataEncoder, Wallet, recoverAddress } from 'ethers';
import {
  T_AdManagerOrderParams,
  T_OrderParams,
  T_OrderPortalParams,
} from '../types';

// ----------------------------
// OrderPortal typed data
// ----------------------------

export const domain = {
  name: 'Proofbridge',
  version: '1',
};

// ----------------------------
// OrderPortal typed data
// ----------------------------
export const orderTypes: Record<string, { name: string; type: string }[]> = {
  Order: [
    { name: 'orderChainToken', type: 'address' },
    { name: 'adChainToken', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'bridger', type: 'address' },
    { name: 'orderChainId', type: 'uint256' },
    { name: 'orderPortal', type: 'address' },
    { name: 'orderRecipient', type: 'address' },
    { name: 'adChainId', type: 'uint256' },
    { name: 'adManager', type: 'address' },
    { name: 'adId', type: 'string' },
    { name: 'adCreator', type: 'address' },
    { name: 'adRecipient', type: 'address' },
    { name: 'salt', type: 'uint256' },
  ],
};

export function getTypedHash(data: T_OrderParams) {
  const params = {
    ...data,
    salt: uuidToBigInt(data.salt),
  };
  const orderHash = TypedDataEncoder.hash(domain, orderTypes, params);
  return orderHash;
}

export function verifyTypedData(
  hash: `0x${string}`,
  signature: `0x${string}`,
  expectedAddress: `0x${string}`,
) {
  const recoveredAddress = recoverAddress(hash, signature);
  return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
}

export function uuidToBigInt(uuid: string): bigint {
  const hex = uuid.replace(/-/g, '');
  return BigInt('0x' + hex);
}

export function buildOrderParams(
  orderParams: T_OrderParams,
  isAdChain: boolean,
) {
  const {
    orderChainToken,
    adChainToken,
    amount,
    bridger,
    orderRecipient,
    adChainId,
    orderChainId,
    orderPortal,
    adManager,
    adId,
    adCreator,
    adRecipient,
    salt,
  } = orderParams;

  if (isAdChain) {
    const params: T_AdManagerOrderParams = {
      orderChainToken,
      adChainToken,
      amount,
      bridger,
      orderRecipient,
      orderChainId,
      orderPortal,
      adId,
      adCreator,
      adRecipient,
      salt: uuidToBigInt(salt).toString(),
    };
    return params;
  } else {
    const params: T_OrderPortalParams = {
      orderChainToken,
      adChainToken,
      amount,
      bridger,
      orderRecipient,
      adChainId,
      adManager,
      adId,
      adCreator,
      adRecipient,
      salt: uuidToBigInt(salt).toString(),
    };
    return params;
  }
}

export async function signTypedOrder(signer: string, data: T_OrderParams) {
  const wallet = new Wallet(signer);
  const params = {
    ...data,
    salt: BigInt(data.salt),
  };
  const signature = await wallet.signTypedData(domain, orderTypes, params);
  return signature;
}
