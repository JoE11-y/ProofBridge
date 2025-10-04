"use client"
import React from "react"
import { Button, Tabs } from "antd"
import type { TabsProps } from "antd"
import { AddLiquidity } from "./AddLiquidity"
import { hederaTestnet, sepolia } from "viem/chains"

const items: TabsProps["items"] = [
  {
    key: "1",
    label: (
      <div className="text-center md:text-sm text-xs">
        <p>Add Liquidity for HBAR to bridge ETH</p>
      </div>
    ),
    children: (
      <AddLiquidity liquidity_chain={hederaTestnet} other_chain={sepolia} />
    ),
  },
  {
    key: "2",
    label: (
      <div className="text-center md:text-sm text-xs">
        <p>Add Liquidity for ETH to bridge HBAR</p>
      </div>
    ),
    children: (
      <AddLiquidity liquidity_chain={sepolia} other_chain={hederaTestnet} />
    ),
  },
]

const CreateAd = () => {
  return (
    <div className="max-w-[600px] mx-auto py-4">
      <Tabs defaultActiveKey="1" items={items} centered />
    </div>
  )
}

export default CreateAd
