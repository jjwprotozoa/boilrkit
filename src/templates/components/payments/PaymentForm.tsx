import React, { useEffect, useState, FormEvent } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

interface PaymentFormProps {
  amount: number; // In cents
  onSuccess: (paymentIntent: {
    id: string;
    status: 'succeeded';
    amount: number;
  }) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        // Simulate fetching client secret
        setTimeout(() => {
          setClientSecret('mock_client_secret');
        }, 500);
      } catch (err: unknown) {
        const typedErr = err as Error;
        console.error('Error creating payment intent:', typedErr);
        setError('Failed to initialize payment. Please try again.');
      }
    };
    fetchPaymentIntent();
  }, [amount]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    // Simulate payment success
    setTimeout(() => {
      onSuccess({
        id: 'mock_payment_intent_id',
        status: 'succeeded',
        amount,
      });
      setLoading(false);
    }, 1000);

    // Real Stripe logic goes here (commented out for now)
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Card Details
          </label>
          <div className="p-3 border rounded-md bg-white dark:bg-gray-700">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            `Pay $${(amount / 100).toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
