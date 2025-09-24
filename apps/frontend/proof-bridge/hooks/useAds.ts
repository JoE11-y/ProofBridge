import { createAd } from "@/services/ads.service"
import { ICreateAdRequest } from "@/types/ads"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCreateAd = () => {
  return useMutation({
    mutationKey: ["create-ad"],
    mutationFn: (data: ICreateAdRequest) => {
      return createAd(data)
    },
    onSuccess: () => {
      toast.success("Ad creation was successfull")
    },
    onError: function (error: any, variables, result, ctx) {
      toast.error(
        error.response.data.message || error.message || "Unable to create add",
        {
          description: "",
        }
      )
    },
  })
}
