"use client"
import { getAllChains } from "@/services/chains.service"
import { useQuery } from "@tanstack/react-query"

export const useGetAllChains = (params: {
  limit?: number
  cursor?: string
}) => {
  return useQuery({
    queryKey: ["all-chains", params],
    queryFn: () => getAllChains(params),
  })
}
