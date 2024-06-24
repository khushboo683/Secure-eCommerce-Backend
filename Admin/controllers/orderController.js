import Order from '../../models/order.js';
import { NotFoundError } from '../../utils/error.js';


export const getOrders=async(req,res,next)=>{
try{
  const result = await Order.find({});
  res.success({result});
}catch(err){
    next(err);
}
}

export const updateOrder=async(req,res,next)=>{
    try{
        const {orderId} = req.params;
       const result= await Order.findByIdAndUpdate(orderId,{...req.body},{new:true});
       res.success({result, message:"Order updated successfully."});
    }catch(err){
        next(err);
    }
}

export const getOrderDetails=async(req,res,next)=>{
    try{
       const {orderId} = req.params;
       const order = await Order.findById(orderId);
       if(!order){
        throw new NotFoundError('Order does not exist.');
       }
       res.success({order});
    }catch(err){
        next(err);
    }
}

export const deleteOrder = async(req,res,next)=>{
    try{
      const {orderId} = req.params;
      await Order.findByIdAndDelete(orderId);
      res.success({message:`Order with id: ${orderId} deleted.`})
    }catch(err){
        next(err);
    }
}