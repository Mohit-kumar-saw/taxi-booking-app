'use client'
import { useState } from 'react'
import { FaCreditCard, FaMoneyBill } from 'react-icons/fa'
import { SiPhonepe, SiGooglepay } from 'react-icons/si'
import { Elements } from '@stripe/react-stripe-js'
import CheckOutForm from './CheckOutForm'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { useAuth } from '@clerk/nextjs'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentOptionsProps {
  amount: number
  bookingData: any
  clientSecret: string
  onSuccess: () => void
}

const PaymentOptions = ({ amount, bookingData, clientSecret, onSuccess }: PaymentOptionsProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const { userId } = useAuth()

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: FaCreditCard },
    { id: 'upi', name: 'UPI', icon: SiPhonepe },
    { id: 'gpay', name: 'Google Pay', icon: SiGooglepay },
    { id: 'cash', name: 'Cash on Delivery', icon: FaMoneyBill },
  ]

  const handlePaymentSuccess = async () => {
    setIsLoading(true)
    
    try {
      // Save booking data to local storage
      const existingBookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]')
      const newBooking = {
        id: Date.now().toString(),
        userId,
        source: bookingData.source || 'Unknown',
        destination: bookingData.destination || 'Unknown',
        amount,
        bookingDate: new Date().toISOString(),
        carType: bookingData.carType || 'Standard',
        distance: (bookingData.directionData.routes[0].distance / 1000).toFixed(1),
        status: 'confirmed',
        paymentMethod: selectedMethod
      }
      
      existingBookings.push(newBooking)
      localStorage.setItem('bookingHistory', JSON.stringify(existingBookings))

      // Show success animation
      setTimeout(() => {
        setIsLoading(false)
        setIsSuccess(true)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        onSuccess()
      }, 1500)

      // Redirect to success page after animation
      setTimeout(() => {
        router.push('/booking/success')
      }, 3000)
    } catch (error) {
      console.error('Error saving booking:', error)
      setIsLoading(false)
    }
  }

  const handleCashPayment = () => {
    handlePaymentSuccess()
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#facc15',
    },
  }

  return (
    <div className="space-y-6">
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-green-500 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600">Redirecting to success page...</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your booking...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 transition-all
                  ${
                    selectedMethod === method.id
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-400'
                  }`}
              >
                <method.icon className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {method.name}
                </span>
              </button>
            ))}
          </div>

          {selectedMethod && (
            <div className="mt-6">
              {selectedMethod === 'card' && clientSecret && (
                <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                  <CheckOutForm amount={amount} onSuccess={handlePaymentSuccess} />
                </Elements>
              )}
              {(selectedMethod === 'upi' || selectedMethod === 'gpay') && (
                <div className="p-4 border rounded-lg">
                  <p className="text-gray-600 mb-4">
                    Please use your UPI app to scan the QR code or enter the UPI ID
                  </p>
                  {/* Add UPI QR code or ID here */}
                  <button
                    onClick={handlePaymentSuccess}
                    className="w-full bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500"
                  >
                    Confirm Payment
                  </button>
                </div>
              )}
              {selectedMethod === 'cash' && (
                <div className="p-4 border rounded-lg">
                  <p className="text-gray-600 mb-4">
                    Pay ₹{amount} in cash to the driver upon delivery
                  </p>
                  <button
                    onClick={handleCashPayment}
                    className="w-full bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PaymentOptions
