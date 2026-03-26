import { Spinner } from "@/components/ui/spinner"
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
             <div className="h-screen w-screen flex items-center justify-center bg-[#F7F7FB]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-12 h-12 text-[#6C5DD3]" />
          <h1 className="text-xl font-bold text-[#1F2937] tracking-tight">Loading ...</h1>
        </div>
      </div>
        )
    }

   if (isError || !data) {
    console.error("Auth error:", error)
    return <Navigate to="/login" replace />
  }

    return <Outlet/>
}





