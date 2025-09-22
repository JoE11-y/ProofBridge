"use client"
import { config } from "@/utils/wagmi-config"
import React from "react"
import { WagmiProvider } from "wagmi"

export const Wagmi = ({ children }: { children?: React.ReactNode }) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>
}
