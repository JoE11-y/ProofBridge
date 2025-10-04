"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "antd"

export const GoBack = () => {
  const { back } = useRouter()
  return (
    <Button
      className="gap-2 my-1 text-sm cursor-pointer !h-[40px]"
      onClick={back}
      type="text"
    >
      <ArrowLeft size={20} />
      <span>Go Back</span>
    </Button>
  )
}
