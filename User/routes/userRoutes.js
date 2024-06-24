import express from 'express';
import { Verify } from '../../middlewares/verify.js';
import { updateCart } from '../controllers/userController.js';
import {check} from 'express-validator';
import {CartActions} from '../../enums/cartActions.js';
const router = express.Router();

router.patch('/cart/:productId',check('action').isIn(Object.values(CartActions)),Verify,updateCart)

export default router;