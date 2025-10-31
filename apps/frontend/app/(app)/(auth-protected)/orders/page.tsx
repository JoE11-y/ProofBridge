"use client"
import React, { useState } from "react"
import { CiBadgeDollar } from "react-icons/ci"
import { RxDoubleArrowUp } from "react-icons/rx"
import { GiTrade } from "react-icons/gi"
import { TrendingUp } from "lucide-react"
import { IoReceiptOutline } from "react-icons/io5"
import { OrdersTable } from "@/components/orders/OrdersTable"
import { Tabs, TabsProps } from "antd"
import { useGetAllTrades } from "@/hooks/useTrades"
import { useAccount } from "wagmi"

const OrdersPage = () => {
  const [type, setType] = useState<"incoming" | "outgoing">("incoming")
  const items: TabsProps["items"] = [
    {
      key: "incoming",
      label: "Incoming Orders",
      children: <OrdersTable type="incoming" />,
    },

    {
      key: "outgoing",
      label: "Outgoing Orders",
      children: <OrdersTable type="outgoing" />,
    },
  ]

  const account = useAccount()

  const { data: trades } = useGetAllTrades({
    adCreatorAddress: type === "incoming" ? account.address : undefined,
    bridgerAddress: type === "outgoing" ? account.address : undefined,
  })
  return (
    <div className="max-w-[98%] mx-auto space-y-4 md:space-y-8 md:py-2 md:px-0 p-4">
      <div>
        <h2 className="md:text-4xl text-lg">Orders</h2>
        <p className="text-sm">View and Manage your orders here</p>
      </div>
      <div className="grid md:grid-cols-4 grid-cols-2 md:gap-7 gap-4 text-white">
        <div className="border-grey-800 border-1 p-4 rounded-md w-full bg-gradient-to-bl from-primary/20 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <CiBadgeDollar size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {trades?.data?.length}
                </h3>
                <p className="text-sm ">Total trades</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-grey-700 border-1 p-4 rounded-md w-full bg-gradient-to-tr from-primary/20 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <GiTrade size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {" "}
                  {
                    trades?.data?.filter((trade) => trade.status === "INACTIVE")
                      ?.length
                  }
                </h3>
                <p className="text-sm ">Pending Orders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-grey-800 border-1 p-4 rounded-md w-full bg-gradient-to-bl from-primary/20 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <IoReceiptOutline size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {" "}
                  {
                    trades?.data?.filter((trade) => trade.status === "LOCKED")
                      ?.length
                  }
                </h3>
                <p className="text-sm ">Completed orders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-grey-700 border-1 p-4 rounded-md w-full bg-gradient-to-br from-primary/20 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <TrendingUp size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {(Number(
                    trades?.data?.filter((trade) => trade.status === "LOCKED")
                      ?.length
                  ) /
                    Number(trades?.data?.length)) *
                    100 || 0}
                  %
                </h3>
                <p className="text-sm ">Avg. completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Tabs
          defaultActiveKey={"incoming"}
          items={items}
          type="line"
          onChange={(activeKey: any) => setType(activeKey)}
        />
      </div>
    </div>
  )
}

export default OrdersPage
