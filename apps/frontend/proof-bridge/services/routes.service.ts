import { urls } from "@/utils/urls"
import { api } from "./api.instance"
import { IGetRoutesParams, IRoute } from "@/types/routes"

const routes_route = (path = "") => {
  return `${urls.API_URL}/v1/routes${path}`
}

export const getRoutes = async (params: IGetRoutesParams) => {
  const response = await api.get(routes_route("/"), { params })
  return response.data as { data: IRoute[]; nextCursor: string }
}

export const getSingleRoute = async (id: string) => {
  const response = await api.get(routes_route(`/${id}`))
  return response.data as IRoute
}
