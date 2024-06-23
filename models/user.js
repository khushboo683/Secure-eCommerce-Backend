import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    addressLine1 : String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String
})
const cartSchema = new mongoose.Schema({
    product: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    count:Number
})
const userSchema = new mongoose.Schema({
    name: { type: String, required:true},
    email:{ type: String, required:true, unique:true},
    mobile:{type: String, required:true, unique:true},
    password: { type:String, required:true},
    role: {
        type: String,
        default: "0x88"
    },
    address: [{
        type: addressSchema
    }],
    orders:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Order'
    }],
    cart: [{type: cartSchema}]
},{
    timestamps:true
})

export default mongoose.model('User', userSchema);