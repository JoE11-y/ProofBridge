import { client_get_env_variables } from "@/lib/env_variables"
import { useQuery } from "@tanstack/react-query"

export const useEnvVariables = () => {
  return useQuery({
    queryKey: ["env-variables"],
    queryFn: () => client_get_env_variables(),
  })
}
