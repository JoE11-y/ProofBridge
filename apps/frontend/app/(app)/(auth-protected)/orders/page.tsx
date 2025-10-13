import React from "react"
import { CiBadgeDollar } from "react-icons/ci"
import { RxDoubleArrowUp } from "react-icons/rx"
import { GiTrade } from "react-icons/gi"
import { TrendingUp } from "lucide-react"
import { IoReceiptOutline } from "react-icons/io5"
import { OrdersTable } from "@/components/orders/OrdersTable"
import { Tabs, TabsProps } from "antd"

const OrdersPage = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Incoming Orders",
      children: <OrdersTable type="incoming" />,
    },

    {
      key: "2",
      label: "Outgoing Orders",
      children: <OrdersTable type="outgoing" />,
    },
  ]
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
                <h3 className="text-xl md:text-2xl font-semibold">200.0 ETH</h3>
                <p className="text-sm ">Trade Volume</p>
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
                <h3 className="text-xl md:text-2xl font-semibold">20</h3>
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
                <h3 className="text-xl md:text-2xl font-semibold">15</h3>
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
                <h3 className="text-xl md:text-2xl font-semibold">{89.57}%</h3>
                <p className="text-sm ">Avg. completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Tabs defaultActiveKey="1" items={items} type="line" />
      </div>
    </div>
  )
}

export default OrdersPage
