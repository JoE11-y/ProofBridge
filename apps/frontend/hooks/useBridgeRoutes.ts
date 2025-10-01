import { getRoutes } from "@/services/routes.service"
import { IGetRoutesParams } from "@/types/routes"
import { useQuery } from "@tanstack/react-query"

export const useGetBridgeRoutes = (params: IGetRoutesParams) => {
  return useQuery({
    queryKey: ["bridge-routes", params],
    queryFn: () => getRoutes(params),
  })
}
