import { urls } from "@/utils/urls"
import { api } from "./api.instance"
import { IGetTokensParams, IToken } from "@/types/tokens"

const tokens_route = (path = "") => {
  return `${urls.API_URL}/v1/tokens${path}`
}

export const getTokens = async (params: IGetTokensParams) => {
  const response = await api.get(tokens_route("/"), { params })
  return response.data as { data: IToken[]; nextCursor: string }
}

export const getSingleToken = async (id: string) => {
  const response = await api.get(tokens_route(`/${id}`))
  return response.data as IToken
}
