import { TypedDataEncoder } from 'ethers';
import { T_OrderParams } from '../common/types';

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
  const orderHash = TypedDataEncoder.hash(domain, orderTypes, data);
  return orderHash;
}
