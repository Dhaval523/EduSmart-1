import { checkOutSuccessApi, purchaseCourseApi } from '@/Api/purchase.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const usePayment = ()=>{
    return useMutation({
        mutationFn:purchaseCourseApi,
        onSuccess:(data)=>{
            if(data.url){
                window.location.href=data.url
                return
            }
            if (data?.message) {
                toast.info(data.message)
            }
        },
        onError:(err)=>{
            toast.error(err?.response?.data?.message || "Unable to start payment")
        }
    })
}

export const useCheckoutSuccess=()=>{
    return useMutation({
        mutationFn:(sessionId)=>checkOutSuccessApi(sessionId),
        onSuccess:(data)=>{
            toast.success(data.message)
        },
        onError:(err)=>{
            toast.error(err?.response?.data?.message || "Enrollment failed")
        }
    })
}

