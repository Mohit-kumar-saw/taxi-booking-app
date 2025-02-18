'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import PaymentOptions from '@/components/Payment/PaymentOptions'

interface BookingData {
  carAmount: number;
  directionData: any;
  sourceCordinates: any;
  DestinationCordinates: any;
}

export default function PaymentPage() {
  const router = useRouter()
  const { isLoaded, userId, getToken } = useAuth()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setIsLoading(true)
        setError('')

        if (!isLoaded) return
        if (!userId) {
          router.push('/sign-in')
          return
        }

        const data = localStorage.getItem('bookingData')
        if (!data) {
          throw new Error('No booking data found')
        }

        const parsedData = JSON.parse(data)
        if (!parsedData.carAmount || !parsedData.directionData?.routes?.[0]) {
          throw new Error('Invalid booking data')
        }

        setBookingData(parsedData)

        const token = await getToken()
        if (!token) {
          throw new Error('Failed to get authentication token')
        }

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            amount: parsedData.carAmount,
          }),
        })

        const data2 = await response.json()

        if (!response.ok) {
          throw new Error(data2.error || 'Failed to create payment intent')
        }

        setClientSecret(data2.clientSecret)
      } catch (error) {
        console.error('Error loading booking data:', error)
        setError(error instanceof Error ? error.message : 'An unexpected error occurred')
        
        if (error instanceof Error && 
            (error.message.includes('No booking data') || 
             error.message.includes('Invalid booking'))) {
          router.push('/')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadBookingData()
  }, [router, isLoaded, userId, getToken])

  const handlePaymentSuccess = () => {
    // Clear booking data from localStorage since it's now in history
    localStorage.removeItem('bookingData')
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-red-600 text-xl font-semibold mb-4">Payment Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Return to Booking
          </button>
        </div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  const { carAmount, directionData } = bookingData
  const distance = (directionData.routes[0].distance / 1000).toFixed(1)
  const duration = Math.round(directionData.routes[0].duration / 60)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-yellow-400 p-6">
          <h1 className="text-2xl font-bold text-white">Booking Summary</h1>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Distance:</span>
              <span>{distance} km</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Duration:</span>
              <span>{duration} min</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2 dark:text-white">
              <span>Total Amount:</span>
              <span>₹{carAmount}</span>
            </div>
          </div>

          <div className="mt-6">
            <PaymentOptions 
              amount={carAmount}
              bookingData={bookingData}
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
