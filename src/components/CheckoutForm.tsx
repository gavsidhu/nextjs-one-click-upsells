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
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };


  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className="-space-y-px rounded-md shadow-sm">
        <div>
          <label htmlFor="email-address" className="sr-only">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="relative block w-full rounded-lg py-3 px-3 text-black placeholder:text-gray-400 placeholder:font-md sm:text-[16px] sm:leading-6 focus:outline-none"
            placeholder="Full Name"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="relative mt-4 block w-full rounded-lg py-3 px-3 text-black placeholder:text-gray-400 placeholder:font-md sm:text--[16px] sm:leading-6 focus:outline-none"
            placeholder="Email Address"
          />
        </div>
      </div>
      <CardElement />
      <button
        type="submit"
        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
        disabled={!stripe || processing}
      >
        Purchase
      </button>
      {clientSecret && <input type="hidden" name="paymentIntentId" value={clientSecret} />}
    </form>
  );
};

export default CheckoutForm;
