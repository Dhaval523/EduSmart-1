import { createModuleApi, deleteModuleApi, getCommentApi, getModuleApi, updateModuleApi } from '@/Api/module.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCreateModule=()=>{
    const queryClient  = useQueryClient()
    return useMutation({
        mutationFn:createModuleApi,
        onSuccess:(data)=>{
            queryClient.invalidateQueries(['getSingleCourse'])
        },

        onError:(err)=>{
            console.log(err)
        }
    })
}

export const useUpdateModule = ()=>{
    const queryClient  = useQueryClient()
    return useMutation({
        mutationFn:({ id, payload })=>updateModuleApi(id, payload),
        onSuccess:()=>{
            queryClient.invalidateQueries(['getSingleCourse'])
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}

export const useDeleteModule = ()=>{
    const queryClient  = useQueryClient()
    return useMutation({
        mutationFn:(id)=>deleteModuleApi(id),
        onSuccess:()=>{
            queryClient.invalidateQueries(['getSingleCourse'])
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}


export const useGetModule = (id)=>{
    return useQuery({
        queryFn:()=>getModuleApi(id),
        queryKey:['getModule',id]
    })
}

export const useGetComment = (id)=>{
    return useQuery({
        queryFn:()=>getCommentApi(id),
        queryKey:['getComment',id],
        enabled:!!id
    })
}


