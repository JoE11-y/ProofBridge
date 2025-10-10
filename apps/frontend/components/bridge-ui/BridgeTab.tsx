"use client"
import React, { useEffect, useState } from "react"
import { Alert, Avatar, Button, Divider, Input, Skeleton, Tooltip } from "antd"
import { Bot, Clock, Rabbit, Verified } from "lucide-react"
import Image from "next/image"
import { TradeAd } from "./TradeAd"
import { SellAd } from "./SellAdd"
import { useGetAllChains } from "@/hooks/useChains"
import { IChain } from "@/types/chains"
import { useGetAllTokens } from "@/hooks/useTokens"
import { useGetAllAds } from "@/hooks/useAds"
import { GiChainLightning } from "react-icons/gi"
import SkeletonTradeAd from "./SkeletonTradeAd"

export const BridgeTab = () => {
  const [tabKey, setTabKey] = useState<"buy" | "sell">("buy")
  const { data: chains, isLoading: loadingChains } = useGetAllChains({})

  const [selectedChainId, setSelectedChainId] = useState<string>("")
  const [selectedTokenId, setSelectedTokenId] = useState<string>("")

  const { data: tokens, isLoading: loadingTokens } = useGetAllTokens({
    chainId: selectedChainId,
  })

  const { data: Ads, isLoading: loadingAds } = useGetAllAds({
    limit: 20,
    status: "ACTIVE",
    adChainId: selectedChainId,
  })
  useEffect(() => {
    if (chains?.rows.length) {
      setSelectedChainId(chains.rows[0].chainId)
    }
  }, [chains])

  useEffect(() => {
    if (tokens?.data.length) {
      setSelectedTokenId(tokens.data[0].id)
    }
  }, [tokens])
  return (
    <div className="w-full bg-grey-900 p-4 md:p-6 rounded-md space-y-4 md:space-y-6 tracking-wider">
      <div className="">
        <div className="flex items-center gap-2 mb-2">
          <GiChainLightning />
          <p>Chains</p>
        </div>
        <div className="flex md:flex-row flex-col md:items-center gap-4">
          <div className="inline-flex items-center gap-1 bg-grey-800 p-1 rounded-sm w-fit">
            {loadingChains ? (
              <>
                <Skeleton.Button active={true} />
                <Skeleton.Button active={true} />
              </>
            ) : (
              <>
                {chains?.rows?.map((chain) => {
                  return (
                    <Button
                      key={chain.chainId}
                      className=" !h-[35px]"
                      type={
                        selectedChainId === chain.chainId ? "primary" : "text"
                      }
                      onClick={() => setSelectedChainId(chain.chainId)}
                    >
                      {chain.name}
                    </Button>
                  )
                })}
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {loadingTokens ? (
              <Skeleton.Button active={true} />
            ) : (
              <>
                {tokens?.data?.map((token, index) => {
                  const isActive = selectedTokenId === token.id
                  return (
                    <p
                      key={index}
                      className={`${
                        isActive ? "text-primary" : ""
                      } cursor-pointer`}
                      onClick={() => setSelectedTokenId(token.id)}
                    >
                      {token.name}
                    </p>
                  )
                })}
              </>
            )}
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
        <p>Cross chain</p>
        <p>Available | Limits</p>
        <p>Date posted</p>
        <div>
          <Alert
            message={<p className="text-xs">0 Transaction fees</p>}
            type="warning"
          />
        </div>
      </div>

      <div className="space-y-6">
        {loadingAds ? (
          <>
            {[1, 2, 3, 4, 5].map((value) => {
              return <SkeletonTradeAd key={value} />
            })}
          </>
        ) : (
          <>
            {Ads?.data?.map((ad, index) => (
              <TradeAd key={index} {...ad} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
