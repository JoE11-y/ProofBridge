"use client"
import {
  createAuthenticationAdapter,
  darkTheme,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import React, { useMemo } from "react"
import { SiweMessage } from "siwe"
import { useAccount } from "wagmi"
import Cookies from "js-cookie"

function useAuthenticationAdapter() {
  // If the user is logged in but the account is different (e.g. they changed account in Metamask), log them out and reload the page.
  const account = useAccount()

  return useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const res = await fetch(
          "https://proofbridge.onrender.com/v1/auth/challenge",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address: account.address,
            }),
          }
        )
        const data = await res.json()
        return data.nonce
      },
      createMessage: ({ nonce, address, chainId }) => {
        return new SiweMessage({
          domain: "proofbridge.xyz",
          address,
          statement: "Sign in with Ethereum to the app.",
          uri: "https://proofbridge.xyz",
          version: "1",
          chainId,
          nonce,
        }).prepareMessage()
      },

      verify: async ({ message, signature }) => {
        const loginRes = await fetch(
          "https://proofbridge.onrender.com/v1/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, signature }),
          }
        )
        const data = await loginRes.json()
        Cookies.set("auth_token", data.tokens.access)
        Cookies.set("refresh_token", data.tokens.refresh)
        window.location.reload()
        return Boolean(loginRes.ok)
      },
      signOut: async () => {
        // await fetch("/api/logout")
        Cookies.remove("auth_token")
        Cookies.remove("refresh_token")
        window.location.reload()
      },
    })
  }, [account])
}

export const RainbowKit = ({ children }: { children: React.ReactNode }) => {
  const adapter = useAuthenticationAdapter()
  const token = Cookies.get("auth_token")

  return (
    <RainbowKitAuthenticationProvider
      adapter={adapter}
      status={token ? "authenticated" : "unauthenticated"}
    >
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#c3ff49",
          accentColorForeground: "#000",
        })}
      >
        {children}
      </RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  )
}
