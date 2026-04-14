import { getAdminOrdersApi } from "@/Api/order.api"
import { useQuery } from "@tanstack/react-query"

export const useAdminOrders = (params) => {
  return useQuery({
    queryFn: () => getAdminOrdersApi(params),
    queryKey: ["adminOrders", params]
  })
}
