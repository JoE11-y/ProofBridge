"use client"

import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { api } from "@/services/api.instance"
import { urls } from "@/utils/urls"
import axios from "axios"
import { toast } from "sonner"

export interface FaucetRequest {
  tokenId: string
}

export interface FaucetResponse {
  txHash: string
  symbol: string
  chainId: string
  amount: string
}

const faucet_route = (path = "") => `${urls.API_URL}/v1/faucet${path}`

const requestFaucet = async (body: FaucetRequest): Promise<FaucetResponse> => {
  const resp = await api.post(faucet_route("/request"), body)
  return resp.data as FaucetResponse
}

/**
 * useFaucet hook
 * Usage:
 * const { mutateAsync, isLoading } = useFaucet({ onSuccess, onError })
 * await mutateAsync({ tokenId: "..." })
 */
export const useFaucet = () => {
  return useMutation({
    mutationFn: (payload: FaucetRequest) => requestFaucet(payload),
    onSuccess: () => {
      toast.success("Claim was successful")
    },
    onError: function (error: any, variables, result, ctx) {
      toast.error(
        error.response.data.message || error.message || "Unable to tokens",
        {
          description: "",
        }
      )
    },
  })
}

export default useFaucet
