import express from 'express';
import { login, register } from '../controllers/authController.js';
import { check } from 'express-validator';
import Validate from '../../middlewares/validate.js';

const router = express.Router();

router.post('/login',
    check('email')
    .isEmail()
    .withMessage('Enter a valid email address')
    .normalizeEmail(),
    check('password').not().isEmpty(),
    Validate,
    login)

    router.post(
        "/register",
        check("email")
            .isEmail()
            .withMessage("Enter a valid email address")
            .normalizeEmail(),
        check("mobile")
            .isLength({ min: 10, max: 10 })
            .withMessage("Enter a valid mobile number"),    
        check("name")
            .not()
            .isEmpty()
            .withMessage("You name is required")
            .trim()
            .escape(),
        check("password")
            .notEmpty()
            .isLength({ min: 8 })
            .withMessage("Must be at least 8 chars long"),   
        Validate,
        register
    );    

    export default router;