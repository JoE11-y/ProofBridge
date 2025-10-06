"use client"
import React from "react"
import { CiBadgeDollar } from "react-icons/ci"
import { RxDoubleArrowUp } from "react-icons/rx"
import { GiTrade } from "react-icons/gi"
import { TrendingUp } from "lucide-react"
import { IoReceiptOutline } from "react-icons/io5"
import { useGetAllAds } from "@/hooks/useAds"
import { useAccount } from "wagmi"
import { AdCard } from "@/components/dashboard/AdCard"
import { Tabs, TabsProps } from "antd"
import { SkeletonAdCard } from "@/components/dashboard/SkeletonAdCard"

const HomePage = () => {
  const account = useAccount()
  const { data: all_active_ads, isLoading: loadingActive } = useGetAllAds({
    status: "ACTIVE",
    creatorAddress: account.address!,
  })

  const { data: all_inactive_ads, isLoading: loadingInActive } = useGetAllAds({
    status: "PAUSED",
    creatorAddress: account.address!,
  })

  const { data: all_exhausted_ads, isLoading: loadingExhuasted } = useGetAllAds(
    {
      status: "EXHAUSTED",
      creatorAddress: account.address!,
    }
  )

  const { data: all_closed_ads, isLoading: loadingClosed } = useGetAllAds({
    status: "CLOSED",
    creatorAddress: account.address!,
  })

  const { data: all_ads, isLoading } = useGetAllAds({
    creatorAddress: account.address!,
    limit: 50,
  })

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All ads",
      children: (
        <div className="space-y-4 md:space-y-6">
          {isLoading ? (
            <>
              {Array.from([1, 2, 3]).map((value) => (
                <SkeletonAdCard key={value} />
              ))}
            </>
          ) : (
            <>
              {all_ads?.data?.map((ad) => {
                return <AdCard ad={ad} key={ad.id} />
              })}
            </>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Active",
      children: (
        <div className="space-y-4 md:space-y-6">
          {loadingActive ? (
            <>
              {Array.from([1, 2, 3]).map((value) => (
                <SkeletonAdCard key={value} />
              ))}
            </>
          ) : (
            <>
              {all_active_ads?.data?.map((ad) => {
                return <AdCard ad={ad} key={ad.id} />
              })}
            </>
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: "Inactive",
      children: (
        <div className="space-y-4 md:space-y-6">
          {loadingInActive ? (
            <>
              {Array.from([1, 2, 3]).map((value) => (
                <SkeletonAdCard key={value} />
              ))}
            </>
          ) : (
            <>
              {all_inactive_ads?.data?.map((ad) => {
                return <AdCard ad={ad} key={ad.id} />
              })}
            </>
          )}
        </div>
      ),
    },
    {
      key: "4",
      label: "Exhausted",
      children: (
        <div className="space-y-4 md:space-y-6">
          {loadingExhuasted ? (
            <>
              {Array.from([1, 2, 3]).map((value) => (
                <SkeletonAdCard key={value} />
              ))}
            </>
          ) : (
            <>
              {all_exhausted_ads?.data?.map((ad) => {
                return <AdCard ad={ad} key={ad.id} />
              })}
            </>
          )}
        </div>
      ),
    },
    {
      key: "5",
      label: "Closed",
      children: (
        <div className="space-y-4 md:space-y-6">
          {loadingClosed ? (
            <>
              {Array.from([1, 2, 3]).map((value) => (
                <SkeletonAdCard key={value} />
              ))}
            </>
          ) : (
            <>
              {all_closed_ads?.data?.map((ad) => {
                return <AdCard ad={ad} key={ad.id} />
              })}
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-[98%] mx-auto space-y-4 md:space-y-8 md:py-2 md:px-0 p-4">
      <div>
        <h2 className="md:text-4xl text-lg">Dashboard</h2>
        <p className="text-sm">Manage your ads and orders here</p>
      </div>
      <div className="grid md:grid-cols-4 grid-cols-2 md:gap-7 gap-4">
        <div className="border-grey-800 border-1 p-4 rounded-md w-full bg-gradient-to-bl from-grey-900 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <CiBadgeDollar size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">200.0 ETH</h3>
                <p className="text-sm">Trade Volume</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-grey-700 border-1 p-4 rounded-md w-full bg-gradient-to-tr from-grey-900 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <GiTrade size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {all_active_ads?.data?.length?.toLocaleString()}
                </h3>
                <p className="text-sm">Active ads</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-grey-800 border-1 p-4 rounded-md w-full bg-gradient-to-bl from-grey-900 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <IoReceiptOutline size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">15</h3>
                <p className="text-sm">Completed orders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-grey-700 border-1 p-4 rounded-md w-full bg-gradient-to-br from-grey-900 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <TrendingUp size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">{89.57}%</h3>
                <p className="text-sm">Avg. completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Tabs defaultActiveKey="1" items={items} type="line" size="large" />
      </div>
    </div>
  )
}

export default HomePage
