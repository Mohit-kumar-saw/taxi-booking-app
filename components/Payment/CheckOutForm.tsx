'use client'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckOutFormProps {
  amount: number
  onSuccess: () => void
}

export default function CheckOutForm({ amount, onSuccess }: CheckOutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/success`,
        },
      })

      if (error) {
        setErrorMessage(error.message || 'Payment failed')
      } else {
        onSuccess()
      }
    } catch (e) {
      setErrorMessage('An unexpected error occurred')
      console.error('Payment error:', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`
          w-full p-3 rounded-lg font-semibold text-white
          transition-all duration-200
          ${!stripe || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600'
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            <span className="ml-2">Processing...</span>
          </div>
        ) : (
          `Pay ₹${amount}`
        )}
      </button>
    </form>
  )
}
