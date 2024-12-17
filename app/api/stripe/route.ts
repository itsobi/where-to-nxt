import {
  PaymentFailedEmailTemplate,
  PaymentSucceededEmailTemplate,
} from '@/components/EmailTemplate';
import { formatCurrency } from '@/lib/utils';
import { clerkClient } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

// TODO: update endpoint secret on production
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET!;

export async function POST(request: Request) {
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  if (!sig) return Response.json({ error: 'No signature' }, { status: 400 });

  const body = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object;
      const { userEmail, username } = checkoutSessionExpired.metadata as {
        userEmail: string;
        username: string;
      };
      console.log('Checkout session expired', checkoutSessionExpired);

      const { error } = await resend.emails.send({
        from: 'Where to NXT? <payments@wheretonxt.com>',
        to: [userEmail],
        subject: 'Payment Failed',
        react: PaymentFailedEmailTemplate({
          username: username,
          amount: formatCurrency(checkoutSessionExpired.amount_total as number),
        }),
      });

      if (error) {
        console.error('Error sending payment failed email:', error);
        return Response.json({ error }, { status: 500 });
      }
      break;
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      const {
        userId,
        userEmail: email,
        username: userName,
      } = checkoutSessionCompleted.metadata as {
        userId: string;
        userEmail: string;
        username: string;
      };
      console.log('Checkout session completed', checkoutSessionCompleted);

      try {
        const clerk = await clerkClient();
        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: {
            is_pro: true,
          },
        });
      } catch (error) {
        console.error('Error updating user:', error);
        return Response.json({ error }, { status: 500 });
      }

      const { error: paymentSucceededEmailError } = await resend.emails.send({
        from: 'Where to NXT? <payments@wheretonxt.com>',
        to: [email],
        subject: 'Payment Success',
        react: PaymentSucceededEmailTemplate({
          username: userName,
          amount: formatCurrency(
            checkoutSessionCompleted.amount_total as number
          ),
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
