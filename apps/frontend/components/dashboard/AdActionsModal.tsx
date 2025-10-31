import React, { useMemo, useState } from "react"
import { Modal, Form, InputNumber, Input, Typography } from "antd"
import { IAd } from "@/types/ads"
import { formatUnits, parseUnits } from "viem"
import { parseToBigInt } from "@/lib/parse-to-bigint"
import { useAccount } from "wagmi"
import { useChainModal } from "@rainbow-me/rainbowkit"
import {
  useCloseAd,
  useFundAd,
  useGetAllAds,
  useWithdrawFunds,
} from "@/hooks/useAds"

type ActionType = "withdraw" | "top-up" | "close"

type Props = {
  actionType: ActionType
  open: boolean
  setOpen: (v: boolean) => void
  toggleOpen: () => void
  ad: IAd
  chain: string
}

export const AdActionsModal: React.FC<Props> = ({
  actionType,
  open,
  setOpen,
  toggleOpen,
  ad,
  chain,
}) => {
  const account = useAccount()
  const { refetch: refetchAllAds } = useGetAllAds({
    creatorAddress: account.address!,
  })
  const { openChainModal } = useChainModal()
  const is_ad_chain = Number(ad.adToken.chainId) === account.chainId
  const amount = formatUnits(
    parseToBigInt(ad?.availableAmount),
    ad?.adToken?.decimals
  )
  const { mutateAsync: fundAd, isPending: isFundingAd } = useFundAd()
  const { mutateAsync: withdrawFund, isPending: isWithdrawing } =
    useWithdrawFunds()
  const { mutateAsync: closeAd, isPending: isClosingAd } = useCloseAd()

  const [form] = Form.useForm<{ amount: string }>()
  const [loading, setLoading] = useState(false)

  const cfg = useMemo(
    () => ({
      title:
        actionType === "withdraw"
          ? "Withdraw"
          : actionType === "top-up"
          ? "Top up"
          : "Close Ad",
      okText:
        actionType === "withdraw"
          ? "Withdraw"
          : actionType === "top-up"
          ? "Top up"
          : "Close ad",
    }),
    [actionType]
  )

  const handleOk = async () => {
    if (is_ad_chain) {
      const values = await form.validateFields().catch(() => null)
      if (!values) return

      setLoading(true)
      try {
        if (actionType === "top-up") {
          await fundAd({
            poolAmountTopUp: parseUnits(
              values.amount,
              ad.adToken.decimals
            ).toString(),
            adId: ad.id,
            amountBigInt: parseUnits(values.amount, ad.adToken.decimals),
            tokenId: ad.adTokenId,
          })
          refetchAllAds()
        } else if (actionType === "withdraw") {
          await withdrawFund({
            poolAmountWithdraw: parseUnits(
              values.amount,
              ad.adToken.decimals
            ).toString(),
            adId: ad.id,
            amountBigInt: parseUnits(values.amount, ad.adToken.decimals),
            to: account.address!,
          })
        } else if (actionType === "close") {
          await closeAd({
            adId: ad.id,
            to: account.address!,
          })
        }
        setOpen(false)
        form.resetFields()
        await refetchAllAds()
      } finally {
        setLoading(false)
      }
    } else {
      openChainModal && openChainModal()
    }
  }

  const handleCancel = () => {
    if (!isFundingAd || !isWithdrawing || !isClosingAd) {
      form.resetFields()
      toggleOpen() // uses the provided toggler
    }
  }

  return (
    <Modal
      open={open}
      title={cfg.title}
      okText={is_ad_chain ? cfg.okText : "Connect to Chain"}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isFundingAd || isWithdrawing || isClosingAd}
      centered
      width={400}
      cancelButtonProps={{
        disabled: isFundingAd || isWithdrawing || isClosingAd,
      }}
      styles={{
        content: { padding: 16, borderRadius: "12px" },
        mask: { backdropFilter: "blur(12px)" },
      }}
    >
      <div className="my-5 grid gap-2 grid-cols-2">
        <div className="space-y-1">
          <div className="flex flex-col">
            <p className="text-primary capitalize pr-2 font-semibold text-xs">
              Chain
            </p>
            <div className="md:text-lg text-lg">
              <p>{chain}</p>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex flex-col">
            <p className="text-primary capitalize pr-2 font-semibold text-xs">
              Available
            </p>
            <div className="md:text-lg text-lg">
              <h3>
                {amount}
                <span className="text-[16px] pl-2">{ad?.adToken?.symbol}</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
      {actionType !== "close" ? (
        <Form
          form={form}
          layout="vertical"
          initialValues={{ amount: undefined, note: "" }}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Enter amount" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter amount"
              min={0}
              stringMode
            />
          </Form.Item>
          <Form.Item label="Note (optional)" name="note">
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 4 }}
              maxLength={140}
              showCount
            />
          </Form.Item>
        </Form>
      ) : (
        <Form form={form} layout="vertical" initialValues={{ reason: "" }}>
          <Typography.Paragraph>
            Closing stops new orders. Liquidity is withdrawn to your wallet.
          </Typography.Paragraph>
          <Form.Item label="Reason (optional)" name="reason">
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 4 }}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}
