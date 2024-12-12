import { PRO_MEMBERSHIP_PRICE } from '@/lib/constants';
import { convertToSubcurrency } from '@/lib/utils';
import { auth, currentUser } from '@clerk/nextjs/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  await auth.protect();
  const user = await currentUser();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: convertToSubcurrency(PRO_MEMBERSHIP_PRICE),
      currency: 'usd',
      receipt_email: user?.primaryEmailAddress?.emailAddress,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
