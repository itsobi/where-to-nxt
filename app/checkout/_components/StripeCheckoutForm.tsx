'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { PROJECT_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${PROJECT_URL}/checkout/complete`,
      },
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'An unexpected error occurred.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} id="payment-element">
      <PaymentElement options={{ layout: 'accordion' }} />
      <Button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full mt-4"
      >
        {isLoading ? 'Processing...' : 'Pay now'}
      </Button>
      {message && (
        <div className="text-red-500 text-center mt-2" id="payment-message">
          {message}
        </div>
      )}
    </form>
  );
}
