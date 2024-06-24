import mongoose from 'mongoose';
import { DeliveryStatus } from '../enums/deliveryStatus.js';
import { OrderStatus } from '../enums/orderStatus.js';

const orderSchema = new mongoose.Schema({
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }],
    totalAmount: { type:Number, required:true},
    OrderStatus:{
       type: String,
       enum: Object.values(OrderStatus)
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
        required: true
    }

},{
    timestamps:true
})

export default mongoose.model('Order',orderSchema);