"use client"

import React, { useState } from "react"
import { Button, Modal, Table } from "antd"
import type { TableColumnsType, TableProps } from "antd"
import { ITrade } from "@/types/trades"
import { useGetAllTrades, useLockFunds } from "@/hooks/useTrades"
import { useAccount } from "wagmi"
import { truncateString } from "@/utils/truncate-string"
import { Status } from "../shared/Status"
import moment from "moment"
import { formatUnits } from "viem"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { chains } from "@/lib/chains"
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit"

type DataIndex = keyof ITrade

const onChange: TableProps<ITrade>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra)
}

export const OrdersTable: React.FC<{ type?: "incoming" | "outgoing" }> = ({
  type = "incoming",
}) => {
  const account = useAccount()
  const { data, isLoading } = useGetAllTrades({
    bridgerAddress: type === "outgoing" ? account.address : undefined,
    adCreatorAddress: type === "incoming" ? account.address : undefined,
  })
  const [tradeInfo, setTradeInfo] = useState<ITrade>()
  const [openReleaseModal, setOpenReleaseModal] = useState(false)

  const columns: TableColumnsType<ITrade> = [
    {
      title: "Reference",
      dataIndex: "id",
      render: (value) => {
        return truncateString(value, 3, 3)
      },
    },
    type === "incoming"
      ? {
          title: "Bridger",
          dataIndex: "bridgerAddress",
          render: (value, rowData) => {
            return <p>{truncateString(value, 3, 3)}</p>
          },
        }
      : {
          title: "Ad Creator",
          dataIndex: "adCreatorAddress",
          render: (value, rowData) => {
            return <p>{truncateString(value, 3, 3)}</p>
          },
        },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a, b) => Number(a.amount) - Number(b.amount),
      render: (value, rowData) => {
        return (
          <p>
            {formatUnits(BigInt(value), rowData.route.orderToken.decimals)}{" "}
            <span className="text-sm">{rowData.route.orderToken.symbol}</span>
          </p>
        )
      },
    },
    {
      title: "Route",
      dataIndex: "route",
      sorter: (a, b) => Number(a.amount) - Number(b.amount),
      render: (value, rowData) => {
        return (
          <div className="flex items-center gap-1">
            <p>{rowData.route.orderToken.chain.name}</p>
            <ArrowRight size={14} className="text-primary" />
            <p>{rowData.route.adToken.chain.name}</p>
          </div>
        )
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      showSorterTooltip: { target: "full-header" },
      filters: [
        {
          text: "ACTIVE",
          value: "ACTIVE",
        },
        {
          text: "LOCKED",
          value: "LOCKED",
        },
        {
          text: "INACTIVE",
          value: "INACTIVE",
        },
        {
          text: "EXHAUSTED",
          value: "EXHAUSTED",
        },
        {
          text: "CLOSED",
          value: "CLOSED",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
      sortDirections: ["descend"],
      render: (value) => {
        return <Status status={value} />
      },
    },

    {
      title: "Updated",
      dataIndex: "updatedAt",
      sorter: (a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt),
      render: (value) => {
        return (
          <p>
            {moment(value).format("ll")}, {moment(value).format("LT")}
          </p>
        )
      },
    },

    {
      title: "Action",
      dataIndex: "status",
      render: (value, rowData) => {
        return (
          <Action
            value={value}
            rowData={rowData}
            setTradeInfo={setTradeInfo}
            setOpenReleaseModal={setOpenReleaseModal}
          />
        )
      },
    },
  ]

  const chainModal = useChainModal()
  return (
    <>
      <Table<ITrade>
        columns={columns}
        dataSource={data?.data!}
        loading={isLoading}
        onChange={onChange}
        showSorterTooltip={{ target: "sorter-icon" }}
        rowClassName={"bg-grey-900/60 hover:!bg-primary/20"}
      />

      <Modal
        open={openReleaseModal}
        title={"Release Tokens"}
        okText={
          tradeInfo?.route?.adToken?.chain?.name?.includes(
            String(account.chain?.name)
          )
            ? "Connect to Chain"
            : "Release"
        }
        onOk={() => {
          if (
            tradeInfo?.route?.adToken?.chain?.name?.includes(
              String(account.chain?.name)
            )
          ) {
            chainModal.openChainModal && chainModal.openChainModal()
          } else {
            setOpenReleaseModal(true)
          }
        }}
        onCancel={() => setOpenReleaseModal(false)}
        confirmLoading={false}
        centered
        width={400}
        cancelButtonProps={{
          disabled: false,
        }}
        styles={{
          content: { padding: 16, borderRadius: "12px" },
          mask: { backdropFilter: "blur(12px)" },
        }}
      >
        {tradeInfo && (
          <div className="space-y-4 mt-5 text-sm">
            <div className="bg-grey-900/60 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-grey-300">Trade ID</span>
                <span className="font-medium">
                  {truncateString(tradeInfo.id, 4, 4)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-grey-300">Amount</span>
                <span className="font-medium">
                  {formatUnits(
                    BigInt(tradeInfo.amount),
                    tradeInfo.route.orderToken.decimals
                  )}{" "}
                  {tradeInfo.route.orderToken.symbol}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-grey-300">Route</span>
                <div className="flex items-center gap-2">
                  <span>{tradeInfo.route.orderToken.chain.name}</span>
                  <ArrowRight size={14} className="text-primary" />
                  <span>{tradeInfo.route.adToken.chain.name}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-grey-300">Bridger</span>
                <span className="font-medium">
                  {truncateString(tradeInfo.bridgerAddress, 4, 4)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-grey-300">Created</span>
                <span className="font-medium">
                  {moment(tradeInfo.createdAt).format("lll")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-grey-300">Status</span>
                <Status status={tradeInfo.status} />
              </div>
            </div>

            <div className="bg-amber-500/10 p-3 rounded-lg">
              <p className="text-amber-500 text-sm">
                Please ensure you have received the payment before releasing the
                tokens. This action cannot be undone.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

const Action = ({
  value,
  rowData,
  setTradeInfo,
  setOpenReleaseModal,
}: {
  value: string
  rowData: ITrade
  setTradeInfo: (value: ITrade) => void
  setOpenReleaseModal: (value: boolean) => void
}) => {
  const { mutateAsync: lockFunds, isPending: lockingFunds } = useLockFunds()
  const { address, chain } = useAccount()
  const chainModal = useChainModal()

  return (
    <>
      {rowData?.route?.adToken?.chain?.name.includes(String(chain?.name)) ? (
        <Button
          type="primary"
          size="small"
          className="!w-full !h-[35px]"
          loading={lockingFunds}
          onClick={chainModal?.openChainModal}
        >
          Connect to {rowData?.route?.adToken?.chain?.name}
        </Button>
      ) : rowData.status === "LOCKED" &&
        address === rowData.adCreatorAddress ? (
        <Button
          type="primary"
          size="small"
          className="!w-full !h-[35px]"
          loading={lockingFunds}
          onClick={() => {
            setOpenReleaseModal(true)
            setTradeInfo(rowData)
          }}
        >
          Release
        </Button>
      ) : rowData.status === "ACTIVE" &&
        address === rowData.adCreatorAddress ? (
        <Button
          type="primary"
          size="small"
          className="!w-full !h-[35px]"
          loading={lockingFunds}
          onClick={() => {
            lockFunds(rowData.id)
          }}
        >
          Lock
        </Button>
      ) : (
        <p className="text-center">-</p>
      )}
    </>
  )
}
