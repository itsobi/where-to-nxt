'use client';

import { useStripe } from '@stripe/react-stripe-js';
import { Ban, InfoIcon } from 'lucide-react';
import { CheckCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

const STATUS_CONTENT_MAP = {
  succeeded: {
    text: 'Payment succeeded',
    iconColor: '#30B130',
    icon: CheckCheck,
  },
  processing: {
    text: 'Your payment is processing.',
    iconColor: '#6D6E78',
    icon: InfoIcon,
  },
  requires_payment_method: {
    text: 'Your payment was not successful, please try again.',
    iconColor: '#DF1B41',
    icon: Ban,
  },
  default: {
    text: 'Something went wrong, please try again.',
    iconColor: '#DF1B41',
    icon: Ban,
  },
};

export function CompletePage() {
  const stripe = useStripe();
  const [status, setStatus] = useState('default');
  const [intentId, setIntentId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        return;
      }

      setStatus(paymentIntent.status);
      setIntentId(paymentIntent.id);
    });
  }, [stripe]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {status === 'succeeded' && <p>Payment succeeded</p>}
      {status === 'processing' && <p>Your payment is processing.</p>}
      {status === 'requires_payment_method' && (
        <p>Your payment was not successful, please try again.</p>
      )}
      {status === 'default' && <p>Something went wrong, please try again.</p>}
    </div>
  );
}
