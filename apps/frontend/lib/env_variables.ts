"use server"

export type env_vars_keys =
  | "WALLET_CONNECT_PROJECT_ID"
  | "NEXT_PUBLIC_SIGN_DOMAIN"
  | "NEXT_PUBLIC_SIGN_URI"

export const client_get_env_variables = async (): Promise<
  Record<env_vars_keys, string>
> => {
  return {
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID!,
    NEXT_PUBLIC_SIGN_DOMAIN: process.env.WALLET_CONNECT_PROJECT_ID!,
    NEXT_PUBLIC_SIGN_URI: process.env.NEXT_PUBLIC_SIGN_URI!,
  }
}
