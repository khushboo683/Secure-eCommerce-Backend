import User from '../../models/user.js';
import Product from '../../models/product.js';
import { NotFoundError } from '../../utils/error.js';
import { CartActions } from '../../enums/cartActions.js';
import {makeStripePayment, makePaypalPayment} from './mockPaymentController.js';

export const getProfile=async(req,res,next)=>{
    try{
       const {id} = req.user;
       const user = await User.findById(id);
       if(!user){
        throw new NotFoundError('Something went wrong.');
       }
       res.success(user);
    }catch(err){
        next(err);
    }
}

export const updateCart=async(req,res,next)=>{
    console.log("req.user in func",req.user)
  
    try{

        const { _id} = req.user;
          console.log("+__id",_id);
        const {productId} = req.params;
        const {action} = req.body;
        let user= await User.findById(_id);
        if(!user){
            throw new NotFoundError('User does not exist.');
        }
        const product = await Product.findById(productId);
        if(!product){
            throw new NotFoundError('Product does not exist.');
        }
        console.log("user agter populating", user)
        let productIndex=-1;
        console.log("user.cart",user?.cart?.items?.length>0)
        if (user?.cart?.items?.length > 0) {
            productIndex = user.cart.items.findIndex(i => {
                return i['product'].toString() === productId;
            });
        }
        switch(action){
            case CartActions.ADD_ITEM:
                if (productIndex !== -1) {
                    console.log("cart",user.cart.items)
                    user.cart.items[productIndex].count++;
                    user.cart.cartValue+=product.price;
                } else {
                    user.cart={}
                    user.cart.items=[{ product: productId, count: 1 }]
                    user.cart.cartValue=product.price;
                }
              console.log("user after cart add", user.cart);
                break;
                case CartActions.DELETE_ITEM:
                    if (productIndex !== -1) {
                        user.cart.cartValue-=(product.price)*(user.cart.items[productIndex].count);
                        user.cart.items.splice(productIndex, 1);
                      
                    } else {
                        throw new NotFoundError('Product not found in cart.');
                    }
                    break;
                    
                case CartActions.REMOVE_ITEM:
                    if (productIndex !== -1) {
                        if (user.cart.items[productIndex].count > 1) {
                            user.cart.items[productIndex].count--;
                        } else {
                            user.cart.items.splice(productIndex, 1);
                        }
                        user.cart.cartValue-=(product.price);
                    } else {
                        throw new NotFoundError('Product not found in cart.');
                    }
                    break;
                    
                default:
                    throw new BadRequestError('Invalid action.');

        }
        user.markModified('cart.items');
        user.markModified('cart.cartValues');
       await user.save();
        res.success(user);
    }catch(err){
        next(err);
    }
}

export const checkout=async(req,res,next)=>{
    try{
              const { _id } = req.user; // Assuming userId is obtained from authenticated user context
              const { paymentMethod } = req.body; // e.g., 'stripe', 'paypal'
          
              // Fetch user and cart details
              const user = await User.findById(_id).populate('cart.items.product');
              if (!user) {
                throw new NotFoundError('User does not exist.');
              }
          
              if (user?.cart?.items?.length<=0) {
                throw new BadRequestError('Cart is empty.');
              }
          
              // Calculate total amount
              let totalAmount = user.cart.items.reduce((total, item) => {
                return total + item.product.price * item.count;
              }, 0);
          
              // Mock payment process
              let paymentResponse;
              if (paymentMethod === 'stripe') {
                paymentResponse = await makeStripePayment(totalAmount);
              } else if (paymentMethod === 'paypal') {
                paymentResponse = await makePaypalPayment(totalAmount);
              } else {
                throw new BadRequestError('Unsupported payment method.');
              }
          
              if (paymentResponse.status !== 'succeeded') {
                throw new InternalServerError('Payment failed.');
              }
          
              // Clear user cart after successful payment
              user.cart.items = [];
              user.cart.cartValue = 0;
              await user.save();
          
              res.success({ message: 'Checkout successful', paymentResponse });
            
    }catch(err){
        next(err);
    }
}