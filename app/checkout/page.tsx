import { redirect } from 'next/navigation';
import { CheckoutAlertDialog } from './_components/CheckoutAlertDialog';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { success: string; canceled: string; session_id: string };
}) {
  const { success, session_id } = await searchParams;

  if (!session_id) {
    redirect('/messages');
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || session.payment_status !== 'paid') {
      redirect('/messages');
    }
  } catch {
    redirect('/messages');
  }

  if (success) {
    return (
      <CheckoutAlertDialog
        title="Payment successful"
        description="Congrats, you are now a PRO member!"
        href="/messages"
        success={true}
      />
    );
  } else {
    return (
      <CheckoutAlertDialog
        title="Payment failed"
        description="Your payment has failed. Please try again."
        href="/messages"
        success={false}
      />
    );
  }
}
