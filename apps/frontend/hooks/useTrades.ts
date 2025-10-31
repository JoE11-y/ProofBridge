import { ORDER_PORTAL_ABI } from "@/abis/orderPortal.abi"
import {
  confirmTradeTx,
  confirmUnlockFunds,
  createTrade,
  getAllTrades,
  getTradeParams,
  lockFunds,
  unlockFunds,
} from "@/services/trades.service"
import {
  ICreateTradeRequest,
  IGetTradesParams,
  IUnlockFundsRequest,
} from "@/types/trades"
import { config } from "@/utils/wagmi-config"
import { useMutation, useQuery } from "@tanstack/react-query"
import { waitForTransactionReceipt } from "wagmi/actions"
import { useAccount, useWriteContract, useSignTypedData } from "wagmi"
import { toast } from "sonner"
import { ERC20_ABI } from "@/abis/ERC20.abi"
import { getSingleToken, getTokens } from "@/services/tokens.service"
import { AD_MANAGER_ABI } from "@/abis/AdManager.abi"
import { formatUnits, parseEther } from "viem"

export const useCreateTrade = () => {
  const account = useAccount()
  const { writeContractAsync } = useWriteContract()
  return useMutation({
    mutationKey: ["create-trade"],
    mutationFn: async (data: ICreateTradeRequest) => {
      const response = await createTrade(data)
      const token = await getSingleToken(data.orderTokenId)

      if (token.kind === "ERC20") {
        const approveHash = await writeContractAsync({
          address: response.reqContractDetails.orderParams.orderChainToken,
          abi: ERC20_ABI,
          chainId: Number(token.chain.chainId),
          functionName: "approve",
          args: [
            response.reqContractDetails.contractAddress,
            BigInt(response.reqContractDetails.orderParams.amount),
          ],
        })

        const approveReceipt = await waitForTransactionReceipt(config, {
          hash: approveHash,
        })

        if (approveReceipt.status === "success") {
          const txHash = await writeContractAsync({
            address: response.reqContractDetails.contractAddress,
            chainId: Number(response.reqContractDetails.chainId),
            abi: ORDER_PORTAL_ABI,
            functionName: "createOrder",
            args: [
              response.reqContractDetails.signature,
              response.reqContractDetails.authToken,
              BigInt(response.reqContractDetails.timeToExpire),
              {
                orderChainToken:
                  response.reqContractDetails.orderParams.orderChainToken,
                adChainToken:
                  response.reqContractDetails.orderParams.adChainToken,
                amount: BigInt(response.reqContractDetails.orderParams.amount),
                bridger: response.reqContractDetails.orderParams.bridger,
                orderRecipient:
                  response.reqContractDetails.orderParams.orderRecipient,
                adChainId: BigInt(
                  response.reqContractDetails.orderParams.adChainId
                ),
                adManager: response.reqContractDetails.orderParams.adManager,
                adId: response.reqContractDetails.orderParams.adId,
                adCreator: response.reqContractDetails.orderParams.adCreator,
                adRecipient:
                  response.reqContractDetails.orderParams.adRecipient,
                salt: BigInt(response.reqContractDetails.orderParams.salt),
              },
            ],
          })

          const receipt = await waitForTransactionReceipt(config, {
            hash: txHash,
          })
          if (receipt.status === "success") {
            await confirmTradeTx({
              txHash: receipt.transactionHash,
              signature: response.reqContractDetails.signature,
              tradeId: response.tradeId,
            })
          }

          if (receipt.status !== "success") {
            throw Error("Transaction failed, Retry")
          }
        }

        if (approveReceipt.status !== "success") {
          throw Error("Transaction failed, Retry")
        }
      }

      if (token.kind === "NATIVE") {
        const amount = formatUnits(BigInt(data.amount), token.decimals)
        const txHash = await writeContractAsync({
          address: response.reqContractDetails.contractAddress,
          chainId: Number(response.reqContractDetails.chainId),
          abi: ORDER_PORTAL_ABI,
          functionName: "createOrder",
          args: [
            response.reqContractDetails.signature,
            response.reqContractDetails.authToken,
            BigInt(response.reqContractDetails.timeToExpire),
            {
              orderChainToken:
                response.reqContractDetails.orderParams.orderChainToken,
              adChainToken:
                response.reqContractDetails.orderParams.adChainToken,
              amount: BigInt(response.reqContractDetails.orderParams.amount),
              bridger: response.reqContractDetails.orderParams.bridger,
              orderRecipient:
                response.reqContractDetails.orderParams.orderRecipient,
              adChainId: BigInt(
                response.reqContractDetails.orderParams.adChainId
              ),
              adManager: response.reqContractDetails.orderParams.adManager,
              adId: response.reqContractDetails.orderParams.adId,
              adCreator: response.reqContractDetails.orderParams.adCreator,
              adRecipient: response.reqContractDetails.orderParams.adRecipient,
              salt: BigInt(response.reqContractDetails.orderParams.salt),
            },
          ],
          value: parseEther(amount),
        })

        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash,
        })
        if (receipt.status === "success") {
          await confirmTradeTx({
            txHash: receipt.transactionHash,
            signature: response.reqContractDetails.signature,
            tradeId: response.tradeId,
          })
        }

        if (receipt.status !== "success") {
          throw Error("Transaction failed, Retry")
        }
      }

      return response
    },

    onSuccess: () => {
      toast.success("Trade creation was successful")
    },
    onError: function (error: any, variables, result, ctx) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to open trade",
        {
          description: "",
        }
      )
    },
  })
}

