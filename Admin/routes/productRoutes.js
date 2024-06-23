import express from 'express';
import { AdminVerify } from "../../middlewares/adminVerify.js";
import { check } from 'express-validator'
import { addProduct, deleteProduct, getProducts, updateProduct } from "../controllers/productController.js";
import { Admin } from 'mongodb';
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
router.patch('/:productId',
    check('name')
    .optional()
    .isString(),
    check('price')
    .optional()
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
    AdminVerify, updateProduct)

    router.delete('/:productId',AdminVerify,deleteProduct)
export default router;