import { Router } from 'express';
import { createCheckoutSession, webhook } from './stripe.controller.js';
import { AuthenticationMiddleware } from '../../Middlewares/AuthenticationMiddleware.js';

const StripeRouter = Router();

// Create checkout session (protected route)
StripeRouter.post('/create-checkout-session', AuthenticationMiddleware(), createCheckoutSession);

// Webhook endpoint (raw body parsing is handled in Main.js before express.json())
StripeRouter.post('/webhook', webhook);

export default StripeRouter;
