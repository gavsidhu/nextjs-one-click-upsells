import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent, confirmPaymentIntent } from '../lib/stripe';
import { StripeCardElement } from '@stripe/stripe-js';
import { useRouter } from 'next/router';

const CheckoutForm = () => {
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);

    try {

      const paymentMethod = await stripe?.createPaymentMethod({
        type: 'card',
        card: elements?.getElement(CardElement) as StripeCardElement
      });
      // Create the PaymentIntent
      const paymentIntent = await createPaymentIntent(paymentMethod?.paymentMethod?.id as string);

      

      setClientSecret(paymentIntent.client_secret);
      console.log(paymentIntent.id)


      // Payment succeeded
      console.log('Payment succeeded:', paymentIntent);
      router.push(`/upsell?paymentIntentId=${paymentIntent.id}&clientSecret=${paymentIntent.client_secret}`);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={!stripe || processing}>Pay now</button>
      {clientSecret && <input type="hidden" name="paymentIntentId" value={clientSecret} />}
    </form>
  );
};

export default CheckoutForm;
