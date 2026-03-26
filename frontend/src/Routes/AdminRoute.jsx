import { Navigate, Outlet } from "react-router-dom"
import { useUserStore } from "@/Store/user.store"

export const AdminRoutes = () => {
  const { user } = useUserStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!user?.admin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
