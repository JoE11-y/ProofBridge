import { BridgeTab } from "@/components/bridge-ui/BridgeTab"
import { Logo } from "@/components/shared/Logo"
import Link from "next/link"
import React from "react"

const BridgePage = () => {
  return (
    <div className="max-w-[950px] mx-auto space-y-4 md:space-y-4">
      <div className="w-full bg-grey-900 p-4 rounded-md">
        <div className="md:max-w-[60%] mx-auto">
          <div className="flex items-center gap-6 w-full">
            <div>
              <h3 className="md:text-xl font-perfectly-nineties font-medium">
                First P2P cross-chain bridge on Hedera
              </h3>
              <p className="text-[13px]">
                Unlocking the next generation of cross-chain bridging on Hedera.{" "}
                <Link href={"/"} className="underline text-primary">
                  create ad
                </Link>
              </p>
              <p></p>
            </div>

            <div>
              <Logo height={30} width={40} />
            </div>
          </div>
        </div>
      </div>
      <BridgeTab />
    </div>
  )
}

export default BridgePage
