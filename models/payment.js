import mongoose from 'mongoose';
import { PaymentMethod, PaymentStatus } from '../enums/payment';

const paymentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    order: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0 
    },
    paymentMethod: { 
        type: String, 
        required: true,
        enum: Object.values(PaymentMethod)
    },
    status: { 
        type: String, 
        required: true,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    }
}, {
    timestamps: true
});

export default mongoose.model('Payment', paymentSchema);
