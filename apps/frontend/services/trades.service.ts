import { urls } from "@/utils/urls"
import { api } from "./api.instance"
import {
  IConfirmTradeTxReponse,
  IConfirmTradeTxRequest,
  ICreateTradeRequest,
  ICreateTradeResponse,
  IGetTradesParams,
  ITrade,
} from "@/types/trades"

const trades_route = (path = "") => {
  return `${urls.API_URL}/v1/trades${path}`
}

export const createTrade = async (data: ICreateTradeRequest) => {
  const response = await api.post(trades_route("/create"), data)
  return response.data as ICreateTradeResponse
}

export const confirmTradeTx = async (data: IConfirmTradeTxRequest) => {
  const { tradeId, ...rest } = data
  const response = await api.post(trades_route(`/${tradeId}/confirm`), {
    ...rest,
  })
  return response.data as IConfirmTradeTxReponse
}

export const getAllTrades = async (params: IGetTradesParams) => {
  const response = await api.get(trades_route(), { params })
  return response.data as {
    data: ITrade[]
    nextCursor: string
  }
}

export const getSingleTrade = async (id: string) => {
  const response = await api.get(trades_route(`/${id}`))
  return response.data as ITrade
}
