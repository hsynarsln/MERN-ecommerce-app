import cookieParser from 'cookie-parser';
import express from 'express';
import errorMiddleware from './middleware/error.js';
import order from './routes/orderRoute.js';
import product from './routes/productRoute.js';
import user from './routes/userRoutes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    // "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

//! route imports
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);

//! Middleware for Errors
app.use(errorMiddleware);

export default app;
