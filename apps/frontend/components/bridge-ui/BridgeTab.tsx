"use client"
import React, { useState } from "react"
import { Alert, Avatar, Button, Divider, Input, Tooltip } from "antd"
import { Bot, Clock, Rabbit, Verified } from "lucide-react"
import Image from "next/image"
import { BuyAd } from "./BuyAd"
import { SellAd } from "./SellAdd"

const advertiser_terms = `⚠️ Warning: I'm fully active, do not be tempted to click
                  ''Payment Completed'' box unless you have successfully
                  completed the payment. Doing so may lead to disputes or
                  account restrictions." -Leave an active phone number -And
                  don't forget to leave a positive review please, I'll do same
                  for you.🙏🙏🙏`

const chainsToken = ["HBAR", "ETH", "SOL", "BNB"]

export const BridgeTab = () => {
  const [tabKey, setTabKey] = useState<"buy" | "sell">("buy")

  // dummy ads array that will be rendered via BuyAd
  const dummyAds = [
    {
      ad_id: "1",
      full_name: "Chief Daddy",
      total_orders: 62,
      orders_completion_rate: "96%",
      avg_order_completion_time: "15min(s)",
      token: "ETH",
      price: "0.3382",
      available_tokens: "182.37 HBAR",
      limit: "0.16534 ~ 0.33822 ETH",
      date_posted: { date: "Sept 13, 2025,", time: "10:30pm" },
      advertiser_terms,
    },
    {
      ad_id: "2",
      full_name: "Ayomide Damilola",
      total_orders: 48,
      orders_completion_rate: "98%",
      avg_order_completion_time: "10min(s)",
      token: "ETH",
      price: "0.3421",
      available_tokens: "120.00 HBAR",
      limit: "0.17000 ~ 0.34210 ETH",
      date_posted: { date: "Sept 12, 2025,", time: "8:15pm" },
      advertiser_terms,
    },
    {
      ad_id: "3",
      full_name: "Odogwu Exchange",
      total_orders: 140,
      orders_completion_rate: "99%",
      avg_order_completion_time: "5min(s)",
      token: "ETH",
      price: "0.3300",
      available_tokens: "500.00 HBAR",
      limit: "0.10000 ~ 0.33000 ETH",
      date_posted: { date: "Sept 10, 2025,", time: "3:45pm" },
      advertiser_terms,
    },
  ]
  return (
    <div className="w-full bg-grey-900 p-4 md:p-6 rounded-md space-y-4 md:space-y-6 tracking-wider">
      <div className="flex md:flex-row flex-col md:items-center gap-4">
        <div className="inline-flex items-center gap-1 bg-grey-800 p-1 rounded-sm w-fit">
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
          <Divider
            type="vertical"
            className="!h-[25px] !my-0 !py-0 md:!block !hidden"
          />
          <div className="md:flex items-center gap-2 hidden">
            <p className=" text-amber-200">Other chains coming soon.</p>
            <Rabbit className="text-amber-400" />
          </div>
        </div>
      </div>

      <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-3">
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

      <div className="hidden md:grid [grid-template-columns:2fr_1fr_2fr_1fr_1fr] gap-7 items-center text-grey-400 text-sm font-semibold border-y-1 border-y-grey-800 py-2">
        <p>Advertiser</p>
        <p>Price</p>
        <p>Availblae | Limits</p>
        <p>Date posted</p>
        <div>
          <Alert
            message={<p className="text-xs">0 Transaction fees</p>}
            type="warning"
          />
        </div>
      </div>

      {/* BUY and SELL ADS DUMMY DATA */}

      {tabKey === "buy" ? (
        <div className="space-y-4 md:space-y-10">
          {[...dummyAds, ...dummyAds].map((ad, index) => (
            <BuyAd
              key={index}
              ad_id={ad.ad_id}
              full_name={ad.full_name}
              total_orders={ad.total_orders}
              orders_completion_rate={ad.orders_completion_rate}
              avg_order_completion_time={ad.avg_order_completion_time}
              token={ad.token}
              price={ad.price}
              available_tokens={ad.available_tokens}
              limit={ad.limit}
              date_posted={ad.date_posted}
              advertiser_terms={ad.advertiser_terms}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4 md:space-y-10">
          {[...dummyAds.reverse(), ...dummyAds].map((ad, index) => (
            <SellAd
              key={index}
              ad_id={ad.ad_id}
              full_name={ad.full_name}
              total_orders={ad.total_orders}
              orders_completion_rate={ad.orders_completion_rate}
              avg_order_completion_time={ad.avg_order_completion_time}
              token={ad.token}
              price={ad.price}
              available_tokens={ad.available_tokens}
              limit={ad.limit}
              date_posted={ad.date_posted}
              advertiser_terms={advertiser_terms}
            />
          ))}
        </div>
      )}
    </div>
  )
}
