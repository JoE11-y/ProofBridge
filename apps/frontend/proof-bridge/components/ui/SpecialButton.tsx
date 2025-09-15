"use client"
import Link from "next/link"
import React, { ReactNode } from "react"

export const SpecialButton = ({
  children,
  icon,
}: {
  children: ReactNode
  icon?: ReactNode
}) => {
  return (
    <div className="relative cursor-pointer">
      <div className="absolute top-0 left-0 h-[45px] w-[45px] rounded-full bg-primary text-black text-sm cursor-pointer items-center justify-center flex">
        {icon}
      </div>
      <button className="min-w-[150px] h-[45px] bg-primary inline-flex items-center justify-center text-black rounded-full ml-[40px] cursor-pointer gap-2">
        {children}
      </button>
    </div>
  )
}
