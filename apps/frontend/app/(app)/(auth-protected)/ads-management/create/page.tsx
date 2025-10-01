"use client"
import CreateAd from "@/components/ad-management-ui/CreateAd"
import { GoBack } from "@/components/shared/GoBack"
import React from "react"

const CreateAdPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap">
        <GoBack />
        <p className="text-xl font-sequel">Create Ad</p>
      </div>
      <div className="p-4">
        <CreateAd />
      </div>
    </div>
  )
}

export default CreateAdPage
