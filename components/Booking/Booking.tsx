'use client'
import React, { useContext } from 'react'
import AutocompleteAddress from './AutocompleteAddress'
import Cars from './Cars'
import { SelectedCarAmountContext } from '@/context/SelectedCarAmountContext'
import { DirectionDataContext } from '@/context/DirectionDataContext'
import { SourceCordiContext } from '@/context/SourceCordiContext'
import { DestinationCordiContext } from '@/context/DestinationCordiContext'

export default function Booking() {
  const { carAmount } = useContext(SelectedCarAmountContext)
  const { directionData } = useContext(DirectionDataContext)
  const { sourceCordinates } = useContext(SourceCordiContext)
  const { DestinationCordinates } = useContext(DestinationCordiContext)

  const handleBookNow = () => {
    if (!directionData?.routes?.[0]) {
      alert('Please select pickup and destination locations')
      return
    }
    
    if (!carAmount) {
      alert('Please select a car type')
      return
    }

    // Store booking data in localStorage
    const bookingData = {
      carAmount,
      directionData,
      sourceCordinates,
      DestinationCordinates
    }
    localStorage.setItem('bookingData', JSON.stringify(bookingData))

    // Navigate to payment page
    window.location.href = '/payment'
  }

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Book Your Ride</h2>
      <div className='space-y-6'>
        <div className='bg-purple-50 rounded-lg p-4'>
          <AutocompleteAddress />
        </div>
        
        <div className='bg-white rounded-lg'>
          <Cars />
        </div>
        
        {/* Book Now Button */}
        <button
          onClick={handleBookNow}
          disabled={!carAmount || !directionData?.routes?.[0]}
          className={`
            w-full py-4 rounded-lg text-white font-semibold text-lg
            transition-all duration-200 hover-scale
            ${carAmount && directionData?.routes?.[0]
              ? 'purple-gradient shadow-lg shadow-purple-500/30'
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          {carAmount && directionData?.routes?.[0]
            ? `Book Now - ₹${carAmount}`
            : 'Select pickup, destination and car'
          }
        </button>
      </div>
    </div>
  )
}
