import Image from "next/image"
import React from "react"

export const Logo = ({ width = 35.06, height = 25.65 }) => {
  return (
    <Image
      src={"/logo.svg"}
      alt="Proof Bridge Logo"
      height={height}
      width={width}
    />
  )
}
