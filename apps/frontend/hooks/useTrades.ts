import { ORDER_PORTAL_ABI } from "@/abis/orderPortal.abi"
import { chains } from "@/lib/chains"
import {
  confirmTradeTx,
  createTrade,
  getAllTrades,
} from "@/services/trades.service"
import { ICreateTradeRequest, IGetTradesParams } from "@/types/trades"
import { config } from "@/utils/wagmi-config"
import { useMutation, useQuery } from "@tanstack/react-query"
import { parseUnits } from "viem"
import { waitForTransactionReceipt } from "wagmi/actions"
import { useAccount, useWriteContract } from "wagmi"
import { toast } from "sonner"
import { ERC20_ABI } from "@/abis/ERC20.abi"
import { getSingleToken, getTokens } from "@/services/tokens.service"

export const useCreateTrade = () => {
  const account = useAccount()
  const { writeContractAsync } = useWriteContract()
  return useMutation({
    mutationKey: ["create-trade"],
    mutationFn: async (data: ICreateTradeRequest) => {
      const response = await createTrade(data)
      const token = await getTokens({
        // address: response.reqContractDetails.orderParams.orderChainToken,
        chainId: response.reqContractDetails.chainId,
      })

      const approveHash = await writeContractAsync({
        address: response.reqContractDetails.orderParams.orderChainToken,
        abi: ERC20_ABI,
        chainId: Number(token.data[0].chain.chainId),
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
              adRecipient: response.reqContractDetails.orderParams.adRecipient,
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

export const useGetAllTrades = (params: IGetTradesParams) => {
  return useQuery({
    queryKey: ["trades", params],
    queryFn: () => getAllTrades(params),
  })
}
