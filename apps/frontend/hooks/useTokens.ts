import { getTokens } from "@/services/tokens.service"
import { IGetTokensParams } from "@/types/tokens"
import { useQuery } from "@tanstack/react-query"

export const useGetAllTokens = (params?: IGetTokensParams) => {
  return useQuery({
    queryKey: ["tokens", params],
    queryFn: () => getTokens(params),
  })
}