export const useLockFunds = () => {
  const { writeContractAsync } = useWriteContract()
  return useMutation({
    mutationKey: ["lock-fund"],
    mutationFn: async (id: string) => {
      const response = await lockFunds(id)

      const txHash = await writeContractAsync({
        address: response.contractAddress,
        chainId: Number(response.chainId),
        abi: AD_MANAGER_ABI,
        functionName: "lockForOrder",
        args: [
          response.signature,
          response.authToken,
          BigInt(response.timeToExpire),
          {
            orderChainToken: response.orderParams.orderChainToken,
            adChainToken: response.orderParams.adChainToken,
            amount: BigInt(response.orderParams.amount),
            bridger: response.orderParams.bridger,
            orderChainId: BigInt(response.orderParams.orderChainId),
            srcOrderPortal: response.orderParams.srcOrderPortal,
            orderRecipient: response.orderParams.orderRecipient,
            adId: response.orderParams.adId,
            adCreator: response.orderParams.adCreator,
            adRecipient: response.orderParams.adRecipient,
            salt: BigInt(response.orderParams.salt),
          },
        ],
      })

      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      })
      if (receipt.status === "success") {
        await confirmTradeTx({
          txHash: receipt.transactionHash,
          signature: response.signature,
          tradeId: id,
        })
      }

      if (receipt.status !== "success") {
        throw Error("Transaction failed, Retry")
      }

      return response
    },

    onSuccess: () => {
      toast.success("Funds lock was successful")
    },
    onError: function (error: any, variables, result, ctx) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to lock funds",
        {
          description: "",
        }
      )
    },
  })
}

export const useUnLockFunds = () => {
  const { writeContractAsync } = useWriteContract()
  const { signTypedDataAsync } = useSignTypedData()
  const account = useAccount()
  return useMutation({
    mutationKey: ["unlock-fund"],
    mutationFn: async (id: string) => {
      const params = await getTradeParams(id)
      const signature = await signTypedDataAsync({
        types: {
          Order: [
            { name: "orderChainToken", type: "address" },
            { name: "adChainToken", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "bridger", type: "address" },
            { name: "orderChainId", type: "uint256" },
            { name: "orderPortal", type: "address" },
            { name: "orderRecipient", type: "address" },
            { name: "adChainId", type: "uint256" },
            { name: "adManager", type: "address" },
            { name: "adId", type: "string" },
            { name: "adCreator", type: "address" },
            { name: "adRecipient", type: "address" },
            { name: "salt", type: "uint256" },
          ],
        },
        primaryType: "Order",
        message: {
          orderChainToken: params.orderChainToken,
          adChainToken: params.adChainToken,
          amount: BigInt(params.amount),
          bridger: params.bridger,
          orderChainId: BigInt(params.orderChainId),
          orderPortal: params.orderPortal,
          orderRecipient: params.orderRecipient,
          adChainId: BigInt(params.adChainId),
          adManager: params.adManager,
          adId: params.adId,
          adCreator: params.adCreator,
          adRecipient: params.adRecipient,
          salt: BigInt(params.salt),
        },
        domain: {
          name: "Proofbridge",
          version: "1",
        },
      })
      const response = await unlockFunds({ id, signature: signature })
      const isBridger = account.address === params?.bridger

      const txHash = await writeContractAsync({
        address: response.contractAddress,
        chainId: Number(response.chainId),
        abi: isBridger ? AD_MANAGER_ABI : ORDER_PORTAL_ABI,
        functionName: "unlock",
        args: [
          response.signature,
          response.authToken,
          BigInt(response.timeToExpire),
          isBridger
            ? {
                ...response.orderParams,
                amount: BigInt(response.orderParams.amount),
                orderChainId: BigInt(response.orderParams.orderChainId),
                salt: BigInt(response.orderParams.salt),
              }
            : {
                ...response.orderParams,
                amount: BigInt(response.orderParams.amount),
                adChainId: BigInt(response.orderParams.adChainId),
                salt: BigInt(response.orderParams.salt),
              },
          response.nullifierHash,
          response.targetRoot,
          response.proof,
        ],
      })

      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      })
      if (receipt.status === "success") {
        await confirmUnlockFunds({
          txHash: receipt.transactionHash,
          signature: response.signature,
          id,
        })
      }

      if (receipt.status !== "success") {
        throw Error("Transaction failed, Retry")
      }

      return response
    },

    onSuccess: () => {
      toast.success("Funds released successfully")
    },
    onError: function (error: any, variables, result, ctx) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to release funds",
        {
          description: "",
        }
      )
    },
  })
}

export const useGetAllTrades = (params: IGetTradesParams) => {
  return useQuery({
    queryKey: ["trades", params],
    queryFn: () => getAllTrades(params),
  })
}
