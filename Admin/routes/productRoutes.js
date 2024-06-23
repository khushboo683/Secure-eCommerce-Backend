import express from 'express';
import { AdminVerify } from "../../middlewares/adminVerify.js";
import { check } from 'express-validator'
import { addProduct, getProducts } from "../controllers/productController.js";
const router = express.Router();

router.post('/add',
    check('name')
    .notEmpty()
    .isString(),
    check('price')
    .notEmpty()
    .isNumeric(),
    check('stock')
    .optional()
    .isNumeric(),
    check('category')
    .optional()
    .isString(),
    check('brand')
    .optional()
    .isString(),
    check('description')
    .optional()
    .isString(),
    AdminVerify,
    addProduct
)
router.get('/', AdminVerify, getProducts)
export default router;