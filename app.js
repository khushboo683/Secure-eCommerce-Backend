import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import successHandler from './middlewares/successHandler.js';
import authRouters from './User/routes/authRoutes.js';
import adminAuthRoutes from './Admin/routes/authRoutes.js';
import adminProductRoutes from './Admin/routes/productRoutes.js';
import adminOrderRoutes from './Admin/routes/orderRoutes.js';
import userRoutes from './User/routes/userRoutes.js';
dotenv.config()
connectDB();
const app = express();
app.use(bodyParser.json());
app.use(errorHandler)
app.use(successHandler);
app.use('/api/auth',authRouters);
app.use('/api/admin/auth',adminAuthRoutes);
app.use('/api/admin/product',adminProductRoutes);
app.use('/api/admin/order',adminOrderRoutes);
app.use('/api/user', userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));