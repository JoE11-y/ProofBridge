import { Proof } from '@accumulators/merkle-mountain-range';

export type T_ProofParams = {
  isAdCreator: boolean;
  merkleProof: Proof;
  orderHash: string;
  targetRoot: string;
  secret: string;
};

export type T_ProofResponse = {
  proof: string;
  publicInputs: string[];
};
