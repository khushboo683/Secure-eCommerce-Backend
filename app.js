import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import successHandler from './middlewares/successHandler.js';
import {rateLimitMiddleware} from './middlewares/rateLimit.js';
import authRouters from './User/routes/authRoutes.js';
import adminAuthRoutes from './Admin/routes/authRoutes.js';
import adminProductRoutes from './Admin/routes/productRoutes.js';
import adminOrderRoutes from './Admin/routes/orderRoutes.js';
import userRoutes from './User/routes/userRoutes.js';
import orderRoutes from './User/routes/orderRoutes.js';
import https from 'https';
import fs from 'fs';
dotenv.config()
connectDB();

const sslOptions = {
    key: fs.readFileSync('C:/Users/Hp/certs/server.key'),
    cert: fs.readFileSync('C:/Users/Hp/certs/server.cert')
  };

const app = express();
app.use(bodyParser.json());
app.use(errorHandler)
app.use(successHandler);
app.use(rateLimitMiddleware);  //applied globally (app.use(rateLimitMiddleware)) to limit all incoming requests based on the client's IP address.
app.use('/api/auth',authRouters);
app.use('/api/admin/auth',adminAuthRoutes);
app.use('/api/admin/product',adminProductRoutes);
app.use('/api/admin/order',adminOrderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
https.createServer(sslOptions, app).listen(443, () => {
    console.log('HTTPS server running on port 443');
  });
  
  https.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(80);