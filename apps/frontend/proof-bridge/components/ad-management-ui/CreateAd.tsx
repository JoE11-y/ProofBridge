"use client"
import React from "react"
import { Button, Tabs } from "antd"
import type { TabsProps } from "antd"
import { Info, ShieldAlert, Text } from "lucide-react"
import Image from "next/image"

const items: TabsProps["items"] = [
  {
    key: "1",
    label: (
      <div className="text-center md:text-sm text-xs">
        <p>I Want to Sell</p>
        <p>Add Liquidity for HBAR to bridge ETH</p>
      </div>
    ),
    children: (
      <div className="space-y-6">
        <div className="bg-grey-900 md:p-6 p-3 rounded-md space-y-4">
          <div className="flex items-center gap-4">
            <Text className="text-primary" />
            <p className="text-[16px] tracking-wider font-semibold">
              Trading Details
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <p className="text-grey-300"> Base Chain</p>
              <div className="flex gap-2 items-center">
                <Image
                  src={"/assets/logos/hbar.png"}
                  alt=""
                  height={40}
                  width={40}
                  className="rounded-full"
                />
                <p className="text-lg">Hedera Blockchain</p>
              </div>
            </div>

            <div>
              <p className="text-grey-300"> Destination Chain</p>
              <div className="flex gap-2 items-center">
                <Image
                  src={"/assets/logos/eth.svg"}
                  alt=""
                  height={30}
                  width={30}
                  className="rounded-full"
                />
                <p className="text-lg">Ethereum Blockchain</p>
              </div>
            </div>

            <div>
              <p className="text-grey-300">Price per Unit</p>
              <input
                className="w-full h-[40px] border-[1px]"
                placeholder="Amount"
              />
              <div className="text-xs text-grey-300 tracking-wider">
                Market: 0.0004 ETH
              </div>
            </div>

            <div>
              <p className="text-grey-300">Liquidity</p>
              <input
                className="w-full h-[40px] border-[1px]"
                placeholder="Amount"
              />
            </div>

            <div>
              <p className="text-grey-300">Minimum Order</p>
              <input
                className="w-full h-[40px] border-[1px]"
                placeholder="Amount"
              />
            </div>

            <div>
              <p className="text-grey-300">Maximum Order</p>
              <input
                className="w-full h-[40px] border-[1px]"
                placeholder="Amount"
              />
            </div>
          </div>
        </div>

        <div className="bg-grey-900 md:p-6 p-3 rounded-md space-y-4">
          <div className="flex items-center gap-4">
            <ShieldAlert className="text-amber-400" />
            <p className="text-[16px] tracking-wider font-semibold">
              Trading Terms
            </p>
          </div>

          <div>
            <textarea
              placeholder="Instructions"
              className="min-h-[130px] w-full border-[1px] border-grey-500 outline-0 p-3 rounded-md focus:border-primary"
            />
          </div>
        </div>

        <div className="bg-grey-900 md:p-6 p-3 rounded-md space-y-4">
          <div className="flex items-center gap-4">
            <p className="text-[16px] tracking-wider font-semibold">
              Ad Summary
            </p>
          </div>

          <div className="bg-grey-800 p-2 md:p-4 rounded-md tracking-wider">
            <div className="flex gap-2 items-center text-xs mb-1">
              <Info size={16} className="text-blue-500" />
              <p>What users will see</p>
            </div>
            <p>
              Your ad will appear as: sell ETH for HBAR with the information and
              trading terms specified above.
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="" type="primary" size="large">
            Publish Ad
          </Button>
        </div>
      </div>
    ),
  },
  {
    key: "2",
    label: (
      <div className="text-center md:text-sm text-xs">
        <p>I Want to Buy</p>
        <p>Add Liquidity for ETH to bridge HBAR</p>
      </div>
    ),
    children: (
      <div className="space-y-6">
        <div className="bg-grey-900 md:p-6 p-3 rounded-md space-y-4">
          <div className="flex items-center gap-4">
            <Text className="text-primary" />
            <p className="text-[16px] tracking-wider font-semibold">
              Trading Details
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <p className="text-grey-300"> Base Chain</p>
              <div className="flex gap-2 items-center">
                <Image
                  src={"/assets/logos/hbar.png"}
                  alt=""
                  height={40}
                  width={40}
                  className="rounded-full"
                />
                <p className="text-lg">Hedera Blockchain</p>
              </div>
            </div>

            <div>
              <p className="text-grey-300"> Destination Chain</p>
              <div className="flex gap-2 items-center">
                <Image
                  src={"/assets/logos/eth.svg"}
                  alt=""
                  height={30}
                  width={30}
                  className="rounded-full"
                />
                <p className="text-lg">Ethereum Blockchain</p>
              </div>
            </div>

            <div>
              <p className="text-grey-300">Price per Unit</p>
              <input
                className="w-full h-[40px] border-[1px]"
                placeholder="Amount"
              />
              <div className="text-xs text-grey-300 tracking-wider">
                Market: 0.0004 ETH
              </div>
            </div>

            <div>
              <p className="text-grey-300">Liquidity</p>
              <input
                className="w-full h-[40px] border-[1px]"
                placeholder="Amount"
              />
            </div>

            <div>
              <p className="text-grey-300">Minimum Order</p>
              <input
                className="w-full h-[40px] border-[1px]"
                placeholder="Amount"
              />
            </div>

            <div>
              <p className="text-grey-300">Maximum Order</p>
              <input
                className="w-full h-[40px] border-[1px]"
                placeholder="Amount"
              />
            </div>
          </div>
        </div>

        <div className="bg-grey-900 md:p-6 p-3 rounded-md space-y-4">
          <div className="flex items-center gap-4">
            <ShieldAlert className="text-amber-400" />
            <p className="text-[16px] tracking-wider font-semibold">
              Trading Terms
            </p>
          </div>

          <div>
            <textarea
              placeholder="Instructions"
              className="min-h-[130px] w-full border-[1px] border-grey-500 outline-0 p-3 rounded-md focus:border-primary"
            />
          </div>
        </div>

        <div className="bg-grey-900 md:p-6 p-3 rounded-md space-y-4">
          <div className="flex items-center gap-4">
            <p className="text-[16px] tracking-wider font-semibold">
              Ad Summary
            </p>
          </div>

          <div className="bg-grey-800 p-2 md:p-4 rounded-md tracking-wider">
            <div className="flex gap-2 items-center text-xs mb-1">
              <Info size={16} className="text-blue-500" />
              <p>What users will see</p>
            </div>
            <p>
              Your ad will appear as: buy HBAR for ETH with the information and
              trading terms specified above.
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="" type="primary" size="large">
            Publish Ad
          </Button>
        </div>
      </div>
    ),
  },
]

const CreateAd = () => {
  return (
    <div className="max-w-[800px] mx-auto py-4">
      <Tabs defaultActiveKey="1" items={items} centered />
    </div>
  )
}

export default CreateAd
