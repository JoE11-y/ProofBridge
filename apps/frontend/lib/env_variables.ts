"use server"

export type env_vars_keys = "WALLET_CONNECT_PROJECT_ID"

export const client_get_env_variables = async (): Promise<
  Record<env_vars_keys, string>
> => {
  return {
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID!,
  }
}
