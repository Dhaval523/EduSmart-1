import multer from 'multer'

import {CloudinaryStorage} from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'


const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"courseModule",
        resource_type:'auto',
        allowed_formats:[
            'mp4', 'mov', 'avi',
            'pdf', 'ppt', 'pptx',
            'jpg', 'jpeg', 'png', 'webp'
        ]
    }
})

const MAX_MODULE_UPLOAD_SIZE = 500 * 1024 * 1024 // 500MB

export const videoUpload = multer({
    storage:storage,
    limits:{
        fileSize: MAX_MODULE_UPLOAD_SIZE
    }
})
