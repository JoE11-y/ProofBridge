"use client"
import React, { useState } from "react"
import { Button, Divider, Input, Tooltip } from "antd"
import { Bot, Rabbit } from "lucide-react"
import Image from "next/image"

const chainsToken = ["HBAR", "ETH", "SOL", "BNB"]

export const BridgeTab = () => {
  const [tabKey, setTabKey] = useState<"buy" | "sell">("buy")
  return (
    <div className="w-full bg-grey-900 p-4 md:p-6 rounded-md space-y-4 md:space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-grey-800 p-1 rounded-sm">
          <Button
            className=" !h-[35px] !w-[75px]"
            type={tabKey === "buy" ? "primary" : "text"}
            onClick={() => setTabKey("buy")}
          >
            Buy
          </Button>
          <Button
            danger={tabKey === "sell"}
            className=" !h-[35px] !w-[75px]"
            type={tabKey === "sell" ? "primary" : "text"}
            onClick={() => setTabKey("sell")}
          >
            Sell
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {chainsToken.map((token, index) => {
            const isActive = index === 0
            return (
              <p
                key={index}
                className={`${isActive ? "text-primary" : ""} cursor-pointer`}
              >
                {token}
              </p>
            )
          })}
          <Divider type="vertical" className="!h-[25px] !my-0 !py-0" />
          <div className="flex items-center gap-2">
            <p className=" text-amber-200">Other chains coming soon.</p>
            <Rabbit className="text-amber-400" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Enter amount"
            className="!border-0 h-[40px] !bg-grey-1000/50 !w-[200px]"
            suffix={
              <Image
                src={"/assets/logos/eth.png"}
                height={20}
                width={20}
                alt="ETH Logo"
              />
            }
          />
          <Input
            placeholder="Search seller"
            className="!border-0 h-[40px] !bg-grey-1000/50 !w-[200px]"
          />
        </div>

        <Tooltip
          showArrow
          title={"AI assistant coming soon."}
          open
          placement="left"
          color="magenta"
        >
          <Bot size={30} className="text-primary" />
        </Tooltip>
      </div>

      <Divider className="!border-grey-800" />
    </div>
  )
}
