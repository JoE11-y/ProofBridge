import { AD_MANAGER_ABI } from "@/abis/AdManager.abi"
import { ERC20_ABI } from "@/abis/ERC20.abi"
import {
  confirmAdTx,
  createAd,
  fundAd,
  getAllAds,
  getSingleAd,
} from "@/services/ads.service"
import {
  IConfirmAdTxRequest,
  ICreateAdRequest,
  IGetAdsParams,
  ITopUpAdRequest,
} from "@/types/ads"
import { config } from "@/utils/wagmi-config"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { parseUnits } from "viem"
import { useAccount, useWriteContract } from "wagmi"
import { waitForTransactionReceipt } from "wagmi/actions"
import { hederaTestnet, sepolia } from "viem/chains"
import { getTokens } from "@/services/tokens.service"
const contractAddresses: Record<number, string> = {
  [hederaTestnet.id]: "",
  [sepolia.id]: "",
}

export const useCreateAd = () => {
  const { writeContractAsync } = useWriteContract()
  return useMutation({
    mutationKey: ["create-ad"],
    mutationFn: async (data: ICreateAdRequest) => {
      const response = await createAd(data)
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
          BigInt(response.orderChainId),
          response.adRecipient,
        ],
      })
      const receipt = await waitForTransactionReceipt(config, { hash: txHash })

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
      const token = await getTokens({ chainId: String(response.chainId!) })
      const approveHash = await writeContractAsync({
        address: token.data[0].address,
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
