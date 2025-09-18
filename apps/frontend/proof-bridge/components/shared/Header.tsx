import React from "react"
import { Logo } from "./Logo"
import Link from "next/link"
import { SpecialButton } from "../ui/SpecialButton"

export const Header = () => {
  return (
    <header className="h-[70px] flex items-center justify-center to-grey-1000/40 from-grey-900/40 backdrop-blur-2xl bg-gradient-to-l fixed top-0 left-0 w-full z-[20] border-b border-b-grey-800">
      <div className="px-4 md:px-8 flex items-center justify-between w-full">
        <div className="flex items-baseline gap-2">
          <Logo />
          <p className="text-sm from-primary to-amber-400 bg-gradient-to-r text-transparent bg-clip-text md:block hidden">
            ProofBridge
          </p>
        </div>
        <div className="flex items-center justify-between text-sm gap-5">
          <Link href={"/"} className="hidden md:inline">
            Docs
          </Link>
          <Link href={"/"} className="hidden md:inline">
            Bridge
          </Link>
          <SpecialButton>Connect Wallet</SpecialButton>
        </div>
      </div>
    </header>
  )
}
