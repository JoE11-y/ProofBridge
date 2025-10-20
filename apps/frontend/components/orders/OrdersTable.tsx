"use client"

import React, { useState } from "react"
import { Button, Table } from "antd"
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
        return <Action value={value} rowData={rowData} />
      },
    },
  ]
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
    </>
  )
}

const Action = ({ value, rowData }: { value: string; rowData: ITrade }) => {
  const { mutateAsync: lockFunds, isPending: lockingFunds } = useLockFunds()
  const { address } = useAccount()

  return (
    <>
      {rowData.status === "LOCKED" && address === rowData.adCreatorAddress ? (
        <Button
          type="primary"
          size="small"
          className="!w-full !h-[35px]"
          loading={lockingFunds}
          onClick={() => {}}
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
