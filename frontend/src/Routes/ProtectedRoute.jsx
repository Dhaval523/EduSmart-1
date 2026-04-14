import LoadingBars from "@/components/LoadingBars"
import { useGetUserHook } from "@/hooks/User.hook"
import { useUserStore } from "@/Store/user.store"
import { useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoutes =()=>{
    const setUser = useUserStore((state)=>state.setUser)
    const {data, isLoading, isError, error} = useGetUserHook()

    
    console.log(data)
    useEffect(()=>{
        if(data){
        setUser(data)
    }

    }, [data, setUser])
    if(isLoading){
        return (
             <div className="h-screen w-screen flex items-center justify-center bg-[#f5f7fb]">
        <LoadingBars label="Loading ..." />
      </div>
        )
    }

   if (isError || !data) {
    console.error("Auth error:", error)
    return <Navigate to="/login" replace />
  }

    return <Outlet/>
}







