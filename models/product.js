import mongoose from 'mongoose';

const productSchema =  new mongoose.Schema({
    name: {type:String, required:true},
    price: { type: Number, required:true, min: 10},
    stock: Number,
    category: String,
    brand: String,
    description: String
},{
    timestamps:true
})

export default mongoose.model('Product',productSchema)