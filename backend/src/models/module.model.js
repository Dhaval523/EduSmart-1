import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },

    video:{
        type:String,
        required:true
    },

    title:{
        type:String,
        required:true
    },

    quiz:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Quiz"
    },

    resources:[
        {
            type:{
                type:String,
                enum:["link", "file"],
                required:true
            },
            title:{ type:String },
            url:{ type:String, required:true },
            mimeType:{ type:String },
            fileName:{ type:String },
            publicId:{ type:String }
        }
    ],

    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
},{timestamps:true})


export const Modules = mongoose.model("Modules", moduleSchema)
