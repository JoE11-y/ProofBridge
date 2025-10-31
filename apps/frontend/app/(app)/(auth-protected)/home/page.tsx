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
import AdsEmptyState from "@/components/dashboard/AdsEmptyState"
import { useGetAllTrades } from "@/hooks/useTrades"

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
          ) : all_ads?.data?.length === 0 ? (
            <AdsEmptyState
              title="No ads found"
              message="You haven't created any ads yet."
              primaryLabel="Refresh"
              onPrimaryClick={() => window.location.reload()}
            />
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
          ) : all_active_ads?.data?.length === 0 ? (
            <AdsEmptyState
              title="No active ads"
              message="You don't have any active ads right now."
              primaryLabel="Refresh"
              onPrimaryClick={() => window.location.reload()}
            />
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
          ) : all_inactive_ads?.data?.length === 0 ? (
            <AdsEmptyState
              title="No inactive ads"
              message="You have no paused or inactive ads."
              primaryLabel="Refresh"
              onPrimaryClick={() => window.location.reload()}
            />
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
          ) : all_exhausted_ads?.data?.length === 0 ? (
            <AdsEmptyState
              title="No exhausted ads"
              message="There are no ads that have been exhausted."
              primaryLabel="Refresh"
              onPrimaryClick={() => window.location.reload()}
            />
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
          ) : all_closed_ads?.data?.length === 0 ? (
            <AdsEmptyState
              title="No closed ads"
              message="You have no closed ads."
              primaryLabel="Refresh"
              onPrimaryClick={() => window.location.reload()}
            />
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

  const { data: trades } = useGetAllTrades({
    adCreatorAddress: account.address,
    bridgerAddress: account.address,
  })

  return (
    <div className="max-w-[98%] mx-auto space-y-4 md:space-y-8 md:py-2 md:px-0 p-4">
      <div>
        <h2 className="md:text-4xl text-lg">Dashboard</h2>
        <p className="text-sm">Manage your ads and orders here</p>
      </div>
      <div className="grid md:grid-cols-4 grid-cols-2 md:gap-7 gap-4">
        <div className="border-grey-700 border-1 p-4 rounded-md w-full bg-gradient-to-bl from-grey-600 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <GiTrade size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {all_active_ads?.data?.length?.toLocaleString() || 0}
                </h3>
                <p className="text-sm">Active ads</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-grey-800 border-1 p-4 rounded-md w-full bg-gradient-to-tr from-grey-600 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <CiBadgeDollar size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {trades?.data?.length || 0}
                </h3>
                <p className="text-sm">Total trades</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-grey-800 border-1 p-4 rounded-md w-full bg-gradient-to-bl from-grey-600 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <IoReceiptOutline size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {" "}
                  {trades?.data?.filter((trade) => trade.status === "LOCKED")
                    ?.length || 0}
                </h3>
                <p className="text-sm">Completed orders</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-grey-700 border-1 p-4 rounded-md w-full bg-gradient-to-br from-grey-600 to-grey-1000">
          <div className="flex justify-center flex-col gap-2 md:h-[150px] h-[100px] w-full">
            <div className="space-y-2">
              <div className="flex w-full justify-between items-center gap-2">
                <TrendingUp size={24} />
                <RxDoubleArrowUp className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {(
                    (Number(
                      trades?.data?.filter((trade) => trade.status === "LOCKED")
                        ?.length
                    ) /
                      Number(trades?.data?.length)) *
                      100 || 0
                  ).toFixed(2)}
                  %
                </h3>
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
