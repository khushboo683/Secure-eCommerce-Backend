import mongoose from 'mongoose';
import { OrderStatus } from '../enums/deliveryStatus';

const orderSchema = new mongoose.Schema({
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }],
    totalAmount: { type:Number, required:true},
    deliveryStatus: {
        type: String,
        enum:Object.values(OrderStatus),
        default: OrderStatus.PENDING,
        required:true
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