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
    <div className='p-5'>
      <h2 className='text-[20px] font-semibold'>Booking</h2>
      <div className='border-[1px] p-5 rounded-md'>
        <AutocompleteAddress />
        <Cars />
        
        {/* Book Now Button */}
        <button
          onClick={handleBookNow}
          disabled={!carAmount || !directionData?.routes?.[0]}
          className={`
            w-full mt-4 p-3 rounded-md text-white font-semibold text-lg
            transition-all duration-200
            ${carAmount && directionData?.routes?.[0]
              ? 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600'
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
