'use client'
import React, { useState, useContext } from 'react'
import { DirectionDataContext } from '@/context/DirectionDataContext'
import { SelectedCarAmountContext } from '@/context/SelectedCarAmountContext'
import Image from 'next/image'
import CarsList from "@/app/data/CarsList";

export default function Cars() {
  const [selectedCar, setSelectedCar] = useState<number | null>(null)
  const { directionData } = useContext(DirectionDataContext)
  const { setCarAmount } = useContext(SelectedCarAmountContext)

  const calculateCost = (charges: number) => {
    if (!directionData?.routes?.[0]?.distance) return 0
    const baseFare = 50 // Base fare in rupees
    const perKmCharge = 15 // Per kilometer charge
    const distance = directionData.routes[0].distance / 1000 // Convert to kilometers
    return Math.round((baseFare + (distance * perKmCharge)) * charges)
  }

  const handleCarSelect = (carId: number, charges: number) => {
    setSelectedCar(carId)
    const cost = calculateCost(charges)
    setCarAmount(cost)
  }

  return (
    <div className='mt-6'>
      <h2 className='font-medium text-[14px] mb-3'>Select Car</h2>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {CarsList.map((car) => (
          <div
            key={car.id}
            className={`p-2 pb-3 border-[1px] rounded-md cursor-pointer hover:border-yellow-400 hover:scale-105 transition-all ${
              selectedCar === car.id ? 'border-yellow-400 bg-yellow-50' : ''
            }`}
            onClick={() => handleCarSelect(car.id, car.charges)}
          >
            <Image 
              src={car.image} 
              alt={car.name} 
              width={75} 
              height={75}
              className='w-full'
            />
            <h2 className='text-[12px] text-gray-500'>{car.name}</h2>
            {directionData?.routes?.[0]?.distance && (
              <span className='text-[12px] font-medium'>
                ₹{calculateCost(car.charges)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
