import { AD_MANAGER_ABI } from "@/abis/AdManager.abi"
import { useConfirmAdTx, useCreateAd, useFundAd } from "@/hooks/useAds"
import { useGetBridgeRoutes } from "@/hooks/useBridgeRoutes"
import { chain_icons } from "@/lib/chain-icons"
import { Button, Modal } from "antd"
import { Handshake, Info, ShieldAlert, Text } from "lucide-react"
import moment from "moment"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { Chain, parseUnits } from "viem"
import { useAccount, useWriteContract } from "wagmi"
import { useChainModal } from "@rainbow-me/rainbowkit"

export const AddLiquidity = ({
  liquidity_chain,
  other_chain,
}: {
  liquidity_chain: Chain
  other_chain: Chain
}) => {
  const account = useAccount()
  const is_liquidity_chain = liquidity_chain.id === account.chainId
  const { openChainModal } = useChainModal()
  const { mutateAsync: createAd, isPending } = useCreateAd()
  const { mutateAsync: fundAd, isPending: isFundingAd } = useFundAd()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")
  const [isInputError, setIsInputError] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const toggleModal = () => setOpenModal(!openModal)
  const { data: routes, isLoading: loadingRoutes } = useGetBridgeRoutes({
    adChainId: String(liquidity_chain.id),
    orderChainId: String(other_chain.id),
  })

  const { mutateAsync: confirmTx, isPending: isConfirming } = useConfirmAdTx()

  const handleCreateAd = async () => {
    try {
      const response = await createAd({
        routeId: routes?.data[0].id!,
        creatorDstAddress: account.address!,
        maxAmount: parseUnits(
          max,
          liquidity_chain.nativeCurrency.decimals
        ).toString(),
        minAmount: parseUnits(
          min,
          liquidity_chain.nativeCurrency.decimals
        ).toString(),

        metadata: {
          title,
          description,
        },
      })
      await fundAd({
        poolAmountTopUp: parseUnits(
          amount,
          liquidity_chain.nativeCurrency.decimals
        ).toString(),
        adId: response.adId,
        amountBigInt: parseUnits(
          amount,
          liquidity_chain.nativeCurrency.decimals
        ),
      })
      toggleModal()
    } catch (error) {}
  }
  return (
    <div className="space-y-6">
      <div className="bg-grey-900 md:p-6 p-3 rounded-md space-y-4">
        <div className="flex items-center gap-4">
          <Text className="text-primary" />
          <p className="text-[16px] tracking-wider font-semibold">
            Trading Details
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <p className="text-grey-300">Base Chain</p>
            <div className="flex gap-2 items-center">
              <Image
                src={chain_icons[liquidity_chain.id]}
                alt=""
                height={40}
                width={40}
                className="rounded-full"
              />
              <p className="text-lg">{liquidity_chain.name}</p>
            </div>
          </div>

          <div>
            <p className="text-grey-300"> Destination Chain</p>
            <div className="flex gap-2 items-center">
              <Image
                src={chain_icons[other_chain.id]}
                alt=""
                height={30}
                width={30}
                className="rounded-full"
              />
              <p className="text-lg">{other_chain.name}</p>
            </div>
          </div>

          <div>
            <p className="text-grey-300">Title</p>
            <input
              className="w-full h-[40px] border-[1px]"
              placeholder="Give this ad a title"
              onChange={(e) => setTitle(e.target.value)}
            />
            {isInputError && !title && (
              <p className="text-xs text-red-400 tracking-widest">
                Title is required
              </p>
            )}
          </div>

          <div>
            <p className="text-grey-300">Liquidity</p>
            <input
              className="w-full h-[40px] border-[1px]"
              placeholder="Amount"
              onChange={(e) => setAmount(e.target.value)}
              type="number"
            />
            {isInputError && !amount && (
              <p className="text-xs text-red-400 tracking-widest">
                Liquidity amount is required
              </p>
            )}
          </div>

          <div>
            <p className="text-grey-300">Minimum Order</p>
            <input
              className="w-full h-[40px] border-[1px]"
              placeholder="Min. Amount"
              type="number"
              onChange={(e) => setMin(e.target.value)}
            />
            {isInputError && !min && (
              <p className="text-xs text-red-400 tracking-widest">
                Min. Order is required
              </p>
            )}
          </div>

          <div>
            <p className="text-grey-300">Maximum Order</p>
            <input
              className="w-full h-[40px] border-[1px]"
              placeholder="Max. Amount"
              type="number"
              onChange={(e) => setMax(e.target.value)}
            />
            {isInputError && !max && (
              <p className="text-xs text-red-400 tracking-widest">
                Max. Order is required
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-grey-900 md:p-6 p-3 rounded-md space-y-4">
        <div className="flex items-center gap-4">
          <ShieldAlert className="text-amber-400" />
          <p className="text-[16px] tracking-wider font-semibold">
            Trading Terms and description
          </p>
        </div>

        <div>
          <textarea
            placeholder="Instructions & description"
            className="min-h-[130px] w-full border-[1px] border-grey-500 outline-0 p-3 rounded-md focus:border-primary"
            onChange={(e) => setDescription(e.target.value)}
          />
          {isInputError && !description && (
            <p className="text-xs text-red-400 tracking-widest">
              Description is required
            </p>
          )}
        </div>
      </div>

      <div className="bg-grey-900 md:p-6 p-3 rounded-md space-y-4">
        <div className="flex items-center gap-4">
          <p className="text-[16px] tracking-wider font-semibold">Ad Summary</p>
        </div>

        <div className="bg-grey-800 p-2 md:p-4 rounded-md tracking-wider">
          <div className="flex gap-2 items-center text-xs mb-1">
            <Info size={16} className="text-blue-500" />
            <p>What users will see</p>
          </div>
          <p>
            Your ad will appear as: sell ETH for HBAR with the information and
            trading terms specified above.
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        {is_liquidity_chain ? (
          <Button
            onClick={() => {
              if (!title || !description || !amount || !min || !max) {
                setIsInputError(true)
                return
              }
              setIsInputError(false)
              toggleModal()
            }}
            className=""
            type="primary"
            size="large"
            loading={isPending}
          >
            Preview Ad
          </Button>
        ) : (
          <Button type="primary" size="large" onClick={openChainModal}>
            Connect to {liquidity_chain.name}
          </Button>
        )}
      </div>

      <Modal
        open={openModal}
        onCancel={toggleModal}
        centered
        footer={null}
        closeIcon={null}
        width={800}
        styles={{
          content: { padding: 0, borderRadius: "12px" },
          mask: { backdropFilter: "blur(12px)" },
        }}
      >
        <div className="grid md:[grid-template-columns:370px_1fr]">
          <div className="bg-grey-800 w-full h-full md:rounded-l-[12px] p-4 md:p-6 md:py-7 space-y-7">
            <div>
              <div>
                <Handshake className="text-primary" />
                <p className="text-lg mb-4 underline">
                  Providing Liquidity for{" "}
                  <span className="text-primary font-semibold">
                    {liquidity_chain.name}
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-grey-200 capitalize pr-2 font-semibold text-xs">
                    Quantity
                  </p>
                  <p>
                    {amount} {"ETH"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-grey-200 capitalize pr-2 font-semibold text-xs">
                    Limits
                  </p>
                  <p>
                    {min} - {max} {"ETH"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-grey-200 capitalize pr-2 font-semibold text-xs">
                    Posted
                  </p>
                  <div className="flex items-center gap-1 text-grey-300">
                    <div className="flex items-center gap-1">
                      <span className=" h-3 w-1 bg-primary"></span>
                      <p>{moment().format("ll")}</p>
                    </div>
                    <p>{moment().format("LT")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[13px] tracking-wide text-grey-300">
              <div className="max-h-[130px] overflow-y-auto mt-2 py-2 pr-2 text-grey-50">
                <p>{description}</p>
              </div>
              <p className="font-semibold mb-1">Advertiser Terms</p>
              <div className="grid [grid-template-columns:12px_1fr] gap-0">
                <Info size={12} className="mt-1" />

                <div className="">
                  <p className="pl-3">
                    Merchants may impose additional terms in the Advertiser
                    Terms. Kindly preview carefully before creating an ad. In
                    the event of any conflict, the Platform's{" "}
                    <Link href={"#"} className="!text-primary">
                      Terms
                    </Link>{" "}
                    shall prevail. Violations will be penalized by platform
                    protection.
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleCreateAd}
              className="w-full mt-5"
              type="primary"
              size="large"
              loading={isPending || isConfirming || isFundingAd}
            >
              Create Ad
            </Button>
          </div>

          <div>
            <img
              src="/assets/features/vault.png"
              alt=""
              className="w-full h-full"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
