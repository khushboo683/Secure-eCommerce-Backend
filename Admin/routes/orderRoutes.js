import express from 'express';
import { deleteOrder, getOrderDetails, getOrders, updateOrder } from '../controllers/orderController.js';
import { AdminVerify } from '../../middlewares/adminVerify.js';
import { DeliveryStatus } from '../../enums/deliveryStatus.js';
import { OrderStatus } from '../../enums/orderStatus.js';
import Validate from '../../middlewares/validate.js';
import {check} from 'express-validator';

const router = express.Router();

router.get('/',AdminVerify, getOrders);
router.get('/:orderId',AdminVerify, getOrderDetails);
router.patch('/:orderId', 
    check('deliveryStatus')
    .optional()
    .isIn(Object.values(DeliveryStatus)),
    check('orderStatus')
    .optional()
    .isIn(Object.values(OrderStatus)),
    Validate,
    updateOrder
)
router.delete('/:orderId', AdminVerify, deleteOrder)

export default router;