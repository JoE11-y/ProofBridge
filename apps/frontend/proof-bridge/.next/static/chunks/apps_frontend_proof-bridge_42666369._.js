(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/frontend/proof-bridge/abis/AdManager.abi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AD_MANAGER_ABI",
    ()=>AD_MANAGER_ABI
]);
const AD_MANAGER_ABI = [
    {
        type: "constructor",
        inputs: [
            {
                name: "admin",
                type: "address",
                internalType: "address"
            },
            {
                name: "_verifier",
                type: "address",
                internalType: "contract IVerifier"
            },
            {
                name: "_merkleManager",
                type: "address",
                internalType: "contract IMerkleManager"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "ADMIN_ROLE",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "DEFAULT_ADMIN_ROLE",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "DOMAIN_TYPEHASH_MIN",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "ORDER_TYPEHASH",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "adIds",
        inputs: [
            {
                name: "",
                type: "string",
                internalType: "string"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "ads",
        inputs: [
            {
                name: "",
                type: "string",
                internalType: "string"
            }
        ],
        outputs: [
            {
                name: "orderChainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "adRecipient",
                type: "address",
                internalType: "address"
            },
            {
                name: "maker",
                type: "address",
                internalType: "address"
            },
            {
                name: "token",
                type: "address",
                internalType: "address"
            },
            {
                name: "balance",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "locked",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "open",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "availableLiquidity",
        inputs: [
            {
                name: "adId",
                type: "string",
                internalType: "string"
            }
        ],
        outputs: [
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "chains",
        inputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "supported",
                type: "bool",
                internalType: "bool"
            },
            {
                name: "orderPortal",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "checkRequestHashExists",
        inputs: [
            {
                name: "message",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "closeAd",
        inputs: [
            {
                name: "signature",
                type: "bytes",
                internalType: "bytes"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "adId",
                type: "string",
                internalType: "string"
            },
            {
                name: "to",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "closeAdRequestHash",
        inputs: [
            {
                name: "adId",
                type: "string",
                internalType: "string"
            },
            {
                name: "to",
                type: "address",
                internalType: "address"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "message",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "createAd",
        inputs: [
            {
                name: "signature",
                type: "bytes",
                internalType: "bytes"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "adId",
                type: "string",
                internalType: "string"
            },
            {
                name: "adToken",
                type: "address",
                internalType: "address"
            },
            {
                name: "orderChainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "adRecipient",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "createAdRequestHash",
        inputs: [
            {
                name: "adId",
                type: "string",
                internalType: "string"
            },
            {
                name: "adToken",
                type: "address",
                internalType: "address"
            },
            {
                name: "orderChainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "adRecipient",
                type: "address",
                internalType: "address"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "message",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "eip712Domain",
        inputs: [],
        outputs: [
            {
                name: "fields",
                type: "bytes1",
                internalType: "bytes1"
            },
            {
                name: "name",
                type: "string",
                internalType: "string"
            },
            {
                name: "version",
                type: "string",
                internalType: "string"
            },
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "verifyingContract",
                type: "address",
                internalType: "address"
            },
            {
                name: "salt",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "extensions",
                type: "uint256[]",
                internalType: "uint256[]"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "fundAd",
        inputs: [
            {
                name: "signature",
                type: "bytes",
                internalType: "bytes"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "adId",
                type: "string",
                internalType: "string"
            },
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "fundAdRequestHash",
        inputs: [
            {
                name: "adId",
                type: "string",
                internalType: "string"
            },
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "message",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getChainID",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getMerkleRoot",
        inputs: [],
        outputs: [
            {
                name: "root",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getRoleAdmin",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getSigner",
        inputs: [
            {
                name: "message",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "signature",
                type: "bytes",
                internalType: "bytes"
            }
        ],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "pure"
    },
    {
        type: "function",
        name: "grantRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "hasRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "hashRequest",
        inputs: [
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "_action",
                type: "string",
                internalType: "string"
            },
            {
                name: "_params",
                type: "bytes[]",
                internalType: "bytes[]"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "i_merkleManager",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "contract IMerkleManager"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "i_verifier",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "contract IVerifier"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "lockForOrder",
        inputs: [
            {
                name: "signature",
                type: "bytes",
                internalType: "bytes"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "params",
                type: "tuple",
                internalType: "struct AdManager.OrderParams",
                components: [
                    {
                        name: "orderChainToken",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "adChainToken",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "amount",
                        type: "uint256",
                        internalType: "uint256"
                    },
                    {
                        name: "bridger",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "orderChainId",
                        type: "uint256",
                        internalType: "uint256"
                    },
                    {
                        name: "srcOrderPortal",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "orderRecipient",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "adId",
                        type: "string",
                        internalType: "string"
                    },
                    {
                        name: "adCreator",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "adRecipient",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "salt",
                        type: "uint256",
                        internalType: "uint256"
                    }
                ]
            }
        ],
        outputs: [
            {
                name: "orderHash",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "lockForOrderRequestHash",
        inputs: [
            {
                name: "adId",
                type: "string",
                internalType: "string"
            },
            {
                name: "orderHash",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "message",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "managers",
        inputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "nullifierUsed",
        inputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "orders",
        inputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "uint8",
                internalType: "enum AdManager.Status"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "removeChain",
        inputs: [
            {
                name: "orderChainId",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "removeTokenRoute",
        inputs: [
            {
                name: "adToken",
                type: "address",
                internalType: "address"
            },
            {
                name: "orderChainId",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "renounceRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "callerConfirmation",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "requestHashes",
        inputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "requestTokens",
        inputs: [
            {
                name: "",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "revokeRole",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "setChain",
        inputs: [
            {
                name: "orderChainId",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "orderPortal",
                type: "address",
                internalType: "address"
            },
            {
                name: "supported",
                type: "bool",
                internalType: "bool"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "setManager",
        inputs: [
            {
                name: "_manager",
                type: "address",
                internalType: "address"
            },
            {
                name: "_status",
                type: "bool",
                internalType: "bool"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "setTokenRoute",
        inputs: [
            {
                name: "adToken",
                type: "address",
                internalType: "address"
            },
            {
                name: "orderToken",
                type: "address",
                internalType: "address"
            },
            {
                name: "orderChainId",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "supportsInterface",
        inputs: [
            {
                name: "interfaceId",
                type: "bytes4",
                internalType: "bytes4"
            }
        ],
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "tokenRoute",
        inputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            },
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "address"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "unlock",
        inputs: [
            {
                name: "signature",
                type: "bytes",
                internalType: "bytes"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "params",
                type: "tuple",
                internalType: "struct AdManager.OrderParams",
                components: [
                    {
                        name: "orderChainToken",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "adChainToken",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "amount",
                        type: "uint256",
                        internalType: "uint256"
                    },
                    {
                        name: "bridger",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "orderChainId",
                        type: "uint256",
                        internalType: "uint256"
                    },
                    {
                        name: "srcOrderPortal",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "orderRecipient",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "adId",
                        type: "string",
                        internalType: "string"
                    },
                    {
                        name: "adCreator",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "adRecipient",
                        type: "address",
                        internalType: "address"
                    },
                    {
                        name: "salt",
                        type: "uint256",
                        internalType: "uint256"
                    }
                ]
            },
            {
                name: "nullifierHash",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "targetRoot",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "proof",
                type: "bytes",
                internalType: "bytes"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "unlockOrderRequestHash",
        inputs: [
            {
                name: "adId",
                type: "string",
                internalType: "string"
            },
            {
                name: "orderHash",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "_targetRoot",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "message",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "withdrawFromAd",
        inputs: [
            {
                name: "signature",
                type: "bytes",
                internalType: "bytes"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "adId",
                type: "string",
                internalType: "string"
            },
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "to",
                type: "address",
                internalType: "address"
            }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "withdrawFromAdRequestHash",
        inputs: [
            {
                name: "adId",
                type: "string",
                internalType: "string"
            },
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "to",
                type: "address",
                internalType: "address"
            },
            {
                name: "authToken",
                type: "bytes32",
                internalType: "bytes32"
            },
            {
                name: "timeToExpire",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [
            {
                name: "message",
                type: "bytes32",
                internalType: "bytes32"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "event",
        name: "AdClosed",
        inputs: [
            {
                name: "adId",
                type: "string",
                indexed: true,
                internalType: "string"
            },
            {
                name: "maker",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "AdCreated",
        inputs: [
            {
                name: "adId",
                type: "string",
                indexed: true,
                internalType: "string"
            },
            {
                name: "maker",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "token",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "orderChainId",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "AdFunded",
        inputs: [
            {
                name: "adId",
                type: "string",
                indexed: true,
                internalType: "string"
            },
            {
                name: "maker",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "newBalance",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "AdWithdrawn",
        inputs: [
            {
                name: "adId",
                type: "string",
                indexed: true,
                internalType: "string"
            },
            {
                name: "maker",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "newBalance",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "ChainSet",
        inputs: [
            {
                name: "chainId",
                type: "uint256",
                indexed: true,
                internalType: "uint256"
            },
            {
                name: "orderPortal",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "supported",
                type: "bool",
                indexed: false,
                internalType: "bool"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "EIP712DomainChanged",
        inputs: [],
        anonymous: false
    },
    {
        type: "event",
        name: "OrderLocked",
        inputs: [
            {
                name: "adId",
                type: "string",
                indexed: true,
                internalType: "string"
            },
            {
                name: "orderHash",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "maker",
                type: "address",
                indexed: false,
                internalType: "address"
            },
            {
                name: "token",
                type: "address",
                indexed: false,
                internalType: "address"
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256"
            },
            {
                name: "bridger",
                type: "address",
                indexed: false,
                internalType: "address"
            },
            {
                name: "recipient",
                type: "address",
                indexed: false,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "OrderUnlocked",
        inputs: [
            {
                name: "orderHash",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "recipient",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "nullifierHash",
                type: "bytes32",
                indexed: false,
                internalType: "bytes32"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "RoleAdminChanged",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "previousAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "newAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "RoleGranted",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "RoleRevoked",
        inputs: [
            {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32"
            },
            {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "TokenRouteRemoved",
        inputs: [
            {
                name: "adToken",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "orderChainToken",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "adChainId",
                type: "uint256",
                indexed: true,
                internalType: "uint256"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "TokenRouteSet",
        inputs: [
            {
                name: "orderChainToken",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "adChainId",
                type: "uint256",
                indexed: true,
                internalType: "uint256"
            },
            {
                name: "adChainToken",
                type: "address",
                indexed: true,
                internalType: "address"
            }
        ],
        anonymous: false
    },
    {
        type: "event",
        name: "UpdateManager",
        inputs: [
            {
                name: "manager",
                type: "address",
                indexed: true,
                internalType: "address"
            },
            {
                name: "status",
                type: "bool",
                indexed: false,
                internalType: "bool"
            }
        ],
        anonymous: false
    },
    {
        type: "error",
        name: "AccessControlBadConfirmation",
        inputs: []
    },
    {
        type: "error",
        name: "AccessControlUnauthorizedAccount",
        inputs: [
            {
                name: "account",
                type: "address",
                internalType: "address"
            },
            {
                name: "neededRole",
                type: "bytes32",
                internalType: "bytes32"
            }
        ]
    },
    {
        type: "error",
        name: "AdManager__AdClosed",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__AdNotFound",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__AdRecipientMismatch",
        inputs: [
            {
                name: "expected",
                type: "address",
                internalType: "address"
            },
            {
                name: "provided",
                type: "address",
                internalType: "address"
            }
        ]
    },
    {
        type: "error",
        name: "AdManager__AdTokenMismatch",
        inputs: [
            {
                name: "expected",
                type: "address",
                internalType: "address"
            },
            {
                name: "provided",
                type: "address",
                internalType: "address"
            }
        ]
    },
    {
        type: "error",
        name: "AdManager__BridgerZero",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__ChainNotSupported",
        inputs: [
            {
                name: "chainId",
                type: "uint256",
                internalType: "uint256"
            }
        ]
    },
    {
        type: "error",
        name: "AdManager__InsufficientLiquidity",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__InvalidMessage",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__InvalidProof",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__MerkleManagerAppendFailed",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__MissingRoute",
        inputs: [
            {
                name: "orderChainToken",
                type: "address",
                internalType: "address"
            },
            {
                name: "adChainId",
                type: "uint256",
                internalType: "uint256"
            }
        ]
    },
    {
        type: "error",
        name: "AdManager__NotMaker",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__NullifierUsed",
        inputs: [
            {
                name: "nullifierHash",
                type: "bytes32",
                internalType: "bytes32"
            }
        ]
    },
    {
        type: "error",
        name: "AdManager__OrderChainMismatch",
        inputs: [
            {
                name: "expected",
                type: "uint256",
                internalType: "uint256"
            },
            {
                name: "provided",
                type: "uint256",
                internalType: "uint256"
            }
        ]
    },
    {
        type: "error",
        name: "AdManager__OrderExists",
        inputs: [
            {
                name: "orderHash",
                type: "bytes32",
                internalType: "bytes32"
            }
        ]
    },
    {
        type: "error",
        name: "AdManager__OrderNotOpen",
        inputs: [
            {
                name: "orderHash",
                type: "bytes32",
                internalType: "bytes32"
            }
        ]
    },
    {
        type: "error",
        name: "AdManager__OrderPortalMismatch",
        inputs: [
            {
                name: "expected",
                type: "address",
                internalType: "address"
            },
            {
                name: "provided",
                type: "address",
                internalType: "address"
            }
        ]
    },
    {
        type: "error",
        name: "AdManager__OrderTokenMismatch",
        inputs: [
            {
                name: "expected",
                type: "address",
                internalType: "address"
            },
            {
                name: "provided",
                type: "address",
                internalType: "address"
            }
        ]
    },
    {
        type: "error",
        name: "AdManager__RecipientZero",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__RequestTokenExpired",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__TokenAlreadyUsed",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__TokenZeroAddress",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__UsedAdId",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__ZeroAddress",
        inputs: []
    },
    {
        type: "error",
        name: "AdManager__ZeroAmount",
        inputs: []
    },
    {
        type: "error",
        name: "Admanage__ZeroSigner",
        inputs: []
    },
    {
        type: "error",
        name: "Admanager__ActiveLocks",
        inputs: []
    },
    {
        type: "error",
        name: "Admanager__InvalidSigner",
        inputs: []
    },
    {
        type: "error",
        name: "Admanager__RequestHashedProcessed",
        inputs: []
    },
    {
        type: "error",
        name: "ECDSAInvalidSignature",
        inputs: []
    },
    {
        type: "error",
        name: "ECDSAInvalidSignatureLength",
        inputs: [
            {
                name: "length",
                type: "uint256",
                internalType: "uint256"
            }
        ]
    },
    {
        type: "error",
        name: "ECDSAInvalidSignatureS",
        inputs: [
            {
                name: "s",
                type: "bytes32",
                internalType: "bytes32"
            }
        ]
    },
    {
        type: "error",
        name: "InvalidShortString",
        inputs: []
    },
    {
        type: "error",
        name: "ReentrancyGuardReentrantCall",
        inputs: []
    },
    {
        type: "error",
        name: "SafeERC20FailedOperation",
        inputs: [
            {
                name: "token",
                type: "address",
                internalType: "address"
            }
        ]
    },
    {
        type: "error",
        name: "StringTooLong",
        inputs: [
            {
                name: "str",
                type: "string",
                internalType: "string"
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/abis/ERC20.abi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ERC20_ABI",
    ()=>ERC20_ABI
]);
const ERC20_ABI = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_spender",
                type: "address"
            },
            {
                name: "_value",
                type: "uint256"
            }
        ],
        name: "approve",
        outputs: [
            {
                name: "",
                type: "bool"
            }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                name: "",
                type: "uint256"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_from",
                type: "address"
            },
            {
                name: "_to",
                type: "address"
            },
            {
                name: "_value",
                type: "uint256"
            }
        ],
        name: "transferFrom",
        outputs: [
            {
                name: "",
                type: "bool"
            }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
            {
                name: "",
                type: "uint8"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address"
            }
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "balance",
                type: "uint256"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_to",
                type: "address"
            },
            {
                name: "_value",
                type: "uint256"
            }
        ],
        name: "transfer",
        outputs: [
            {
                name: "",
                type: "bool"
            }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address"
            },
            {
                name: "_spender",
                type: "address"
            }
        ],
        name: "allowance",
        outputs: [
            {
                name: "",
                type: "uint256"
            }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    },
    {
        payable: true,
        stateMutability: "payable",
        type: "fallback"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "owner",
                type: "address"
            },
            {
                indexed: true,
                name: "spender",
                type: "address"
            },
            {
                indexed: false,
                name: "value",
                type: "uint256"
            }
        ],
        name: "Approval",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "from",
                type: "address"
            },
            {
                indexed: true,
                name: "to",
                type: "address"
            },
            {
                indexed: false,
                name: "value",
                type: "uint256"
            }
        ],
        name: "Transfer",
        type: "event"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/utils/urls.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "urls",
    ()=>urls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use client";
const urls = {
    API_URL: ("TURBOPACK compile-time value", "https://proofbridge.onrender.com")
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/services/api.instance.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/utils/urls.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$12$2e$2$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/axios@1.12.2/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$cookie$40$3$2e$0$2e$5$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/js-cookie@3.0.5/node_modules/js-cookie/dist/js.cookie.mjs [app-client] (ecmascript)");
;
;
;
const BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["urls"].API_URL;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$12$2e$2$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL,
    withCredentials: true
});
api.interceptors.request.use((config)=>{
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$cookie$40$3$2e$0$2e$5$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("auth_token");
    if (token) {
        config.headers.Authorization = "Bearer ".concat(token);
    }
    // Ensure withCredentials is set for each request
    config.withCredentials = true;
    if ("TURBOPACK compile-time truthy", 1) {
        var _config_baseURL;
        console.log("Request URL:", ((_config_baseURL = config.baseURL) !== null && _config_baseURL !== void 0 ? _config_baseURL : "") + config.url);
    // console.log("Authorization Header:", config.headers.Authorization);
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
api.interceptors.response.use(async (response)=>{
    return response;
}, async (error)=>{
    var _error_response, _error_response1, _error_response2;
    if ([
        403
    ].includes(error === null || error === void 0 ? void 0 : (_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.status)) {
        var _error_response_data, _error_response_data_errors, _error_response_data1, _error_response_data_errors__field_name, _error_response_data_errors_, _error_response_data2, _error_response_data_errors_1, _error_response_data3;
        error.message = (error === null || error === void 0 ? void 0 : (_error_response_data = error.response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.errors) && (error === null || error === void 0 ? void 0 : (_error_response_data1 = error.response.data) === null || _error_response_data1 === void 0 ? void 0 : (_error_response_data_errors = _error_response_data1.errors) === null || _error_response_data_errors === void 0 ? void 0 : _error_response_data_errors.length) > 0 && "".concat(error === null || error === void 0 ? void 0 : (_error_response_data2 = error.response.data) === null || _error_response_data2 === void 0 ? void 0 : (_error_response_data_errors_ = _error_response_data2.errors[0]) === null || _error_response_data_errors_ === void 0 ? void 0 : (_error_response_data_errors__field_name = _error_response_data_errors_.field_name) === null || _error_response_data_errors__field_name === void 0 ? void 0 : _error_response_data_errors__field_name.replace(/_/g, " "), " -\n        ").concat(error === null || error === void 0 ? void 0 : (_error_response_data3 = error.response.data) === null || _error_response_data3 === void 0 ? void 0 : (_error_response_data_errors_1 = _error_response_data3.errors[0]) === null || _error_response_data_errors_1 === void 0 ? void 0 : _error_response_data_errors_1.message) || (error === null || error === void 0 ? void 0 : error.response.data.message) || (error === null || error === void 0 ? void 0 : error.response.message);
        // await toast.error(error?.message);
        const refresh_token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$cookie$40$3$2e$0$2e$5$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("refresh_token");
        const res = await api.post("/v1/auth/refresh", {
            refresh: refresh_token
        }, {
            withCredentials: true
        } // Ensure credentials for refresh token request
        );
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$cookie$40$3$2e$0$2e$5$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("auth_token", res.data.tokens.access);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$cookie$40$3$2e$0$2e$5$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("refresh_token", res.data.tokens.refresh);
    } else if ([
        401
    ].includes(error === null || error === void 0 ? void 0 : (_error_response1 = error.response) === null || _error_response1 === void 0 ? void 0 : _error_response1.status)) {
        var _error_response_data4, _error_response_data_errors1, _error_response_data5, _error_response_data_errors__field_name1, _error_response_data_errors_2, _error_response_data6, _error_response_data_errors_3, _error_response_data7;
        error.message = (error === null || error === void 0 ? void 0 : (_error_response_data4 = error.response.data) === null || _error_response_data4 === void 0 ? void 0 : _error_response_data4.errors) && (error === null || error === void 0 ? void 0 : (_error_response_data5 = error.response.data) === null || _error_response_data5 === void 0 ? void 0 : (_error_response_data_errors1 = _error_response_data5.errors) === null || _error_response_data_errors1 === void 0 ? void 0 : _error_response_data_errors1.length) > 0 && "".concat(error === null || error === void 0 ? void 0 : (_error_response_data6 = error.response.data) === null || _error_response_data6 === void 0 ? void 0 : (_error_response_data_errors_2 = _error_response_data6.errors[0]) === null || _error_response_data_errors_2 === void 0 ? void 0 : (_error_response_data_errors__field_name1 = _error_response_data_errors_2.field_name) === null || _error_response_data_errors__field_name1 === void 0 ? void 0 : _error_response_data_errors__field_name1.replace(/_/g, " "), " -\n        ").concat(error === null || error === void 0 ? void 0 : (_error_response_data7 = error.response.data) === null || _error_response_data7 === void 0 ? void 0 : (_error_response_data_errors_3 = _error_response_data7.errors[0]) === null || _error_response_data_errors_3 === void 0 ? void 0 : _error_response_data_errors_3.message) || (error === null || error === void 0 ? void 0 : error.response.data.message) || (error === null || error === void 0 ? void 0 : error.response.message);
        const refresh_token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$cookie$40$3$2e$0$2e$5$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("refresh_token");
        try {
            // Make sure refresh token request also includes credentials
            const res = await api.post("/v1/auth/refresh", {
                refresh: refresh_token
            }, {
                withCredentials: true
            } // Ensure credentials for refresh token request
            );
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$cookie$40$3$2e$0$2e$5$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("auth_token", res.data.tokens.access);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$cookie$40$3$2e$0$2e$5$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].set("refresh_token", res.data.tokens.refresh);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$cookie$40$3$2e$0$2e$5$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove("refresh_token");
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$js$2d$cookie$40$3$2e$0$2e$5$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove("auth_token");
            window.location.href = "/";
        }
        console.log({
            error
        });
    } else if ([
        400
    ].includes(error === null || error === void 0 ? void 0 : (_error_response2 = error.response) === null || _error_response2 === void 0 ? void 0 : _error_response2.status)) {
        var _error_response_data8, _error_response_data_errors2, _error_response_data9, _error_response_data_errors__field_name2, _error_response_data_errors_4, _error_response_data10, _error_response_data_errors_5, _error_response_data11;
        error.message = (error === null || error === void 0 ? void 0 : (_error_response_data8 = error.response.data) === null || _error_response_data8 === void 0 ? void 0 : _error_response_data8.errors) && (error === null || error === void 0 ? void 0 : (_error_response_data9 = error.response.data) === null || _error_response_data9 === void 0 ? void 0 : (_error_response_data_errors2 = _error_response_data9.errors) === null || _error_response_data_errors2 === void 0 ? void 0 : _error_response_data_errors2.length) > 0 && "".concat(error === null || error === void 0 ? void 0 : (_error_response_data10 = error.response.data) === null || _error_response_data10 === void 0 ? void 0 : (_error_response_data_errors_4 = _error_response_data10.errors[0]) === null || _error_response_data_errors_4 === void 0 ? void 0 : (_error_response_data_errors__field_name2 = _error_response_data_errors_4.field_name) === null || _error_response_data_errors__field_name2 === void 0 ? void 0 : _error_response_data_errors__field_name2.replace(/_/g, " "), " -\n          ").concat(error === null || error === void 0 ? void 0 : (_error_response_data11 = error.response.data) === null || _error_response_data11 === void 0 ? void 0 : (_error_response_data_errors_5 = _error_response_data11.errors[0]) === null || _error_response_data_errors_5 === void 0 ? void 0 : _error_response_data_errors_5.message) || (error === null || error === void 0 ? void 0 : error.response.data.message) || (error === null || error === void 0 ? void 0 : error.response.message);
    // await toast.error(error?.message);
    }
    return Promise.reject(error);
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/services/ads.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "closeAd",
    ()=>closeAd,
    "confirmAdTx",
    ()=>confirmAdTx,
    "createAd",
    ()=>createAd,
    "fundAd",
    ()=>fundAd,
    "getAllAds",
    ()=>getAllAds,
    "getSingleAd",
    ()=>getSingleAd,
    "updatedAd",
    ()=>updatedAd,
    "withdrawFromAd",
    ()=>withdrawFromAd
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/utils/urls.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$api$2e$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/services/api.instance.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$12$2e$2$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/axios@1.12.2/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
;
;
const ads_route = function() {
    let path = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return "".concat(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["urls"].API_URL, "/v1/ads").concat(path);
};
const createAd = async (data)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$api$2e$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(ads_route("/create"), data);
    return response.data;
};
const fundAd = async (data)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$api$2e$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(ads_route("/".concat(data.adId, "/fund")), {
        poolAmountTopUp: data.poolAmountTopUp
    });
    return response.data;
};
const withdrawFromAd = async (data)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$api$2e$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(ads_route("/".concat(data.adId, "/withdraw")), {
        poolAmountWithdraw: data.poolAmountWithdraw,
        to: data.to
    });
    return response.data;
};
const closeAd = async (data)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$api$2e$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(ads_route("/".concat(data.adId, "/close")), {
        to: data.to
    });
    return response.data;
};
const updatedAd = async (data)=>{
    const { adId, ...rest } = data;
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$api$2e$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(ads_route("/".concat(adId, "/update")), {
        ...rest
    });
    return response.data;
};
const confirmAdTx = async (data)=>{
    const { adId, ...rest } = data;
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$api$2e$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(ads_route("/".concat(adId, "/confirm")), {
        ...rest
    });
    return response.data;
};
const getAllAds = async (params)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$12$2e$2$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(ads_route(), {
        params
    });
    return response.data;
};
const getSingleAd = async (id)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$axios$40$1$2e$12$2e$2$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(ads_route("/".concat(id)));
    return response.data;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/services/tokens.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSingleToken",
    ()=>getSingleToken,
    "getTokens",
    ()=>getTokens
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/utils/urls.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$api$2e$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/services/api.instance.ts [app-client] (ecmascript)");
;
;
const tokens_route = function() {
    let path = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return "".concat(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$urls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["urls"].API_URL, "/v1/tokens").concat(path);
};
const getTokens = async (params)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$api$2e$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(tokens_route("/"), {
        params
    });
    return response.data;
};
const getSingleToken = async (id)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$api$2e$instance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(tokens_route("/".concat(id)));
    return response.data;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/hooks/useAds.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCloseAd",
    ()=>useCloseAd,
    "useConfirmAdTx",
    ()=>useConfirmAdTx,
    "useCreateAd",
    ()=>useCreateAd,
    "useFundAd",
    ()=>useFundAd,
    "useGetAllAds",
    ()=>useGetAllAds,
    "useGetSingleAd",
    ()=>useGetSingleAd,
    "useWithdrawFunds",
    ()=>useWithdrawFunds
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$abis$2f$AdManager$2e$abi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/abis/AdManager.abi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$abis$2f$ERC20$2e$abi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/abis/ERC20.abi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/services/ads.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$wagmi$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/utils/wagmi-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.89.0_react@19.1.0/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.89.0_react@19.1.0/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.37.7_bufferutil@4.0._ad33351cd73bee883c0f64ae830c6488/node_modules/viem/_esm/utils/unit/parseUnits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/wagmi@2.17.1_@tanstack+quer_1db52f1a8e9b4dd9e6560825cb9c62b2/node_modules/wagmi/dist/esm/hooks/useAccount.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/wagmi@2.17.1_@tanstack+quer_1db52f1a8e9b4dd9e6560825cb9c62b2/node_modules/wagmi/dist/esm/hooks/useWriteContract.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$core$40$2$2e$21$2e$0_$40$tanstac_ef21245c3a2c743a3788191ecd5f8e60$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@wagmi+core@2.21.0_@tanstac_ef21245c3a2c743a3788191ecd5f8e60/node_modules/@wagmi/core/dist/esm/actions/waitForTransactionReceipt.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$hederaTestnet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.37.7_bufferutil@4.0._ad33351cd73bee883c0f64ae830c6488/node_modules/viem/_esm/chains/definitions/hederaTestnet.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.37.7_bufferutil@4.0._ad33351cd73bee883c0f64ae830c6488/node_modules/viem/_esm/chains/definitions/sepolia.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$tokens$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/services/tokens.service.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
const contractAddresses = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$hederaTestnet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hederaTestnet"].id]: "",
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sepolia"].id]: ""
};
const useCreateAd = ()=>{
    _s();
    const { writeContractAsync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            "create-ad"
        ],
        mutationFn: {
            "useCreateAd.useMutation": async (data)=>{
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAd"])(data);
                const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$tokens$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTokens"])({
                    chainId: String(response.chainId)
                });
                const approveHash = await writeContractAsync({
                    address: token.data[0].address,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$abis$2f$ERC20$2e$abi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ERC20_ABI"],
                    chainId: Number(response.chainId),
                    functionName: "approve",
                    args: [
                        response.contractAddress,
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUnits"])(data.fundAmount, token.data[0].decimals)
                    ]
                });
                const approveReceipt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$core$40$2$2e$21$2e$0_$40$tanstac_ef21245c3a2c743a3788191ecd5f8e60$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waitForTransactionReceipt"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$wagmi$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["config"], {
                    hash: approveHash
                });
                if (approveReceipt.status === "success") {
                    const txHash = await writeContractAsync({
                        address: response.contractAddress,
                        abi: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$abis$2f$AdManager$2e$abi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AD_MANAGER_ABI"],
                        chainId: Number(response.chainId),
                        functionName: "createAd",
                        args: [
                            response.signature,
                            response.authToken,
                            BigInt(response.timeToExpire),
                            response.adId,
                            response.adToken,
                            BigInt(response.orderChainId),
                            response.adRecipient
                        ]
                    });
                    const receipt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$core$40$2$2e$21$2e$0_$40$tanstac_ef21245c3a2c743a3788191ecd5f8e60$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waitForTransactionReceipt"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$wagmi$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["config"], {
                        hash: txHash
                    });
                    if (receipt.status === "success") {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["confirmAdTx"])({
                            txHash: receipt.transactionHash,
                            signature: response.signature,
                            adId: response.adId
                        });
                    }
                    if (receipt.status === "reverted") {
                        throw Error("Transaction failed, Retry");
                    }
                }
                if (approveReceipt.status === "reverted") {
                    throw Error("Transaction not approved");
                }
                return response;
            }
        }["useCreateAd.useMutation"],
        onSuccess: {
            "useCreateAd.useMutation": ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Ad creation was successful");
            }
        }["useCreateAd.useMutation"],
        onError: {
            "useCreateAd.useMutation": function(error, variables, result, ctx) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.response.data.message || error.message || "Unable to create ad", {
                    description: ""
                });
            }
        }["useCreateAd.useMutation"]
    });
};
_s(useCreateAd, "QwdQgIjChtY2ln5sipp6NPeRIAY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useFundAd = ()=>{
    _s1();
    const { writeContractAsync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"])();
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccount"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            "fund-ad"
        ],
        mutationFn: {
            "useFundAd.useMutation": async (data)=>{
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fundAd"])(data);
                const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$tokens$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTokens"])({
                    chainId: String(response.chainId)
                });
                const approveHash = await writeContractAsync({
                    address: token.data[0].address,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$abis$2f$ERC20$2e$abi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ERC20_ABI"],
                    chainId: Number(response.chainId),
                    functionName: "approve",
                    args: [
                        response.contractAddress,
                        data.amountBigInt
                    ]
                });
                const approveReceipt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$core$40$2$2e$21$2e$0_$40$tanstac_ef21245c3a2c743a3788191ecd5f8e60$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waitForTransactionReceipt"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$wagmi$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["config"], {
                    hash: approveHash
                });
                if (approveReceipt.status === "success") {
                    const txHash = await writeContractAsync({
                        address: response.contractAddress,
                        abi: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$abis$2f$AdManager$2e$abi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AD_MANAGER_ABI"],
                        chainId: Number(response.chainId),
                        functionName: "fundAd",
                        args: [
                            response.signature,
                            response.authToken,
                            BigInt(response.timeToExpire),
                            response.adId,
                            data.amountBigInt
                        ]
                    });
                    const receipt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$core$40$2$2e$21$2e$0_$40$tanstac_ef21245c3a2c743a3788191ecd5f8e60$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waitForTransactionReceipt"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$wagmi$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["config"], {
                        hash: txHash
                    });
                    if (receipt.status === "success") {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["confirmAdTx"])({
                            txHash: receipt.transactionHash,
                            signature: response.signature,
                            adId: response.adId
                        });
                    }
                    if (receipt.status === "reverted") {
                        throw Error("Transaction failed, Retry");
                    }
                }
                if (approveReceipt.status === "reverted") {
                    throw Error("Transaction not approved");
                }
                return response;
            }
        }["useFundAd.useMutation"],
        onSuccess: {
            "useFundAd.useMutation": ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Ad top up was successful");
            }
        }["useFundAd.useMutation"],
        onError: {
            "useFundAd.useMutation": function(error, variables, result, ctx) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.response.data.message || error.message || "Unable to top up ad", {
                    description: ""
                });
            }
        }["useFundAd.useMutation"]
    });
};
_s1(useFundAd, "J1f2yAZ0neRaoNCarsFhFoIEjIU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useWithdrawFunds = ()=>{
    _s2();
    const { writeContractAsync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            "withdraw-ad"
        ],
        mutationFn: {
            "useWithdrawFunds.useMutation": async (data)=>{
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withdrawFromAd"])(data);
                const txHash = await writeContractAsync({
                    address: response.contractAddress,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$abis$2f$AdManager$2e$abi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AD_MANAGER_ABI"],
                    chainId: Number(response.chainId),
                    functionName: "withdrawFromAd",
                    args: [
                        response.signature,
                        response.authToken,
                        BigInt(response.timeToExpire),
                        response.adId,
                        data.amountBigInt,
                        data.to
                    ]
                });
                const receipt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$core$40$2$2e$21$2e$0_$40$tanstac_ef21245c3a2c743a3788191ecd5f8e60$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waitForTransactionReceipt"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$wagmi$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["config"], {
                    hash: txHash
                });
                if (receipt.status === "success") {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["confirmAdTx"])({
                        txHash: receipt.transactionHash,
                        signature: response.signature,
                        adId: response.adId
                    });
                }
                return response;
            }
        }["useWithdrawFunds.useMutation"],
        onSuccess: {
            "useWithdrawFunds.useMutation": ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Funds withdrawal was successful");
            }
        }["useWithdrawFunds.useMutation"],
        onError: {
            "useWithdrawFunds.useMutation": function(error, variables, result, ctx) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.response.data.message || error.message || "Unable to withdraw", {
                    description: ""
                });
            }
        }["useWithdrawFunds.useMutation"]
    });
};
_s2(useWithdrawFunds, "QwdQgIjChtY2ln5sipp6NPeRIAY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useCloseAd = ()=>{
    _s3();
    const { writeContractAsync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            "close-ad"
        ],
        mutationFn: {
            "useCloseAd.useMutation": async (data)=>{
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closeAd"])(data);
                const txHash = await writeContractAsync({
                    address: response.contractAddress,
                    abi: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$abis$2f$AdManager$2e$abi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AD_MANAGER_ABI"],
                    chainId: Number(response.chainId),
                    functionName: "closeAd",
                    args: [
                        response.signature,
                        response.authToken,
                        BigInt(response.timeToExpire),
                        response.adId,
                        data.to
                    ]
                });
                const receipt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$core$40$2$2e$21$2e$0_$40$tanstac_ef21245c3a2c743a3788191ecd5f8e60$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$actions$2f$waitForTransactionReceipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["waitForTransactionReceipt"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$wagmi$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["config"], {
                    hash: txHash
                });
                if (receipt.status === "success") {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["confirmAdTx"])({
                        txHash: receipt.transactionHash,
                        signature: response.signature,
                        adId: response.adId
                    });
                }
                return response;
            }
        }["useCloseAd.useMutation"],
        onSuccess: {
            "useCloseAd.useMutation": ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Ad closed successfully");
            }
        }["useCloseAd.useMutation"],
        onError: {
            "useCloseAd.useMutation": function(error, variables, result, ctx) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.response.data.message || error.message || "Unable to close ad", {
                    description: ""
                });
            }
        }["useCloseAd.useMutation"]
    });
};
_s3(useCloseAd, "QwdQgIjChtY2ln5sipp6NPeRIAY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useWriteContract$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWriteContract"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useConfirmAdTx = ()=>{
    _s4();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            "confirm-ad-tx"
        ],
        mutationFn: {
            "useConfirmAdTx.useMutation": (data)=>{
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["confirmAdTx"])(data);
            }
        }["useConfirmAdTx.useMutation"],
        onSuccess: {
            "useConfirmAdTx.useMutation": ()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Tx confirmed successful");
            }
        }["useConfirmAdTx.useMutation"],
        onError: {
            "useConfirmAdTx.useMutation": function(error, variables, result, ctx) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error.response.data.message || error.message || "Unable to confirm ad", {
                    description: ""
                });
            }
        }["useConfirmAdTx.useMutation"]
    });
};
_s4(useConfirmAdTx, "wwwtpB20p0aLiHIvSy5P98MwIUg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const useGetAllAds = (params)=>{
    _s5();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "get-all-ads",
            params
        ],
        queryFn: {
            "useGetAllAds.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllAds"])(params)
        }["useGetAllAds.useQuery"]
    });
};
_s5(useGetAllAds, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
const useGetSingleAd = (id)=>{
    _s6();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "get-single-ad",
            id
        ],
        queryFn: {
            "useGetSingleAd.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$services$2f$ads$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSingleAd"])(id)
        }["useGetSingleAd.useQuery"]
    });
};
_s6(useGetSingleAd, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$89$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/lib/chain-icons.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chain_icons",
    ()=>chain_icons
]);
const chain_icons = {
    11155111: "/assets/logos/eth.svg",
    296: "/assets/logos/hbar.png"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/utils/truncate-string.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "truncateString",
    ()=>truncateString
]);
const truncateString = function(address) {
    let head = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 4, tail = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 4;
    if (!address) return "";
    const addr = address.trim();
    if (addr.length <= head + tail + 3) return addr // short enough, return as-is
    ;
    // preserve 0x prefix if present
    const prefix = addr.startsWith("0x") ? "0x" : "";
    const core = prefix ? addr.slice(2) : addr;
    const start = core.slice(0, Math.max(0, head - (prefix ? 0 : 0)));
    const end = core.slice(-tail);
    return "".concat(prefix).concat(start, "…").concat(end);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/components/shared/Status.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Status",
    ()=>Status
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const Status = (param)=>{
    let { status, className = "", size = "sm" } = param;
    const base = "inline-flex items-center justify-center font-medium uppercase rounded-full";
    const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
    const colorMap = {
        ACTIVE: "bg-primary text-black",
        PAUSED: "bg-amber-500 text-black",
        INACTIVE: "bg-grey-600 text-grey-200",
        CLOSED: "bg-red-500 text-white",
        EXHAUSTED: "bg-transparent border border-red-600 text-red-300"
    };
    var _colorMap_status;
    const colorClass = (_colorMap_status = colorMap[status]) !== null && _colorMap_status !== void 0 ? _colorMap_status : "bg-grey-800 text-grey-200";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "".concat(base, " ").concat(sizeClass, " ").concat(colorClass, " ").concat(className),
        "aria-label": "status ".concat(status),
        children: status
    }, void 0, false, {
        fileName: "[project]/apps/frontend/proof-bridge/components/shared/Status.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Status;
var _c;
__turbopack_context__.k.register(_c, "Status");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/lib/parse-to-bigint.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// helper: convert exponential/inexact numeric strings to an integer string then to BigInt
__turbopack_context__.s([
    "parseToBigInt",
    ()=>parseToBigInt,
    "toIntegerStringFromExponential",
    ()=>toIntegerStringFromExponential
]);
function toIntegerStringFromExponential(str) {
    if (!/[eE]/.test(str)) return str;
    const [base, expPart] = str.split(/[eE]/);
    const exp = Number(expPart);
    if (!Number.isFinite(exp)) throw new Error("Invalid exponent");
    const [intPart, fracPart = ""] = base.split(".");
    const digits = intPart + fracPart;
    const decPlaces = fracPart.length;
    const zerosToAdd = exp - decPlaces;
    if (zerosToAdd >= 0) {
        return digits + "0".repeat(zerosToAdd);
    } else {
        // result would have a decimal point -> take integer portion (floor)
        const pos = digits.length + zerosToAdd;
        return pos > 0 ? digits.slice(0, pos) : "0";
    }
}
function parseToBigInt(value) {
    if (value === undefined || value === null) return BigInt("0");
    if (typeof value === "bigint") return value;
    if (typeof value === "number") {
        // may lose precision for very large numbers, but numbers are usually safe here
        return BigInt(Math.floor(value));
    }
    // string case
    let s = value.trim().replace(/,/g, "");
    if (s === "") return BigInt("0");
    if (/[eE]/.test(s)) {
        s = toIntegerStringFromExponential(s);
    }
    if (s.includes(".")) {
        // drop fractional part (floor)
        s = s.split(".")[0] || "0";
    }
    return BigInt(s);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdActionsModal",
    ()=>AdActionsModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$modal$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Modal$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/antd@5.27.3_date-fns@2.30.0_aaaad78f5ec85afe765ffb7e6c6cc99d/node_modules/antd/es/modal/index.js [app-client] (ecmascript) <export default as Modal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/antd@5.27.3_date-fns@2.30.0_aaaad78f5ec85afe765ffb7e6c6cc99d/node_modules/antd/es/form/index.js [app-client] (ecmascript) <export default as Form>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$input$2d$number$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputNumber$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/antd@5.27.3_date-fns@2.30.0_aaaad78f5ec85afe765ffb7e6c6cc99d/node_modules/antd/es/input-number/index.js [app-client] (ecmascript) <export default as InputNumber>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/antd@5.27.3_date-fns@2.30.0_aaaad78f5ec85afe765ffb7e6c6cc99d/node_modules/antd/es/input/index.js [app-client] (ecmascript) <export default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$typography$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/antd@5.27.3_date-fns@2.30.0_aaaad78f5ec85afe765ffb7e6c6cc99d/node_modules/antd/es/typography/index.js [app-client] (ecmascript) <export default as Typography>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.37.7_bufferutil@4.0._ad33351cd73bee883c0f64ae830c6488/node_modules/viem/_esm/utils/unit/formatUnits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.37.7_bufferutil@4.0._ad33351cd73bee883c0f64ae830c6488/node_modules/viem/_esm/utils/unit/parseUnits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$lib$2f$parse$2d$to$2d$bigint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/lib/parse-to-bigint.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/wagmi@2.17.1_@tanstack+quer_1db52f1a8e9b4dd9e6560825cb9c62b2/node_modules/wagmi/dist/esm/hooks/useAccount.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$rainbow$2d$me$2b$rainbowkit$40$2$2e$2$2e$_97e44da15a6175bbd65523685b0fa0ef$2f$node_modules$2f40$rainbow$2d$me$2f$rainbowkit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@rainbow-me+rainbowkit@2.2._97e44da15a6175bbd65523685b0fa0ef/node_modules/@rainbow-me/rainbowkit/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/hooks/useAds.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
const AdActionsModal = (param)=>{
    let { actionType, open, setOpen, toggleOpen, ad, chain } = param;
    var _ad_adToken, _ad_adToken1;
    _s();
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccount"])();
    const { refetch: refetchAllAds } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"])({
        creatorAddress: account.address
    });
    const { openChainModal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$rainbow$2d$me$2b$rainbowkit$40$2$2e$2$2e$_97e44da15a6175bbd65523685b0fa0ef$2f$node_modules$2f40$rainbow$2d$me$2f$rainbowkit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useChainModal"])();
    const is_ad_chain = Number(ad.adToken.chainId) === account.chainId;
    const amount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatUnits"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$lib$2f$parse$2d$to$2d$bigint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseToBigInt"])(ad === null || ad === void 0 ? void 0 : ad.availableAmount), ad === null || ad === void 0 ? void 0 : (_ad_adToken = ad.adToken) === null || _ad_adToken === void 0 ? void 0 : _ad_adToken.decimals);
    const { mutateAsync: fundAd, isPending: isFundingAd } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFundAd"])();
    const { mutateAsync: withdrawFund, isPending: isWithdrawing } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWithdrawFunds"])();
    const { mutateAsync: closeAd, isPending: isClosingAd } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCloseAd"])();
    const [form] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].useForm();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const cfg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdActionsModal.useMemo[cfg]": ()=>({
                title: actionType === "withdraw" ? "Withdraw" : actionType === "top-up" ? "Top up" : "Close Ad",
                okText: actionType === "withdraw" ? "Withdraw" : actionType === "top-up" ? "Top up" : "Close ad"
            })
    }["AdActionsModal.useMemo[cfg]"], [
        actionType
    ]);
    const handleOk = async ()=>{
        if (is_ad_chain) {
            const values = await form.validateFields().catch(()=>null);
            if (!values) return;
            setLoading(true);
            try {
                if (actionType === "top-up") {
                    await fundAd({
                        poolAmountTopUp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUnits"])(values.amount, ad.adToken.decimals).toString(),
                        adId: ad.id,
                        amountBigInt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUnits"])(values.amount, ad.adToken.decimals)
                    });
                } else if (actionType === "withdraw") {
                    await withdrawFund({
                        poolAmountWithdraw: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUnits"])(values.amount, ad.adToken.decimals).toString(),
                        adId: ad.id,
                        amountBigInt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$parseUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseUnits"])(values.amount, ad.adToken.decimals),
                        to: account.address
                    });
                } else if (actionType === "close") {
                    await closeAd({
                        adId: ad.id,
                        to: account.address
                    });
                }
                setOpen(false);
                form.resetFields();
                await refetchAllAds();
            } finally{
                setLoading(false);
            }
        } else {
            openChainModal && openChainModal();
        }
    };
    const handleCancel = ()=>{
        if (!isFundingAd || !isWithdrawing || !isClosingAd) {
            form.resetFields();
            toggleOpen(); // uses the provided toggler
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$modal$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Modal$3e$__["Modal"], {
        open: open,
        title: cfg.title,
        okText: is_ad_chain ? cfg.okText : "Connect to Chain",
        onOk: handleOk,
        onCancel: handleCancel,
        confirmLoading: isFundingAd || isWithdrawing || isClosingAd,
        centered: true,
        width: 400,
        cancelButtonProps: {
            disabled: isFundingAd || isWithdrawing || isClosingAd
        },
        styles: {
            content: {
                padding: 16,
                borderRadius: "12px"
            },
            mask: {
                backdropFilter: "blur(12px)"
            }
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "my-5 grid gap-2 grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-primary capitalize pr-2 font-semibold text-xs",
                                    children: "Chain"
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "md:text-lg text-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: chain
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-primary capitalize pr-2 font-semibold text-xs",
                                    children: "Available"
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "md:text-lg text-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: [
                                            amount,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[16px] pl-2",
                                                children: ad === null || ad === void 0 ? void 0 : (_ad_adToken1 = ad.adToken) === null || _ad_adToken1 === void 0 ? void 0 : _ad_adToken1.symbol
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                                                lineNumber: 157,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            actionType !== "close" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"], {
                form: form,
                layout: "vertical",
                initialValues: {
                    amount: undefined,
                    note: ""
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                        label: "Amount",
                        name: "amount",
                        rules: [
                            {
                                required: true,
                                message: "Enter amount"
                            }
                        ],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$input$2d$number$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InputNumber$3e$__["InputNumber"], {
                            style: {
                                width: "100%"
                            },
                            placeholder: "Enter amount",
                            min: 0,
                            stringMode: true
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                            lineNumber: 174,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                        label: "Note (optional)",
                        name: "note",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"].TextArea, {
                            autoSize: {
                                minRows: 2,
                                maxRows: 4
                            },
                            maxLength: 140,
                            showCount: true
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                            lineNumber: 182,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                lineNumber: 164,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"], {
                form: form,
                layout: "vertical",
                initialValues: {
                    reason: ""
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$typography$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Typography$3e$__["Typography"].Paragraph, {
                        children: "Closing stops new orders. Liquidity is withdrawn to your wallet."
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].Item, {
                        label: "Reason (optional)",
                        name: "reason",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$input$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Input$3e$__["Input"].TextArea, {
                            autoSize: {
                                minRows: 2,
                                maxRows: 4
                            },
                            maxLength: 200,
                            showCount: true
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                            lineNumber: 195,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
                lineNumber: 190,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AdActionsModal, "VuYe4EzJLt3hs7kWApmEPwYmzzY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$rainbow$2d$me$2b$rainbowkit$40$2$2e$2$2e$_97e44da15a6175bbd65523685b0fa0ef$2f$node_modules$2f40$rainbow$2d$me$2f$rainbowkit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useChainModal"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFundAd"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWithdrawFunds"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCloseAd"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$form$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Form$3e$__["Form"].useForm
    ];
});
_c = AdActionsModal;
var _c;
__turbopack_context__.k.register(_c, "AdActionsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdCard",
    ()=>AdCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$lib$2f$chain$2d$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/lib/chain-icons.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$truncate$2d$string$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/utils/truncate-string.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dot$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/dot.js [app-client] (ecmascript) <export default as Dot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$hederaTestnet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.37.7_bufferutil@4.0._ad33351cd73bee883c0f64ae830c6488/node_modules/viem/_esm/chains/definitions/hederaTestnet.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.37.7_bufferutil@4.0._ad33351cd73bee883c0f64ae830c6488/node_modules/viem/_esm/chains/definitions/sepolia.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$vsc$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.1.0/node_modules/react-icons/vsc/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$components$2f$shared$2f$Status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/components/shared/Status.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.37.7_bufferutil@4.0._ad33351cd73bee883c0f64ae830c6488/node_modules/viem/_esm/utils/unit/formatUnits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$rx$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.1.0/node_modules/react-icons/rx/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$moment$40$2$2e$30$2e$1$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/moment@2.30.1/node_modules/moment/moment.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$button$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/antd@5.27.3_date-fns@2.30.0_aaaad78f5ec85afe765ffb7e6c6cc99d/node_modules/antd/es/button/index.js [app-client] (ecmascript) <locals> <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$components$2f$dashboard$2f$AdActionsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/components/dashboard/AdActionsModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$lib$2f$parse$2d$to$2d$bigint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/lib/parse-to-bigint.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const explorer_urls = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$hederaTestnet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hederaTestnet"].id]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$hederaTestnet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hederaTestnet"].blockExplorers.default.url,
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sepolia"].id]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sepolia"].blockExplorers.default.url
};
const chains = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$hederaTestnet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hederaTestnet"].id]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$hederaTestnet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hederaTestnet"],
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sepolia"].id]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$chains$2f$definitions$2f$sepolia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sepolia"]
};
const AdCard = (param)=>{
    let { ad } = param;
    var _ad_adToken, _ad_adToken1, _ad_adToken2, _ad_adToken3, _ad_metadata, _chains_ad_adToken_chainId, _ad_adToken4, _chains_ad_adToken_chainId1, _ad_adToken5, _chains_ad_orderToken_chainId, _ad_adToken6, _ad_adToken7, _ad_adToken8, _ad_adToken9, _chains_ad_adToken_chainId2, _ad_adToken10;
    _s();
    const [openModal, setOpenModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const toggleModal = ()=>setOpenModal(!openModal);
    const [actionType, setActionType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const amount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatUnits"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$lib$2f$parse$2d$to$2d$bigint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseToBigInt"])(ad === null || ad === void 0 ? void 0 : ad.availableAmount), ad === null || ad === void 0 ? void 0 : (_ad_adToken = ad.adToken) === null || _ad_adToken === void 0 ? void 0 : _ad_adToken.decimals);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-[100px] space-y-4 md:space-y-5 p-4 border-grey-700 border-1 rounded-lg bg-grey-900",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-5 justify-between flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$lib$2f$chain$2d$icons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chain_icons"][Number(ad === null || ad === void 0 ? void 0 : (_ad_adToken1 = ad.adToken) === null || _ad_adToken1 === void 0 ? void 0 : _ad_adToken1.chainId)],
                                        alt: "",
                                        height: 50,
                                        width: 50,
                                        className: "bg-amber-500/10 p-1 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 44,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "".concat(explorer_urls[ad === null || ad === void 0 ? void 0 : (_ad_adToken2 = ad.adToken) === null || _ad_adToken2 === void 0 ? void 0 : _ad_adToken2.chainId], "/address/").concat(ad === null || ad === void 0 ? void 0 : (_ad_adToken3 = ad.adToken) === null || _ad_adToken3 === void 0 ? void 0 : _ad_adToken3.address),
                                                        className: "text-sm !underline",
                                                        target: "_blank",
                                                        children: (ad === null || ad === void 0 ? void 0 : (_ad_metadata = ad.metadata) === null || _ad_metadata === void 0 ? void 0 : _ad_metadata.title) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$utils$2f$truncate$2d$string$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["truncateString"])(ad === null || ad === void 0 ? void 0 : ad.id, 6, 6)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                        lineNumber: 53,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                        className: "text-primary",
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                        lineNumber: 62,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                lineNumber: 52,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm flex gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-grey-300",
                                                                children: "Chain:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                                lineNumber: 67,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            " ",
                                                            (_chains_ad_adToken_chainId = chains[ad === null || ad === void 0 ? void 0 : (_ad_adToken4 = ad.adToken) === null || _ad_adToken4 === void 0 ? void 0 : _ad_adToken4.chainId]) === null || _chains_ad_adToken_chainId === void 0 ? void 0 : _chains_ad_adToken_chainId.name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                        lineNumber: 66,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dot$3e$__["Dot"], {
                                                        className: "text-grey-300"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                        lineNumber: 70,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "Verified"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                                lineNumber: 72,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$vsc$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VscVerifiedFilled"], {
                                                                className: "text-primary"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                                lineNumber: 73,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                        lineNumber: 71,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                lineNumber: 65,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 51,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$components$2f$shared$2f$Status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Status"], {
                                status: ad === null || ad === void 0 ? void 0 : ad.status
                            }, void 0, false, {
                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid 2xl:grid-cols-4 md:grid-cols-3 gap-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-grey-300",
                                        children: "Bridge Route"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 83,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "md:text-2xl text-lg flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: (_chains_ad_adToken_chainId1 = chains[ad === null || ad === void 0 ? void 0 : (_ad_adToken5 = ad.adToken) === null || _ad_adToken5 === void 0 ? void 0 : _ad_adToken5.chainId]) === null || _chains_ad_adToken_chainId1 === void 0 ? void 0 : _chains_ad_adToken_chainId1.name
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                lineNumber: 85,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                lineNumber: 86,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: (_chains_ad_orderToken_chainId = chains[ad === null || ad === void 0 ? void 0 : ad.orderToken.chainId]) === null || _chains_ad_orderToken_chainId === void 0 ? void 0 : _chains_ad_orderToken_chainId.name
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                lineNumber: 87,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[12px] text-grey-300",
                                        children: [
                                            ad === null || ad === void 0 ? void 0 : (_ad_adToken6 = ad.adToken) === null || _ad_adToken6 === void 0 ? void 0 : _ad_adToken6.symbol,
                                            "/",
                                            ad === null || ad === void 0 ? void 0 : ad.orderToken.symbol
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 89,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-grey-300",
                                        children: "Available"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "md:text-2xl text-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: [
                                                amount,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[16px] pl-2",
                                                    children: ad === null || ad === void 0 ? void 0 : (_ad_adToken7 = ad.adToken) === null || _ad_adToken7 === void 0 ? void 0 : _ad_adToken7.symbol
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                    lineNumber: 99,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                            lineNumber: 97,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 96,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[12px] text-grey-300",
                                        children: "~ Liquidity"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 102,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-grey-300",
                                        children: "Limits"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "md:text-2xl text-lg flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatUnits"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$lib$2f$parse$2d$to$2d$bigint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseToBigInt"])((ad === null || ad === void 0 ? void 0 : ad.minAmount) || "0"), ad === null || ad === void 0 ? void 0 : (_ad_adToken8 = ad.adToken) === null || _ad_adToken8 === void 0 ? void 0 : _ad_adToken8.decimals)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                lineNumber: 108,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$rx$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RxDash"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                lineNumber: 114,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$37$2e$7_bufferutil$40$4$2e$0$2e$_ad33351cd73bee883c0f64ae830c6488$2f$node_modules$2f$viem$2f$_esm$2f$utils$2f$unit$2f$formatUnits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatUnits"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$lib$2f$parse$2d$to$2d$bigint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseToBigInt"])((ad === null || ad === void 0 ? void 0 : ad.maxAmount) || "0"), ad === null || ad === void 0 ? void 0 : (_ad_adToken9 = ad.adToken) === null || _ad_adToken9 === void 0 ? void 0 : _ad_adToken9.decimals)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                lineNumber: 115,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 107,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[12px] text-grey-300",
                                        children: "Per order"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 122,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-4 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-grey-300 capitalize pr-2 font-semibold text-xs",
                                        children: "Last updated"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1 text-grey-100 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: " h-3 w-1 bg-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                        lineNumber: 133,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$moment$40$2$2e$30$2e$1$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(ad.updatedAt).format("ll")
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                        lineNumber: 134,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                lineNumber: 132,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$moment$40$2$2e$30$2e$1$2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(ad.updatedAt).format("LT")
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                                lineNumber: 136,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 131,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            ad.status !== "CLOSED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4",
                                children: [
                                    amount !== "0" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$button$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__["Button"], {
                                        className: "!h-[40px] w-[90px] !font-semibold !border-primary",
                                        onClick: ()=>{
                                            setActionType("withdraw");
                                            toggleModal();
                                        },
                                        children: "Withdraw"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 143,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$button$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__["Button"], {
                                        className: "!h-[40px] w-[90px] !font-semibold",
                                        type: "primary",
                                        onClick: ()=>{
                                            setActionType("top-up");
                                            toggleModal();
                                        },
                                        children: "Top up"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$button$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__["Button"], {
                                        className: "!h-[40px] w-[90px] !font-semibold",
                                        type: "primary",
                                        danger: true,
                                        onClick: ()=>{
                                            setActionType("close");
                                            toggleModal();
                                        },
                                        children: "Close"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                        lineNumber: 163,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$components$2f$dashboard$2f$AdActionsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdActionsModal"], {
                open: openModal,
                setOpen: setOpenModal,
                toggleOpen: toggleModal,
                actionType: actionType,
                ad: ad,
                chain: (_chains_ad_adToken_chainId2 = chains[ad === null || ad === void 0 ? void 0 : (_ad_adToken10 = ad.adToken) === null || _ad_adToken10 === void 0 ? void 0 : _ad_adToken10.chainId]) === null || _chains_ad_adToken_chainId2 === void 0 ? void 0 : _chains_ad_adToken_chainId2.name
            }, void 0, false, {
                fileName: "[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(AdCard, "uV61wdstWLcMNcyu4xqJfgM6SZE=");
_c = AdCard;
var _c;
__turbopack_context__.k.register(_c, "AdCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$ci$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.1.0/node_modules/react-icons/ci/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$rx$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.1.0/node_modules/react-icons/rx/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$gi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.1.0/node_modules/react-icons/gi/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-icons@5.5.0_react@19.1.0/node_modules/react-icons/io5/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/hooks/useAds.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/wagmi@2.17.1_@tanstack+quer_1db52f1a8e9b4dd9e6560825cb9c62b2/node_modules/wagmi/dist/esm/hooks/useAccount.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$components$2f$dashboard$2f$AdCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/frontend/proof-bridge/components/dashboard/AdCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$tabs$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tabs$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/antd@5.27.3_date-fns@2.30.0_aaaad78f5ec85afe765ffb7e6c6cc99d/node_modules/antd/es/tabs/index.js [app-client] (ecmascript) <export default as Tabs>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const HomePage = ()=>{
    var _all_ads_data, _all_active_ads_data, _all_inactive_ads_data, _all_exhaused_ads_data, _all_closed_ads_data, _all_active_ads_data_length, _all_active_ads_data1;
    _s();
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccount"])();
    const { data: all_active_ads } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"])({
        status: "ACTIVE",
        creatorAddress: account.address
    });
    const { data: all_inactive_ads } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"])({
        status: "PAUSED",
        creatorAddress: account.address
    });
    const { data: all_exhaused_ads } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"])({
        status: "EXHAUSTED",
        creatorAddress: account.address
    });
    const { data: all_closed_ads } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"])({
        status: "CLOSED",
        creatorAddress: account.address
    });
    const { data: all_ads } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"])({
        creatorAddress: account.address
    });
    const items = [
        {
            key: "1",
            label: "All ads",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 md:space-y-6",
                children: all_ads === null || all_ads === void 0 ? void 0 : (_all_ads_data = all_ads.data) === null || _all_ads_data === void 0 ? void 0 : _all_ads_data.map((ad)=>{
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$components$2f$dashboard$2f$AdCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdCard"], {
                        ad: ad
                    }, ad.id, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                        lineNumber: 46,
                        columnNumber: 20
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        },
        {
            key: "2",
            label: "Active",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 md:space-y-6",
                children: all_active_ads === null || all_active_ads === void 0 ? void 0 : (_all_active_ads_data = all_active_ads.data) === null || _all_active_ads_data === void 0 ? void 0 : _all_active_ads_data.map((ad)=>{
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$components$2f$dashboard$2f$AdCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdCard"], {
                        ad: ad
                    }, ad.id, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                        lineNumber: 57,
                        columnNumber: 20
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        },
        {
            key: "3",
            label: "Inactive",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 md:space-y-6",
                children: all_inactive_ads === null || all_inactive_ads === void 0 ? void 0 : (_all_inactive_ads_data = all_inactive_ads.data) === null || _all_inactive_ads_data === void 0 ? void 0 : _all_inactive_ads_data.map((ad)=>{
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$components$2f$dashboard$2f$AdCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdCard"], {
                        ad: ad
                    }, ad.id, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                        lineNumber: 68,
                        columnNumber: 20
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        },
        {
            key: "4",
            label: "Exhausted",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 md:space-y-6",
                children: all_exhaused_ads === null || all_exhaused_ads === void 0 ? void 0 : (_all_exhaused_ads_data = all_exhaused_ads.data) === null || _all_exhaused_ads_data === void 0 ? void 0 : _all_exhaused_ads_data.map((ad)=>{
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$components$2f$dashboard$2f$AdCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdCard"], {
                        ad: ad
                    }, ad.id, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                        lineNumber: 79,
                        columnNumber: 20
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                lineNumber: 77,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        },
        {
            key: "5",
            label: "Closed",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 md:space-y-6",
                children: all_closed_ads === null || all_closed_ads === void 0 ? void 0 : (_all_closed_ads_data = all_closed_ads.data) === null || _all_closed_ads_data === void 0 ? void 0 : _all_closed_ads_data.map((ad)=>{
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$components$2f$dashboard$2f$AdCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdCard"], {
                        ad: ad
                    }, ad.id, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                        lineNumber: 90,
                        columnNumber: 20
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-[98%] mx-auto space-y-4 md:space-y-8 md:py-2 md:px-0 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "md:text-4xl text-lg",
                        children: "Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm",
                        children: "Manage your ads and orders here"
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid md:grid-cols-4 grid-cols-2 md:gap-7 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-grey-800 border-1 p-4 rounded-md w-full bg-gradient-to-bl from-grey-900 to-grey-1000",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex w-full justify-between items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$ci$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CiBadgeDollar"], {
                                                size: 24
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 108,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$rx$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RxDoubleArrowUp"], {
                                                className: "text-primary"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 109,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                        lineNumber: 107,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl md:text-2xl font-semibold",
                                                children: "200.0 ETH"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 112,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm",
                                                children: "Trade Volume"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 113,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                lineNumber: 106,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-grey-700 border-1 p-4 rounded-md w-full bg-gradient-to-tr from-grey-900 to-grey-1000",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex w-full justify-between items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$gi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GiTrade"], {
                                                size: 24
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 123,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$rx$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RxDoubleArrowUp"], {
                                                className: "text-primary"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 124,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                        lineNumber: 122,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl md:text-2xl font-semibold",
                                                children: all_active_ads === null || all_active_ads === void 0 ? void 0 : (_all_active_ads_data1 = all_active_ads.data) === null || _all_active_ads_data1 === void 0 ? void 0 : (_all_active_ads_data_length = _all_active_ads_data1.length) === null || _all_active_ads_data_length === void 0 ? void 0 : _all_active_ads_data_length.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 127,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm",
                                                children: "Active ads"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 130,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-grey-800 border-1 p-4 rounded-md w-full bg-gradient-to-bl from-grey-900 to-grey-1000",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex w-full justify-between items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$io5$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IoReceiptOutline"], {
                                                size: 24
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 140,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$rx$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RxDoubleArrowUp"], {
                                                className: "text-primary"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 141,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl md:text-2xl font-semibold",
                                                children: "15"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 144,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm",
                                                children: "Completed orders"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                            lineNumber: 137,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-grey-700 border-1 p-4 rounded-md w-full bg-gradient-to-br from-grey-900 to-grey-1000",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex w-full justify-between items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                size: 24
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 155,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$icons$40$5$2e$5$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$react$2d$icons$2f$rx$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RxDoubleArrowUp"], {
                                                className: "text-primary"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl md:text-2xl font-semibold",
                                                children: [
                                                    89.57,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 159,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm",
                                                children: "Avg. completion"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$2_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$antd$40$5$2e$27$2e$3_date$2d$fns$40$2$2e$30$2e$0_aaaad78f5ec85afe765ffb7e6c6cc99d$2f$node_modules$2f$antd$2f$es$2f$tabs$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tabs$3e$__["Tabs"], {
                    defaultActiveKey: "1",
                    items: items,
                    type: "card",
                    size: "large"
                }, void 0, false, {
                    fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                    lineNumber: 167,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/frontend/proof-bridge/app/(app)/(auth-protected)/home/page.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(HomePage, "EKAsVG8naVx+h5gfGzhSivHrXg0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$2$2e$17$2e$1_$40$tanstack$2b$quer_1db52f1a8e9b4dd9e6560825cb9c62b2$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$hooks$2f$useAccount$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccount"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$frontend$2f$proof$2d$bridge$2f$hooks$2f$useAds$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllAds"]
    ];
});
_c = HomePage;
const __TURBOPACK__default__export__ = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_frontend_proof-bridge_42666369._.js.map