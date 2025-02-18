'use client'
import React from 'react'
import { ClockIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'

interface Route {
  distance: number;
  duration: number;
}

interface DistanceTimeProps {
  route: Route;
}

// Car types and their base prices per km
const CAR_TYPES = {
  Economy: {
    basePrice: 8,
    pricePerKm: 12,
  },
  MiniVan: {
    basePrice: 12,
    pricePerKm: 15,
  },
  Comfort: {
    basePrice: 15,
    pricePerKm: 18,
  },
  Luxury: {
    basePrice: 20,
    pricePerKm: 25,
  },
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const calculatePrice = (distance: number, carType: keyof typeof CAR_TYPES): number => {
  const { basePrice, pricePerKm } = CAR_TYPES[carType];
  const distanceInKm = distance / 1000;
  return Math.round(basePrice + (pricePerKm * distanceInKm));
};

function DistanceTime({ route }: DistanceTimeProps) {
  if (!route || typeof route.distance !== 'number' || typeof route.duration !== 'number') {
    return null;
  }

  const distanceInKm = (route.distance / 1000).toFixed(1);
  const duration = formatDuration(route.duration);

  return (
    <div className="space-y-4 min-w-[200px] max-w-[300px]">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <ArrowsRightLeftIcon className="h-5 w-5" />
            <span>Distance:</span>
          </div>
          <span className="font-medium">{distanceInKm} km</span>
        </div>
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5" />
            <span>Duration:</span>
          </div>
          <span className="font-medium">{duration}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-sm font-medium mb-3 dark:text-white">Estimated Fares:</h3>
        <div className="space-y-2">
          {Object.entries(CAR_TYPES).map(([type]) => (
            <div key={type} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">{type}</span>
              <span className="font-medium dark:text-white">
                ₹{calculatePrice(route.distance, type as keyof typeof CAR_TYPES)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DistanceTime
