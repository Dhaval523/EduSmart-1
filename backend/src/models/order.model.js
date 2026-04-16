import mongoose from "mongoose";
import { generateNextPaymentId } from "../utils/paymentId.js";

const orderSchema  = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"

    },

    totalAmount:{
        type:Number,
        required:true
    },

    paymentId:{
        type:String,
        unique:true,
        trim:true,
        default:""
    },

    stripeSessionId:{
        type:String,
        unique:true
    }
},{timestamps:true})

orderSchema.pre("save", async function () {
    if (this.paymentId) return;
    this.paymentId = await generateNextPaymentId(this.createdAt || new Date());
});

export const Order = mongoose.model("Order", orderSchema)
