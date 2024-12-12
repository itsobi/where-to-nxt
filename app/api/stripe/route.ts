import {
  PaymentFailedEmailTemplate,
  PaymentSucceededEmailTemplate,
  WelcomeEmailTemplate,
} from '@/components/EmailTemplate';
import { formatCurrency } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Resend } from 'resend';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

// TODO: update this on production
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

export async function POST(request: Request) {
  const user = await currentUser();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  const body = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.canceled':
      const paymentIntentCanceled = event.data.object;
      console.log('Payment intent canceled', paymentIntentCanceled);
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      console.log('Payment intent failed', paymentIntentFailed);

      const { error } = await resend.emails.send({
        from: 'Where to NXT? <payments@wheretonxt.com>',
        to: [user?.emailAddresses[0].emailAddress!],
        subject: 'Payment Failed',
        react: PaymentFailedEmailTemplate({
          username: user?.username!,
          amount: formatCurrency(paymentIntentFailed.amount),
        }),
      });

      if (error) {
        console.error('Error sending payment failed email:', error);
        return Response.json({ error }, { status: 500 });
      }
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment intent succeeded', paymentIntent);
      // TODO: Update users table with is_pro and paymentIntent.id

      const { error: paymentSucceededEmailError } = await resend.emails.send({
        from: 'Where to NXT? <payments@wheretonxt.com>',
        to: [user?.emailAddresses[0].emailAddress!],
        subject: 'Payment Success',
        react: PaymentSucceededEmailTemplate({
          username: user?.username!,
          amount: formatCurrency(paymentIntent.amount),
        }),
      });

      if (paymentSucceededEmailError) {
        console.error(
          'Error sending payment succeeded email:',
          paymentSucceededEmailError
        );
        return Response.json({ paymentSucceededEmailError }, { status: 500 });
      }

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return Response.json({ received: true }, { status: 200 });
}
