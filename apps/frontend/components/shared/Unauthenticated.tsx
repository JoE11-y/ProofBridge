"use client"
import React from "react"
import { Wallet } from "lucide-react"
import { ConnectWalletButton } from "../connect-wallet/ConnectWalletButton"

interface UnauthenticatedProps {
  onConnect?: () => void
  className?: string
}

export const Unauthenticated: React.FC<UnauthenticatedProps> = ({
  onConnect,
  className = "",
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`max-w-xl h-[70vh] flex flex-col items-center justify-center mx-auto p-6 rounded-md bg-gradient-to-br  text-center ${className}`}
    >
      <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
        <Wallet size={36} />
      </div>

      <h3 className="text-2xl font-semibold mb-1">Connect your wallet</h3>
      <p className="text-sm text-grey-300 mb-6 max-w-[26rem] mx-auto">
        To access this area you need to connect your crypto wallet. Connect now
        to manage your ads and trades.
      </p>

      <div className="flex items-center justify-center gap-3">
        <ConnectWalletButton />
      </div>

      <p className="text-xs text-grey-500 mt-4">
        Supported: MetaMask, WalletConnect and other EVM wallets.
      </p>
    </div>
  )
}

export default Unauthenticated
