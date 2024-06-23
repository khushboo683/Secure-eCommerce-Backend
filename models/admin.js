import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: { type: String, required:true},
    email:{ type: String, required:true, unique:true},
    mobile:{type: String, required:true, unique:true},
    password: { type:String, required:true},
    role: {
        type: String,
        default: "0x99"
    }
},{
    timestamps:true
})

export default mongoose.model('Admin', adminSchema);