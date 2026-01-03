import Stripe from 'stripe';
import UserModel from '../../DB/Models/UserModel.js';

// Lazy-load Stripe to ensure env vars are loaded first
let stripeInstance = null;
const getStripe = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
};

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.login_user._id; // Auth middleware sets req.login_user
    
    // In a real app, get this from DB or env
    const priceId = process.env.STRIPE_PREMIUM_PRICE_ID; 

    if (!priceId) {
        return res.status(500).json({ message: "Stripe configuration error: Missing Price ID" });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=cancel`,
      customer_email: req.login_user.email, // Pre-fill email
      metadata: {
        userId: userId.toString(),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ message: 'Error creating checkout session', error: error.message });
  }
};

export const webhook = async (req, res) => {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    let event;
  
    try {
      // NOTE: This requires the raw body. If express.json() is used globally, this might fail.
      // You might need to configure the route to use raw body parser separately.
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata.userId;
  
      if (userId) {
        await UserModel.findByIdAndUpdate(userId, { isPremium: true });
        console.log(`User ${userId} upgraded to premium`);
      }
    }
  
    res.status(200).json({ received: true });
};
