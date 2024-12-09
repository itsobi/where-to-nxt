import { PRO_MEMBERSHIP_PRICE, PROJECT_URL } from '@/lib/constants';
import { convertToSubcurrency } from '@/lib/utils';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  await auth.protect();

  try {
    // const user = await currentUser();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: convertToSubcurrency(PRO_MEMBERSHIP_PRICE),
      currency: 'usd',
      receipt_email: 'dummy@test.com',
      // receipt_email: user?.primaryEmailAddress?.emailAddress,
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
