import { useState } from 'react';
import { CardElement, useStripe, useElements, AddressElement, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '../lib/stripe';
import { StripeCardElement, StripePaymentElement, StripeAddressElement, loadStripe, PaymentIntent } from '@stripe/stripe-js';
import { useRouter } from 'next/router';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CheckoutForm = () => {
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null)
  const router = useRouter();

  const [formStep, setFormStep] = useState(0);

  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);

  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);

  const handleNextStep = async () => {
    // Create the PaymentIntent
    const paymentIntent = await createPaymentIntent();
    console.log(paymentIntent)



    setClientSecret(paymentIntent.client_secret);
    console.log(paymentIntent.id)
    nextFormStep();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);

    try {




      // Payment succeeded
      console.log('Payment succeeded:', paymentIntent);
      router.push(`/upsell?paymentIntentId=${paymentIntent?.id}&clientSecret=${paymentIntent?.client_secret}`);
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
    <>

      {formStep === 0 &&
        <div className="-space-y-px rounded-md shadow-sm">
          <AddressElement options={{ mode: "billing" }} />
          <div className='py-4'>
            <button
              onClick={handleNextStep}
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
            >
              Next
            </button>
          </div>

        </div>
      }
      {formStep === 1 &&
        <Elements stripe={stripePromise} options={{ clientSecret: clientSecret as string }}>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <PaymentElement />
            <button
              type="submit"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
              disabled={!stripe || processing}
            >
              Purchase
            </button>
            {clientSecret && <input type="hidden" name="paymentIntentId" value={clientSecret} />}
          </form>
        </Elements>
      }
    </>
  );
};

export default CheckoutForm;
