import { CheckoutAlertDialog } from '../_components/CheckoutAlertDialog';

export default async function CompletePage({
  searchParams,
}: {
  searchParams: any;
}) {
  const { payment_intent_client_secret } = await searchParams;
  const { redirect_status } = await searchParams;

  if (redirect_status === 'succeeded') {
    return (
      <CheckoutAlertDialog
        title="Payment successful"
        description="Congrats, you are now a PRO member!"
        href="/messages"
        success={true}
      />
    );
  }

  return (
    <CheckoutAlertDialog
      title="Payment failed"
      description="Your payment has failed. Please try again."
      href="/"
      success={false}
    />
  );
}
