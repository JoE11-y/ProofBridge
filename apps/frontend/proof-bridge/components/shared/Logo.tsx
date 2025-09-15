import Image from "next/image"
import React from "react"

export const Logo = () => {
  return (
    <Image
      src={"/logo.svg"}
      alt="Proof Bridge Logo"
      height={25.65}
      width={35.06}
    ></Image>
  )
}
