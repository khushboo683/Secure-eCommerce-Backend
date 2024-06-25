import mongoose from 'mongoose';
import { DeliveryStatus } from '../enums/deliveryStatus.js';
import { OrderStatus } from '../enums/orderStatus.js';
const itemInOrderSchema= new mongoose.Schema({
    product: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        },
        count:{type:Number, default:0}
    })
const orderSchema = new mongoose.Schema({
    products:[{
        type: itemInOrderSchema,
        required:true
    }],
    totalAmount: { type:Number, required:true},
    orderStatus:{
       type: String,
       enum: Object.values(OrderStatus),
       required:true
    },
    deliveryStatus: {
        type: String,
        enum:Object.values(DeliveryStatus),
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    paymentDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Payment',
    }

},{
    timestamps:true
})

export default mongoose.model('Order',orderSchema);