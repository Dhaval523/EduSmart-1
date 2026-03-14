import axios from "axios"

export const createModuleApi = async(payload)=>{
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/module/createModule`,
        payload,
        {
            headers:{'Content-Type':'multipart/form-data'},
            withCredentials:true
        },
    )

    return res.data
}

export const updateModuleApi = async(id, payload)=>{
    const res = await axios.patch(`${import.meta.env.VITE_BASE_URL}/module/updateModule/${id}`,
        payload,
        {
            headers:{'Content-Type':'multipart/form-data'},
            withCredentials:true
        }
    )
    return res.data
}

export const deleteModuleApi = async(id)=>{
    const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/module/deleteModule/${id}`,
        {
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )
    return res.data
}


export const getModuleApi = async(id)=>{
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/module/getModule/${id}`,
         {
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        },
    )

    return res.data
}


export const getCommentApi  = async(id)=>{
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/module/comment/${id}`,
         {
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        },
    )

    return res.data
}
