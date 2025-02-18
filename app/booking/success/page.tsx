'use client'
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get('payment_intent');

  useEffect(() => {
    if (paymentIntent) {
      // You can make an API call here to verify the payment status
      // and update your database accordingly
    }
  }, [paymentIntent]);

  useEffect(() => {
    // Clear booking data from localStorage
    localStorage.removeItem('bookingData')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-5">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Payment Successful!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Thank you for your booking. Your taxi will arrive shortly.
        </p>
        <div className="space-y-4">
          <Link
            href="/history"
            className="block w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            View Booking History
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Book Another Ride
          </Link>
        </div>
      </div>
    </div>
  );
}
