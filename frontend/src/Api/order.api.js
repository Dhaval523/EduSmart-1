import axios from "axios"

export const getAdminOrdersApi = async (params = {}) => {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders`, {
    params,
    headers: "Application/json",
    withCredentials: true
  })

  return res.data
}
