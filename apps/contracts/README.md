# Proofbridge Contracts

A minimal pair of contracts for **peer-to-peer cross-chain settlement** using **zk proofs** and **EIP-712** order hashes.

* **AdManager** (destination chain): Makers (LPs) create “ads”, fund escrow, and lock liquidity against off-chain **orders**. When the proof verifies, funds are released to the order’s recipient on this chain.
* **OrderPortal** (source chain): Bridgers open **orders** by depositing the source token on this chain. The order hash is the canonical identifier shared across both sides.

The system uses a **minimal EIP-712 domain** (`name="Proofbridge"`, `version="1"`) and explicit chain/contract fields embedded in the struct to prevent replay.

## Contents

- [Proofbridge Contracts](#proofbridge-contracts)
  - [Contents](#contents)
  - [Architecture](#architecture)
    - [System Overview](#system-overview)
    - [Flow](#flow)
    - [Security](#security)
  - [Contracts](#contracts)
    - [`AdManager`](#admanager)
    - [`OrderPortal`](#orderportal)
    - [`MerkleManager`](#merklemanager)
    - [`Verifier` (HonkVerifier)](#verifier-honkverifier)
    - [`wNativeToken`](#wnativetoken)
  - [Data Structures \& EIP-712](#data-structures--eip-712)
    - [Minimal domain (both contracts)](#minimal-domain-both-contracts)
    - [Order struct](#order-struct)
  - [Technical Implementation Details](#technical-implementation-details)
    - [Zero-Knowledge Proof System](#zero-knowledge-proof-system)
    - [Advanced Security Model](#advanced-security-model)
  - [Verifier public inputs](#verifier-public-inputs)
    - [**OrderPortal.unlock** (Source Chain)](#orderportalunlock-source-chain)
    - [**AdManager.unlock** (Destination Chain)](#admanagerunlock-destination-chain)
  - [Install \& Build](#install--build)
  - [Testing](#testing)
  - [Deploy](#deploy)
    - [Automated Deployment (Recommended)](#automated-deployment-recommended)
    - [Manual Deployment (Advanced)](#manual-deployment-advanced)
  - [Post-Deploy Configuration](#post-deploy-configuration)

## Architecture

### System Overview

```
                    CHAIN 1 (Ad Chain)                   CHAIN 2 (Order Chain)
    ┌──────────────────────────────┐      ┌──────────────────────────────┐
    │                              │      │                              │
    │  ┌────────────────────┐      │      │      ┌────────────────────┐  │
    │  │   AdManager        │◄─────┼──────┼──────┤   OrderPortal      │  │
    │  └────────────────────┘      │      │      └────────────────────┘  │
    │          │                   │      │                   │          │
    │          │ MANAGER_ROLE      │      │      MANAGER_ROLE │          │
    │          ▼                   │      │                   ▼          │
    │  ┌────────────────────┐      │      │      ┌────────────────────┐  │
    │  │  MerkleManager     │      │      │      │  MerkleManager     │  │
    │  └────────────────────┘      │      │      └────────────────────┘  │
    │          ▲                   │      │                   ▲          │
    │          │ MANAGER_ROLE      │      │      MANAGER_ROLE │          │
    │          │                   │      │                   │          │
    │  ┌────────────────────┐      │      │      ┌────────────────────┐  │
    │  │   OrderPortal      │──────┼──────┼─────►│   AdManager        │  │
    │  └────────────────────┘      │      │      └────────────────────┘  │
    │          │                   │      │                   │          │
    │  ┌────────────────────┐      │      │      ┌────────────────────┐  │
    │  │   WNativeToken     │      │      │      │   WNativeToken     │  │
    │  └────────────────────┘      │      │      └────────────────────┘  │
    │          │                   │      │                   │          │
    │  ┌────────────────────┐      │      │      ┌────────────────────┐  │
    │  │   Verifier         │      │      │      │   Verifier         │  │
    │  └────────────────────┘      │      │      └────────────────────┘  │
    │                              │      │                              │
    └──────────────────────────────┘      └──────────────────────────────┘
```

### Flow

1. **Maker** creates an **Ad** on AdManager, funding it with the destination-chain token.
2. **Bridger** opens an **order** on **OrderPortal**, depositing the source-chain token.
3. The system relays the **order hash** to the maker off-chain; the maker locks an amount from the Ad against that order.
4. After the maker fulfills the user on the opposite chain, a **zk proof** is generated and submitted to unlock:
   * On **OrderPortal**: release order-token to the **maker destination recipient** recorded in the order.
   * On **AdManager**: release **ad token** from contract to the **bridger's designated recipient**.

### Security

Replay is prevented via:

* **EIP-712 struct hash** that binds chain ids and contract addresses.
* A **nullifier** recorded once per successful proof.
* **Bidirectional chain linking** ensures contracts only accept proofs from configured counterparts.
* **MANAGER_ROLE** on MerkleManager restricts who can append order hashes.

## Contracts

### `AdManager`

The destination chain contract where liquidity providers (makers) manage their advertisements and fulfill cross-chain orders.

**Core Functions:**

* **`createAd`**: Creates a new liquidity advertisement with specified parameters
* **`fundAd`**: Deposits tokens into an existing ad to increase available liquidity
* **`withdrawFromAd`**: Withdraws unused tokens from an ad (only available balance, not locked)
* **`closeAd`**: Permanently closes an ad and withdraws all remaining funds
* **`lockForOrder`**: Reserves liquidity for a specific EIP-712 order hash
* **`unlock`**: Verifies ZK proof via `IVerifier`, consumes nullifier, transfers ad token to the **orderRecipient**

**Security Features:**

* **Access Control**: Role-based permissions using OpenZeppelin's AccessControl
* **Reentrancy Protection**: ReentrancyGuard prevents recursive calls
* **Route Validation**: Ensures order chain and token routing are properly configured
* **Nullifier System**: Prevents double-spending through unique proof consumption
* **Native Token Support**: Handles both ERC20 tokens and native ETH via wrapped token interface

**Key Storage:**

* `chains[orderChainId] → { supported, orderPortal }`: Source chain configuration
* `tokenRoute[adToken][orderChainId] → orderToken`: Cross-chain token mapping
* `ads[adId] → { maker, token, balance, locked, open, … }`: Ad state management
* `orders[orderHash] → Status`: Order execution tracking
* `nullifierUsed[hash] → bool`: Proof replay prevention

### `OrderPortal`

The source chain contract where users initiate cross-chain transfers by creating orders.

**Core Functions:**

* **`createOrder`**: Initiates a cross-chain order by depositing source chain tokens
* **`unlock`**: Verifies ZK proof and releases funds to the designated recipient
* **Admin Functions**: Chain and token route configuration

**Security Features:**

* **EIP-712 Signature Verification**: Ensures order authenticity and prevents replay attacks
* **Cross-Chain Validation**: Verifies destination chain and AdManager configuration
* **Token Route Enforcement**: Validates supported token pairs between chains
* **Merkle Tree Integration**: Records order hashes for cryptographic verification

**Key Storage:**

* `chains[dstChainId] → { supported, adManager }`: Destination chain configuration
* `tokenRoute[token1][dstChainId] → token2`: Cross-chain token routing
* `orders[orderHash] → Status`: Order lifecycle management
* `nullifierUsed[hash] → bool`: Prevents proof reuse

### `MerkleManager`

A specialized contract managing Merkle Mountain Range (MMR) data structures for efficient proof generation and verification.

**Core Functions:**

* **`appendOrderHash`**: Adds new order hashes to the MMR tree
* **`getRootHash`**: Returns the current MMR root for proof verification
* **`verifyProof`**: Validates inclusion proofs against historical roots
* **`getOrderIndex`**: Maps order hashes to their position in the tree

**Technical Features:**

* **Poseidon Hashing**: Uses cryptographically secure Poseidon hash function
* **Stateless Verification**: Supports verification without storing entire tree
* **Root History**: Maintains historical roots for proof validation
* **Gas Optimization**: Efficient append-only operations

### `Verifier` (HonkVerifier)

Ultra-high performance zero-knowledge proof verifier implementing Aztec's UltraHonk proving system.

**Technical Specifications:**

* **Circuit Size**: 32,768 constraints (2^15)
* **Public Inputs**: Supports up to 20 public input values
* **Proving System**: UltraHonk with optimized verification
* **Elliptic Curve**: BN254 curve for cryptographic operations

**Verification Process:**

1. Validates proof structure and public inputs
2. Performs elliptic curve operations for proof verification
3. Ensures nullifier uniqueness and order hash validity
4. Returns boolean verification result

### `wNativeToken`

Wrapped native token implementation providing ERC20 interface for native blockchain tokens (ETH, etc.).

**Features:**

* **Gas-Optimized Operations**: Assembly-level optimizations for deposit/withdraw
* **Standard Compliance**: Full ERC20 compatibility
* **Safe Operations**: Protected against common wrapped token vulnerabilities
* **Integration**: Seamless integration with AdManager and OrderPortal contracts

## Data Structures & EIP-712

### Minimal domain (both contracts)

* **Domain**: `EIP712Domain(string name, string version)`

  * `name = "Proofbridge"`
  * `version = "1"`

> **Note:** We do **not** include `chainId` or `verifyingContract` in the domain. Instead, those values are explicit fields in the struct.

### Order struct

```solidity
  struct Order {
      address orderToken;
      address adToken;
      uint256 amount;
      address bridger;
      uint256 orderChainId;
      address orderPortal;
      address orderRecipient;
      uint256 adChainId;
      address adManager;
      uint256 adId;
      address adCreator;
      address adRecipient;
      uint256 salt;
  }
```

Semantics (portal side):

* `token1`: source token (this chain)
* `token2`: expected destination token
* `srcChainId`: **this** chain id
* `srcOrderPortal`: **this** contract address
* `dstChainId`, `dstAdManager`: counterpart config on destination chain
* `dstAdId`, `dstAdCreator`, `dstRecipient`: destination details
* `srcRecipient`: informational field (e.g., maker’s recipient on order chain)
* `salt`: caller-controlled nonce

Semantics (ad side):

* `orderChainToken`: source token (order chain)
* `adChainToken`: token escrowed on this chain
* `orderChainId`, `orderPortal`: counterpart config of order chain
* `adChainId`: **this** chain id
* `adManager`: **this** contract address
* `orderRecipient`: recipient on this chain for portal-side payout logic (if mirrored)
* `adId`, `adCreator`, `adRecipient`: ad identity and payout details
* `salt`: caller-controlled nonce

## Technical Implementation Details

### Zero-Knowledge Proof System

The protocol employs a sophisticated ZK proof system for privacy-preserving cross-chain settlements:

**Proof Generation Process:**

1. **Secret Generation**: Each participant generates a private secret for nullifier computation
2. **Nullifier Calculation**: `nullifierHash = poseidon(secret, isAdCreator, orderHash)`
3. **Circuit Execution**: Noir circuit validates the relationship between secrets, nullifiers, and order data
4. **Proof Creation**: UltraHonk backend generates cryptographic proof of valid execution

### Advanced Security Model

**Multi-Layer Protection:**

1. **EIP-712 Domain Separation**: Prevents cross-contract and cross-chain replay attacks
2. **Nullifier Uniqueness**: Cryptographic guarantee against double-spending
3. **Merkle Tree Integrity**: Tamper-proof order history with efficient verification
4. **Access Control Matrix**: Role-based permissions with emergency admin functions
5. **Reentrancy Shields**: Multiple layers of protection against recursive attacks

**Economic Security:**

* **Collateral Requirements**: Makers must lock funds before order matching
* **Slashing Mechanisms**: Penalties for malicious behavior or failed settlements (TBA)
* **Fee Economics**: Dynamic fee structure based on network conditions and risk assessment (TBA)
* **Liquidity Guarantees**: Orders are only created when sufficient liquidity is available (TBA)

## Verifier public inputs

The circuit accepts the following **public inputs** for cryptographic verification:

### **OrderPortal.unlock** (Source Chain)

Validates that the ad creator has the right to unlock funds on the source chain:

1. **`adCreator's nullifierHash`**: Cryptographic commitment proving ad creator's secret knowledge
2. **`bytes32(uint160(adCreator))`**: Ad creator's address (zero-padded to 32 bytes)
3. **`bytes32(uint160(bridger))`**: Bridger's address (zero-padded to 32 bytes)
4. **`orderHash`**: Canonical EIP-712 hash identifying the specific order
5. **`bytes32(0)`**: Chain identifier flag (0 = source chain operation)

### **AdManager.unlock** (Destination Chain)

Validates that the bridger has the right to unlock funds on the destination chain:

1. **`bridger's nullifierHash`**: Cryptographic commitment proving bridger's secret knowledge
2. **`bytes32(uint160(adCreator))`**: Ad creator's address (zero-padded to 32 bytes)
3. **`bytes32(uint160(bridger))`**: Bridger's address (zero-padded to 32 bytes)
4. **`orderHash`**: Canonical EIP-712 hash identifying the specific order
5. **`bytes32(1)`**: Chain identifier flag (1 = destination chain operation)

**Verification Logic:**

* Both sides must provide valid nullifiers derived from their respective secrets
* Order hash must match the committed order data
* Chain identifier ensures proofs cannot be replayed on wrong chains
* Address validation prevents unauthorized fund access

## Install & Build

```bash
# Clone & enter
git clone https://github.com/Explore-Beyond-Innovations/ProofBridge.git
cd ProofBridge/apps/contracts

# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install
npm install

# Build contracts
forge build
```

## Testing

We use **Foundry**. Unit tests cover access/config, routing, order create/lock/unlock, and verifier behavior.

```bash
forge test -vvv
```

## Deploy

### Automated Deployment (Recommended)

Deploy to two chains with automated configuration:

```bash
# Setup
export PRIVATE_KEY="0x..."
cd js-scripts/deploy
cp config.template.json config.json
# Edit config.json - update admin addresses

# Deploy with full setup
npm run deploy -- --chain1 296 --chain2 84532
```

**What it does:**

* ✅ Deploys all contracts on both chains
* ✅ Grants MANAGER_ROLE to AdManager and OrderPortal
* ✅ Links chains bidirectionally
* ✅ Configures token routes

See [QUICKSTART.md](./QUICKSTART.md) for quick deployment guide.

See [js-scripts/deploy/README.md](./js-scripts/deploy/README.md) for detailed documentation.

### Manual Deployment (Advanced)

Use Foundry script for single-chain deployment:

```bash
export PRIVATE_KEY=0xYOUR_KEY
# Optional overrides:
# export ADMIN=0xAdminAddress
# export VERIFIER=0xExistingVerifierAddress

forge script script/DeployProofbridge.s.sol:DeployProofbridge \
  --rpc-url https://YOUR_RPC \
  --broadcast --verify
```

**Post-deployment:** Manually configure chains and token routes (see below).

## Post-Deploy Configuration

If using manual deployment, run these **admin** calls to connect chains and tokens.

**On OrderPortal (source chain):**

```solidity
// Enable destination chain and its AdManager address
setChain(dstChainId, dstAdManager, true);

// Configure token route: token1 (this chain) -> token2 (destination)
setTokenRoute(token1, dstChainId, token2);
```

**On AdManager (destination chain):**

```solidity
// Enable order chain and its OrderPortal address
setChain(orderChainId, orderPortal, true);

// Configure token route: adToken (this chain) -> orderToken (order chain)
setTokenRoute(adToken, orderToken, orderChainId);
```

**On MerkleManager (both chains):**

```solidity
// Grant MANAGER_ROLE to AdManager and OrderPortal
grantRole(MANAGER_ROLE, adManagerAddress);
grantRole(MANAGER_ROLE, orderPortalAddress);
```

> **Note:** Automated deployment handles all configuration automatically.
