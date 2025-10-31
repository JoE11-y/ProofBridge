import { AD_MANAGER_ABI } from "@/abis/AdManager.abi"
import { ERC20_ABI } from "@/abis/ERC20.abi"
import {
  closeAd,
  confirmAdTx,
  createAd,
  fundAd,
  getAllAds,
  getSingleAd,
  withdrawFromAd,
} from "@/services/ads.service"
import {
  ICloseAdRequest,
  IConfirmAdTxRequest,
  ICreateAdRequest,
  IGetAdsParams,
  ITopUpAdRequest,
  IWithdrawFromAdRequest,
} from "@/types/ads"
import { config } from "@/utils/wagmi-config"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAccount, useSendTransaction, useWriteContract } from "wagmi"
import { waitForTransactionReceipt } from "wagmi/actions"
import { getSingleToken, getTokens } from "@/services/tokens.service"
import { IToken } from "@/types/tokens"
import { formatUnits, parseEther } from "viem"

export const useCreateAd = () => {
  const { writeContractAsync } = useWriteContract()
  const { sendTransactionAsync } = useSendTransaction()
  return useMutation({
    mutationKey: ["create-ad"],
    mutationFn: async (data: { payload: ICreateAdRequest; token: IToken }) => {
      const response = await createAd(data.payload)
      const token = data.token
      const performERC20Tx = async () => {
        const txHash = await writeContractAsync({
          address: response.contractAddress,
          abi: AD_MANAGER_ABI,
          chainId: Number(response.chainId),
          functionName: "createAd",
          args: [
            response.signature,
            response.authToken,
            BigInt(response.timeToExpire),
            response.adId,
            response.adToken,
            data.payload.fundAmount,
            BigInt(response.orderChainId),
            response.adRecipient,
          ],
        })
        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash,
        })

        if (receipt.status === "success") {
          await confirmAdTx({
            txHash: receipt.transactionHash,
            signature: response.signature,
            adId: response.adId,
          })
        }

        if (receipt.status === "reverted") {
          throw Error("Transaction failed, Retry")
        }
      }
      if (token.kind === "ERC20") {
        const approveHash = await writeContractAsync({
          address: token.address,
          abi: ERC20_ABI,
          chainId: Number(response.chainId),
          functionName: "approve",
          args: [response.contractAddress, data.payload.fundAmount],
        })
        const approveReceipt = await waitForTransactionReceipt(config, {
          hash: approveHash,
        })
        if (approveReceipt.status === "success") {
          await performERC20Tx()
        }
        if (approveReceipt.status === "reverted") {
          throw Error("Transaction not approved")
        }
      }
      if (token.kind === "NATIVE") {
        const amount = formatUnits(
          BigInt(data.payload.fundAmount),
          token.decimals
        )
        const txHash = await writeContractAsync({
          address: response.contractAddress,
          abi: AD_MANAGER_ABI,
          chainId: Number(response.chainId),
          functionName: "createAd",
          args: [
            response.signature,
            response.authToken,
            BigInt(response.timeToExpire),
            response.adId,
            response.adToken,
            data.payload.fundAmount,
            BigInt(response.orderChainId),
            response.adRecipient,
          ],
          value: parseEther(amount),
        })
        const txReceipt = await waitForTransactionReceipt(config, {
          hash: txHash,
        })
        if (txReceipt.status === "success") {
          await confirmAdTx({
            txHash: txReceipt.transactionHash,
            signature: response.signature,
            adId: response.adId,
          })
        }
        if (txReceipt.status === "reverted") {
          throw Error("Transaction failed")
        }
      }
      return response
    },
    onSuccess: () => {
      toast.success("Ad creation was successful")
    },
    onError: function (error: any, variables, result, ctx) {
      toast.error(
        error.response.data.message || error.message || "Unable to create ad",
        {
          description: "",
        }
      )
    },
  })
}

