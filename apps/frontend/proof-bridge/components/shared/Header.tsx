"use client"
import { Button } from "antd"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import React from "react"

export const Header = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-transparent text-white p-4 md:px-10 py-3 z-[50]">
      <div className="w-full flex items-center justify-between text-sm">
        <ul className="flex gap-4">
          <li>
            <Link href={""}>Docs</Link>
          </li>
          <li>
            <Link href={""}>Community</Link>
          </li>
          <li>
            <Link href={""}>Blog</Link>
          </li>
          <li>
            <Link href={""}>X/Twitter</Link>
          </li>
        </ul>

        <p className="text-xl">ProofBridge</p>
        <div>
          <Button
            className="!bg-white !text-black !h-[45px] md:w-[170px] !rounded-full !border-0 !text-[16px] !items-center !leading-0"
            iconPosition="end"
            icon={<ArrowRight size={18} />}
          >
            Launch app
          </Button>
        </div>
      </div>
    </div>
  )
}
