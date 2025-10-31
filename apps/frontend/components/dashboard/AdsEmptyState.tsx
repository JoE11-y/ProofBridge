"use client"
import React from "react"
import { CiBadgeDollar } from "react-icons/ci"
import { Button } from "antd"

interface Props {
  title?: string
  message?: string
  primaryLabel?: string
  onPrimaryClick?: () => void
}

export const AdsEmptyState: React.FC<Props> = ({
  title = "No ads yet",
  message = "You currently have no ads. Create a new ad to have active listings.",
  primaryLabel = "Refresh",
  onPrimaryClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="h-24 w-24 rounded-full bg-grey-800 flex items-center justify-center">
        <CiBadgeDollar size={36} className="text-primary" />
      </div>

      <div className="text-center space-y-2 max-w-xl">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-grey-400">{message}</p>
      </div>

      <div className="flex gap-3">
        <Button
          type="primary"
          onClick={() =>
            // fallback: navigate to create ad page if available
            (window.location.href = "/ads-management/create")
          }
        >
          Create an ad
        </Button>
      </div>
    </div>
  )
}

export default AdsEmptyState
