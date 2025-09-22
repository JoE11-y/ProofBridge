"use client"
import React, { useState } from "react"
import { SpecialButton } from "../ui/SpecialButton"
import { Connector, injected, useConnect } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export const ConnectWalletButton = () => {
  const { connect, connectors } = useConnect()
  return (
    <div>
      <ConnectButton></ConnectButton>
      {/* <SpecialButton
        onClick={() =>
          connect({
            connector: walletConnect({
              projectId: "b56e18d47c72ab683b10814fe9495694",
            }),
          })
        }
      >
        Connect Wallet
      </SpecialButton> */}
    </div>
  )
}
