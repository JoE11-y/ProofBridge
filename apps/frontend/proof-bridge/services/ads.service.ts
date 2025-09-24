import { urls } from "@/utils/urls"
import { api } from "./api.instance"
import { ICreateAdRequest } from "@/types/ads"

const ads_route = (path = "") => {
  return `${urls.API_URL}/v1/ads${path}`
}

export const createAd = async (data: ICreateAdRequest) => {
  const response = await api.post(ads_route("/create"), data)
  return response.data
}
