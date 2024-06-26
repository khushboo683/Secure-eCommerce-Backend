import {makeStripePayment, makePaypalPayment} from './mockPaymentController.js';
import { PaymentMethod, PaymentStatus } from '../../enums/payment.js';
import { OrderStatus } from '../../enums/orderStatus.js';
import { BadRequestError, InternalServerError, NotFoundError } from '../../utils/error.js';
import {mockLogisticsProvider, mockDeliveryStatus} from './mockLogisticsController.js';
import Order from '../../models/order.js';
import Payment from '../../models/payment.js';
import User from '../../models/user.js';

const createNewShipment= async(user,order)=>{
  const shipmentDetails={
    address: user?.address,
    orderValue: order?.totalAmount,
    paymentDetails: order?.paymentDetails
    
  }
 const response = await mockLogisticsProvider(shipmentDetails);
 if(!response){
    throw new InternalServerError('Something went wrong while creating a shipment request!');
 }
 await Order.findByIdAndUpdate(order._id,{
    $set:{
        deliveryDetails:{
            trackingId: response?.trackingId,
            deliveryStatus: response?.status
        }
    }
 })
}

export const checkout=async(req,res,next)=>{
    try{
              const { _id } = req.user; // Assuming userId is obtained from authenticated user context
              const { paymentMethod, currency } = req.body; // e.g., 'stripe', 'paypal'
          
              // Fetch user and cart details
              const user = await User.findById(_id).populate('cart.items.product');
              if (!user) {
                throw new NotFoundError('User does not exist.');
              }

              if (user?.cart?.items?.length<=0 || user?.cart?.cartValue<=0) {
                throw new BadRequestError('Cart is empty.');
              }
          
              // Calculate total amount
              let totalAmount = user?.cart?.cartValue;
          
              // Mock payment process
              let paymentResponse;
              switch(paymentMethod){
                case PaymentMethod.STRIPE:
                    paymentResponse = await makeStripePayment(totalAmount, currency);
                    break;
                case PaymentMethod.PAYPAL:
                    paymentResponse = await makePaypalPayment(totalAmount, currency);
                    break;
                case PaymentMethod.CASH_ON_DELIVERY:
                    const order = new Order({products:[...user.cart.items],totalAmount,orderStatus:OrderStatus.CONFIRMED,user: _id})
                    await order.save();
                    const payment = new Payment({user:_id,order, order: order._id,amount: totalAmount, status: PaymentStatus.PENDING, paymentMethod: paymentMethod})
                    await payment.save();
                    await Order.findByIdAndUpdate(order._id,{
                        $set:{
                            paymentDetails: payment._id
                        }
                    })
                    break;
              }
          
              if (paymentResponse.status !== 'succeeded') {
                const order = new Order({products:[...user.cart.items],totalAmount,orderStatus:OrderStatus.FAILED,user: _id})
                await order.save();
                const payment = new Payment({user:_id,order, order: order._id,amount: totalAmount, status: PaymentStatus.FAILED, paymentMethod: paymentMethod})
                await payment.save();
                await Order.findByIdAndUpdate(order._id,{
                    $set:{
                        paymentDetails: payment._id
                    }
                })
                throw new InternalServerError('Payment failed.');
              }

              const order = new Order({products:[...user.cart.items],totalAmount,orderStatus:OrderStatus.CONFIRMED,user: _id})
              await order.save();
              const payment = new Payment({user:_id,order, order: order._id,amount: totalAmount, status: PaymentStatus.COMPLETED, paymentMethod: paymentMethod})
              await payment.save();
              await Order.findByIdAndUpdate(order._id,{
                  $set:{
                      paymentDetails: payment._id
                  }
              })
              // Clear user cart after successful payment
              user.cart.items = [];
              user.cart.cartValue = 0;
              await user.save();
              await createNewShipment(user,order);
          
              res.success({ message: 'Checkout successful', order, payment });
            
    }catch(err){
        next(err);
    }
}

export const getOrders=async(req,res,next)=>{
    try{
    const {_id} = req.user;
    const orders = await Order.find({user:_id});
    res.success(orders)
    }catch(err){
        next(err);
    }
}

export const cancelOrder = async(req,res,next)=>{
    try{

        const {orderId} = req.params;
     
        const order = await Order.findByIdAndUpdate(orderId,{
            orderStatus: OrderStatus.CANCELLED
        },{new:true})
        if(!order){
            throw new NotFoundError('Order does not exist.')
        }
        const paymentId = order.paymentDetails
        if (paymentId) {
           const payment= await Payment.findById(paymentId);
           if(payment.status===PaymentStatus.COMPLETED){
            payment.status=PaymentStatus.REFUNDED
           await payment.save();
           }
        }
        
        res.success(order);
    }catch(err){
        next(err);
    }
}

export const getDeliveryStatus= async(req,res,next)=>{
    try{

        const{orderId} = req.params;
        const order = await Order.findById(orderId).populate('deliveryDetails');
        if(!order){
            throw new NotFoundError('Order does not exist');
        }
        const trackingId = order?.trackingId
        if(!trackingId){
            throw new NotFoundError('Tracking id is absent.');
        }
       const response = await mockDeliveryStatus(trackingId);
       if(!response){
        throw new InternalServerError('Something went wrong while fetching delivery status!')
       }
       await order.findByIdUpdate(orderId,{
        deliveryDetails:{
            status: response?.status
        }
       },{new : true})
       res.success(order)
    }catch(err){
        next(err);
    }
}