export const useFundAd = () => {
  const { writeContractAsync } = useWriteContract()
  const account = useAccount()

  return useMutation({
    mutationKey: ["fund-ad"],
    mutationFn: async (data: ITopUpAdRequest) => {
      const response = await fundAd(data)
      const token = await getSingleToken(data.tokenId)
      if (token.kind === "ERC20") {
        const approveHash = await writeContractAsync({
          address: token.address,
          abi: ERC20_ABI,
          chainId: Number(response.chainId),
          functionName: "approve",
          args: [response.contractAddress, data.amountBigInt],
        })

        const approveReceipt = await waitForTransactionReceipt(config, {
          hash: approveHash,
        })

        if (approveReceipt.status === "success") {
          const txHash = await writeContractAsync({
            address: response.contractAddress,
            abi: AD_MANAGER_ABI,
            chainId: Number(response.chainId),
            functionName: "fundAd",
            args: [
              response.signature,
              response.authToken,
              BigInt(response.timeToExpire),
              response.adId,
              data.amountBigInt,
            ],
          })
          const receipt = await waitForTransactionReceipt(config, {
            hash: txHash,
          })

          if (receipt.status === "success") {
            await confirmAdTx({
              txHash: receipt.transactionHash,
              signature: response.signature,
              adId: response.adId,
            })
          }

          if (receipt.status === "reverted") {
            throw Error("Transaction failed, Retry")
          }
        }
        if (approveReceipt.status === "reverted") {
          throw Error("Transaction not approved")
        }
      }

      if (token.kind === "NATIVE") {
        const amount = formatUnits(
          BigInt(data.amountBigInt.toString()),
          token.decimals
        )
        const txHash = await writeContractAsync({
          address: response.contractAddress,
          abi: AD_MANAGER_ABI,
          chainId: Number(response.chainId),
          functionName: "fundAd",
          args: [
            response.signature,
            response.authToken,
            BigInt(response.timeToExpire),
            response.adId,
            data.amountBigInt,
          ],
          value: parseEther(amount),
        })
        const receipt = await waitForTransactionReceipt(config, {
          hash: txHash,
        })

        if (receipt.status === "success") {
          await confirmAdTx({
            txHash: receipt.transactionHash,
            signature: response.signature,
            adId: response.adId,
          })
        }

        if (receipt.status === "reverted") {
          throw Error("Transaction failed, Retry")
        }
      }
      return response
    },
    onSuccess: () => {
      toast.success("Ad top up was successful")
    },
    onError: function (error: any, variables, result, ctx) {
      toast.error(
        error.response.data.message || error.message || "Unable to top up ad",
        {
          description: "",
        }
      )
    },
  })
}

export const useWithdrawFunds = () => {
  const { writeContractAsync } = useWriteContract()

  return useMutation({
    mutationKey: ["withdraw-ad"],
    mutationFn: async (data: IWithdrawFromAdRequest) => {
      const response = await withdrawFromAd(data)

      const txHash = await writeContractAsync({
        address: response.contractAddress,
        abi: AD_MANAGER_ABI,
        chainId: Number(response.chainId),
        functionName: "withdrawFromAd",
        args: [
          response.signature,
          response.authToken,
          BigInt(response.timeToExpire),
          response.adId,
          data.amountBigInt,
          data.to,
        ],
      })
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      })

      if (receipt.status === "success") {
        await confirmAdTx({
          txHash: receipt.transactionHash,
          signature: response.signature,
          adId: response.adId,
        })
      }
      return response
    },
    onSuccess: () => {
      toast.success("Funds withdrawal was successful")
    },
    onError: function (error: any, variables, result, ctx) {
      toast.error(
        error.response.data.message || error.message || "Unable to withdraw",
        {
          description: "",
        }
      )
    },
  })
}

export const useCloseAd = () => {
  const { writeContractAsync } = useWriteContract()

  return useMutation({
    mutationKey: ["close-ad"],
    mutationFn: async (data: ICloseAdRequest) => {
      const response = await closeAd(data)

      const txHash = await writeContractAsync({
        address: response.contractAddress,
        abi: AD_MANAGER_ABI,
        chainId: Number(response.chainId),
        functionName: "closeAd",
        args: [
          response.signature,
          response.authToken,
          BigInt(response.timeToExpire),
          response.adId,
          data.to,
        ],
      })
      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      })

      if (receipt.status === "success") {
        await confirmAdTx({
          txHash: receipt.transactionHash,
          signature: response.signature,
          adId: response.adId,
        })
      }
      return response
    },
    onSuccess: () => {
      toast.success("Ad closed successfully")
    },
    onError: function (error: any, variables, result, ctx) {
      toast.error(
        error.response.data.message || error.message || "Unable to close ad",
        {
          description: "",
        }
      )
    },
  })
}

export const useConfirmAdTx = () => {
  return useMutation({
    mutationKey: ["confirm-ad-tx"],
    mutationFn: (data: IConfirmAdTxRequest) => {
      return confirmAdTx(data)
    },
    onSuccess: () => {
      toast.success("Tx confirmed successful")
    },
    onError: function (error: any, variables, result, ctx) {
      toast.error(
        error.response.data.message || error.message || "Unable to confirm ad",
        {
          description: "",
        }
      )
    },
  })
}

export const useGetAllAds = (params: IGetAdsParams) => {
  return useQuery({
    queryKey: ["get-all-ads", params],
    queryFn: () => getAllAds(params),
  })
}

export const useGetSingleAd = (id: string) => {
  return useQuery({
    queryKey: ["get-single-ad", id],
    queryFn: () => getSingleAd(id),
  })
}
