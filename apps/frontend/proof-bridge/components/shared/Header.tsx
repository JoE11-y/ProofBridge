import React from "react"
import { Logo } from "./Logo"
import Link from "next/link"
import { SpecialButton } from "../ui/SpecialButton"

export const Header = () => {
  return (
    <header className="p-4 md:p-8 md:py-3 flex items-center justify-between w-full to-grey-1000 from-grey-900 bg-gradient-to-r">
      <Logo />
      <div className="flex items-center justify-between text-sm gap-5">
        <Link href={"/"}>Docs</Link>
        <Link href={"/"}>Bridge</Link>
        <SpecialButton>Connect Wallet</SpecialButton>
      </div>
    </header>
  )
}
