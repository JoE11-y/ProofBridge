# ProofBridge MMR

A TypeScript implementation of Merkle Mountain Range (MMR) data structure with **full compatibility** with Solidity implementations. Uses Poseidon2 hashing for zero-knowledge proof applications and LevelDB for persistent storage.

## Features

- ✅ **Solidity Compatible** - Produces identical cryptographic outputs to Solidity MMR implementations
- ✅ **Poseidon2 Hashing** - Optimized for zero-knowledge proofs
- ✅ **Persistent Storage** - LevelDB-backed storage for production use
- ✅ **Merkle Proofs** - Generate and verify inclusion proofs
- ✅ **Type-Safe** - Full TypeScript support with type definitions
- ✅ **Tested** - Cross-platform verification with Solidity test suite

## Installation

```bash
npm install proofbridge-mmr
```

## Quick Start

```typescript
import { MerkleMountainRange, Poseidon2Hasher, LevelDB } from "proofbridge-mmr";
import { keccak256 } from "ethers";

// Initialize database and hasher
const db = new LevelDB("./mmr-data");
await db.init();

const hasher = new Poseidon2Hasher();
const mmr = new MerkleMountainRange("my-mmr", db, hasher);
await mmr.init();

// Hash your data (using keccak256 or any hash function)
function hashData(data: string): Buffer {
  const hash = keccak256(data);
  return Buffer.from(hash, "hex");
}

// Append leaves to the MMR
await mmr.append(hashData("0x0001"));
await mmr.append(hashData("0x0002"));
await mmr.append(hashData("0x0003"));

// Get the root
console.log("Root:", mmr.root.toString("hex"));
console.log("Width:", mmr.width);
console.log("Size:", mmr.size);

// Generate a Merkle proof
const proof = await mmr.getMerkleProof(2);
console.log("Proof:", {
  root: proof.root.toString("hex"),
  width: proof.width,
  peakBagging: proof.peakBagging.map(p => p.toString("hex")),
  siblings: proof.siblings.map(s => s.toString("hex"))
});

// Clean up
await db.close();
```

## API Reference

### `MerkleMountainRange`

Main MMR class for managing the tree structure.

#### Constructor

```typescript
constructor(prefix: string, db: LevelDB, hasher: Poseidon2Hasher)
```

- `prefix`: Namespace prefix for database keys
- `db`: LevelDB instance for storage
- `hasher`: Poseidon2Hasher instance

#### Methods

##### `async init(): Promise<void>`

Initialize the MMR by loading state from database.

##### `async append(elem: Buffer | number | bigint): Promise<number>`

Append a new leaf to the MMR.

- **Parameters:** Pre-hashed data as Buffer, number, or bigint
- **Returns:** Index where the element was stored

##### `async getMerkleProof(index: number): Promise<MerkleProof>`

Generate a Merkle proof for a specific index.

- **Parameters:** Index of the leaf
- **Returns:** MerkleProof object containing root, width, peaks, and siblings

##### `async getPeaks(): Promise<Buffer[]>`

Get all current peaks of the MMR.

- **Returns:** Array of peak hashes

#### Properties

- `root: Buffer` - Current root hash
- `width: number` - Number of leaves in the MMR
- `size: number` - Total number of nodes (including internal nodes)

### `Poseidon2Hasher`

Hasher implementation using Poseidon2.

```typescript
const hasher = new Poseidon2Hasher();
const hash = hasher.hash([data1, data2]);
```

### `LevelDB`

Persistent storage backend.

```typescript
const db = new LevelDB("./data-path");
await db.init();
// ... use db
await db.close();
```

## How It Works

### Merkle Mountain Range

MMR is an append-only Merkle tree structure that forms "peaks" as elements are added:

```
Appending 10 items creates:
             15
      7             14
   3     6      10      13      18
 1  2  4  5   8  9   11  12  16  17
```

### Poseidon2 Hashing

The MMR uses Poseidon2, a ZK-friendly hash function optimized for use in zero-knowledge proof systems. All internal nodes are hashed using:

```typescript
hash_2(left, right) // For internal nodes
```

### Peak Bagging

Multiple peaks are combined into a single root using an iterative hashing process:

```typescript
acc = size
acc = hash_2(size, peak[0])
acc = hash_2(acc, peak[1])
...
innerHash = acc
root = hash_2(size, innerHash)
```

## Use Cases

- **Blockchain State Commitments** - Efficient append-only commitment schemes
- **Audit Logs** - Tamper-proof append-only logs with proof generation
- **Zero-Knowledge Proofs** - ZK-friendly accumulator for set membership proofs
- **Cross-Chain Bridges** - State synchronization between chains (e.g., Hedera)

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Clean

```bash
npm run clean
```

## License

MIT

## Credits

Here’s a much cleaner, well-structured **Credits** section you can drop straight into your README 👇

---

## 🏗️ Credits

This implementation builds on several open-source projects and specifications that shaped its design and cryptographic foundations:

- **Solidity-MMR by [@wanseob](https://github.com/wanseob/solidity-mmr)**
  Original reference implementation of the Merkle Mountain Range (MMR) in Solidity.
  Licensed under **MIT**.

- **Poseidon2 Library — [@zkpassport/poseidon2](https://www.npmjs.com/package/@zkpassport/poseidon2)**
  Used for efficient field-based Poseidon2 hashing and finite-field arithmetic.
  Licensed under **MIT**.

- **MerkleTreeJS — [@miguelmota](https://github.com/miguelmota/merkletreejs)**
  Inspiration for JavaScript-side proof generation and verification utilities.
  Licensed under **MIT**.

## Contributing

Contributions welcome! This implementation is designed to maintain **exact compatibility** with Solidity MMR implementations, so any changes must preserve cryptographic output equivalence.
