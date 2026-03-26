import axios from "axios"

export const createCourseApi=async(payload)=>{
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/course/createCourse`,
        payload,
        {
            headers:{'Content-Type':'multipart/form-data'},
            withCredentials:true
        },
        
    )
    return res.data
}

export const updateCourseApi = async(id, payload)=>{
    const res = await axios.patch(`${import.meta.env.VITE_BASE_URL}/course/updateCourse/${id}`,
        payload,
        {
            headers:{'Content-Type':'multipart/form-data'},
            withCredentials:true
        }
    )
    return res.data
}

export const deleteCourseApi = async(id)=>{
    const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/course/deleteCourse/${id}`,
        {
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )
    return res.data
}


export const getCourseApi = async(searchOrFilters)=>{
    const params = typeof searchOrFilters === "string"
        ? (searchOrFilters ? { search: searchOrFilters } : {})
        : (searchOrFilters || {})

    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/course/getCourse`,
        {
            params,
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )

    return res.data
}


export const getSingleCourseApi =async(id)=>{
    const res=await axios.get(`${import.meta.env.VITE_BASE_URL}/course/getSingleCourse/${id}`,
         {
            
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )
    return res.data
}


export const getPurchaseCourseApi = async(courseId)=>{
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/course/purchasedCourse/${courseId}`,
        {
            
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )

    return res.data
}

export const getAllPurchaseCourseApi = async()=>{
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/course/getAllCoursePurchase`,
        {
            
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )

    return res.data
}


