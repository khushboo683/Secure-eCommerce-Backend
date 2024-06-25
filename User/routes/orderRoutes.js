import express from 'express';
import { Verify } from '../../middlewares/verify.js';
import { PaymentMethod } from '../../enums/payment.js';
import {check} from 'express-validator';
import Validate from '../../middlewares/validate.js';
import { checkout } from '../controllers/orderController.js';
const router = express.Router();

router.post('/checkout',
     check('paymentMethod')
     .isIn(PaymentMethod)
     .notEmpty(),
     check('currency')
     .notEmpty(),
     Validate,
     Verify,
     checkout

)
export default router