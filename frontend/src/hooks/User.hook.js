import { getAdminUsersApi, getUser, loginApi, logoutApi, registerApi, updateProfileApi } from "@/Api/user.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export const useRegisterHook = ()=>{
    const navigate =  useNavigate()
    return useMutation({
        mutationFn:registerApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            navigate("/home")
        },

        onError:(err)=>{
            console.log(err)
        }
    })
}

export const useLoginHook = ()=>{
    const navigate = useNavigate()
    return useMutation({
        mutationFn:loginApi,
        onSuccess:(data)=>{
            toast.success(data?.message)
            navigate('/home')
        },

        onError:(err)=>{
            toast.error(err.response.data.message)
           
        }
    })
}

export const useGetUserHook = ()=>{
    return useQuery({
        queryFn:getUser,
        queryKey:['getUser'],
        retry:false
    })
}


export const useLoggedOut=()=>{
    const navigate = useNavigate()
    return useMutation({
        mutationFn:logoutApi,
        onSuccess:(data)=>{
            toast.success(data?.message)
            navigate('/login')
        },
        onError:(err)=>{
            toast.error(err.response.data.message)
        }
    })
}


export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateProfileApi,
        onSuccess: (data) => {
            toast.success(data?.message || "Profile updated")
            queryClient.invalidateQueries({ queryKey: ['getUser'] })
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to update profile")
        }
    })
}

export const useAdminUsers = (params) => {
    return useQuery({
        queryFn: () => getAdminUsersApi(params),
        queryKey: ['adminUsers', params]
    })
}
