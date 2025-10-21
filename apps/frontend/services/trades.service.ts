import { urls } from "@/utils/urls"
import { api } from "./api.instance"
import {
  IConfirmTradeTxReponse,
  IConfirmTradeTxRequest,
  IConfirmUnlockFundsRequest,
  ICreateTradeRequest,
  ICreateTradeResponse,
  IGetTradesParams,
  ILockFundsReponse,
  ITrade,
  ITradeParams,
  IUnlockFundsRequest,
  IUnlockFundsResponse,
} from "@/types/trades"

const trades_route = (path = "") => {
  return `${urls.API_URL}/v1/trades${path}`
}

export const createTrade = async (data: ICreateTradeRequest) => {
  const response = await api.post(trades_route("/create"), data)
  return response.data as ICreateTradeResponse
}

export const lockFunds = async (id: string) => {
  const response = await api.post(trades_route(`/${id}/lock`))
  return response.data as ILockFundsReponse
}

export const unlockFunds = async ({ id, signature }: IUnlockFundsRequest) => {
  const response = await api.post(trades_route(`/${id}/unlock`), { signature })
  return response.data as IUnlockFundsResponse
}

export const confirmUnlockFunds = async ({
  id,
  signature,
  txHash,
}: IConfirmUnlockFundsRequest) => {
  const response = await api.post(trades_route(`/${id}/unlock/confirm`), {
    signature,
    txHash,
  })
  return response.data as IUnlockFundsResponse
}

export const confirmTradeTx = async (data: IConfirmTradeTxRequest) => {
  const { tradeId, ...rest } = data
  const response = await api.post(trades_route(`/${tradeId}/confirm`), {
    ...rest,
  })
  return response.data as IConfirmTradeTxReponse
}

export const getAllTrades = async (params: IGetTradesParams) => {
  const response = await api.get(trades_route("/all"), { params })
  return response.data as {
    data: ITrade[]
    nextCursor: string
  }
}

export const getSingleTrade = async (id: string) => {
  const response = await api.get(trades_route(`/${id}`))
  return response.data as ITrade
}

export const getTradeParams = async (id: string) => {
  const response = await api.get(trades_route(`/${id}/params`))
  return response.data as ITradeParams
}
