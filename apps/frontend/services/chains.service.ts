import { urls } from "@/utils/urls"
import { api } from "./api.instance"
import { IChain } from "@/types/chains"

const chains_route = (path = "") => {
  return `${urls.API_URL}/v1/chains${path}`
}

export const getChains = async (params: {
  limit?: string
  cursor?: string
}) => {
  const response = await api.get(chains_route("/"), { params })
  return response.data as { rows: IChain[]; nextCursor: string }
}

export const getSingleChain = async (id: string) => {
  const response = await api.get(chains_route(`/${id}`))
  return response.data as IChain
}
