import { useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { confirmPaymentIntent, updatePaymentIntent } from '../lib/stripe';

const UpsellPage = () => {
  const router = useRouter();
  const stripe = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleYes = async () => {
    setIsProcessing(true);
    try {
      const paymentIntentId = router.query.paymentIntentId as string;
      await updatePaymentIntent(paymentIntentId,1500)
      const result = await confirmPaymentIntent(paymentIntentId);
      console.log('Payment succeeded:', result);
      // Redirect the user to a success page or a confirmation page
      router.push('/thank-you');
    } catch (error) {
      console.error('Payment failed:', error);
      // Redirect the user to an error page or display an error message
      // router.push('/error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNo = async () => {
    // Confirm order without upsell and redirect the user to a success page or a confirmation page
    const paymentIntentId = router.query.paymentIntentId as string;
    const result = await confirmPaymentIntent(paymentIntentId);
    router.push('/thank-you');
  };

  return (
    <>
      <h1>Do you want to buy an additional product?</h1>
      <button disabled={isProcessing} onClick={handleYes}>
        {isProcessing ? 'Processing...' : 'Yes'}
      </button>
      <button disabled={isProcessing} onClick={handleNo}>
        {isProcessing ? 'Processing...' : 'No'}
      </button>
    </>
  );
};

export default UpsellPage;
