'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import BookingHistoryCard from '@/components/History/BookingHistoryCard'

interface Booking {
  id: number
  date: string
  amount: number
  paymentMethod: string
  source?: string
  destination?: string
  carType?: string
  distance?: number
  status?: string
  userId?: string
}

export default function HistoryPage() {
  const { isLoaded, userId } = useAuth()
  const [bookingData, setBookingData] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBookingHistory = () => {
      try {
        setIsLoading(true)
        const historyData = localStorage.getItem('bookingHistory')
        console.log('History Data:', historyData)
        
        if (!historyData) {
          setBookingData([])
          return
        }

        const parsedData = JSON.parse(historyData)
        console.log('Parsed Data:', parsedData)
        
        // Ensure we have an array and it has the expected structure
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setBookingData(parsedData)
        } else {
          console.error('Invalid booking data structure:', parsedData)
          setBookingData([])
        }
      } catch (error) {
        console.error('Error loading booking history:', error)
        setBookingData([])
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded) {
      loadBookingHistory()
    }
  }, [isLoaded, userId])

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  if (bookingData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">Booking History</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              No booking history found
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Booking History</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookingData.map((booking: Booking) => (
            <BookingHistoryCard 
              key={booking.id} 
              booking={{
                ...booking,
                bookingDate: booking.date,
                source: booking.source || 'N/A',
                destination: booking.destination || 'N/A',
                carType: booking.carType || 'Standard',
                distance: booking.distance || 0,
                status: booking.status || 'completed'
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}
