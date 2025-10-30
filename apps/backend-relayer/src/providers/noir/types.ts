import { MerkleProof } from 'proofbridge-mmr';

export type T_ProofParams = {
  isAdCreator: boolean;
  merkleProof: MerkleProof;
  orderHash: string;
  targetRoot: string;
  secret: string;
};

export type T_ProofResponse = {
  proof: string;
  publicInputs: string[];
};
