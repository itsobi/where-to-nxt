'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { StripeCheckoutForm } from './StripeCheckoutForm';
import { LoadingAnimation } from '@/components/LoadingAnimation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    setIsLoading(true);
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#3b5aa9',
    },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center space-y-4">
        <p className="text-muted-foreground">Creating your secure checkout</p>
        <LoadingAnimation />
      </div>
    );
  } else {
    return (
      <div className="max-w-[500px] mx-auto">
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance,
            }}
          >
            <StripeCheckoutForm />
          </Elements>
        )}
      </div>
    );
  }
}
