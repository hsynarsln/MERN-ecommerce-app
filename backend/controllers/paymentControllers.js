import Stripe from 'stripe';
import catchAsyncErrors from '../middleware/catchAsyncErrors.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    metadata: {
      company: 'Ecommerce'
    }
  });

  res.status(200).json({ success: true, client_secret: myPayment.client_secret });
});

export const sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
