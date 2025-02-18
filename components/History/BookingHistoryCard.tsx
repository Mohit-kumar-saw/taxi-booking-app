import { CalendarIcon, MapPinIcon, CurrencyRupeeIcon, TruckIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface Booking {
  id: number;
  date: string;
  amount: number;
  paymentMethod: string;
  source: string;
  destination: string;
  carType: string;
  distance: number;
  status: string;
}

interface BookingHistoryCardProps {
  booking: Booking;
}

export default function BookingHistoryCard({ booking }: BookingHistoryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {format(new Date(booking.date), 'PPP')}
            </span>
          </div>
          <span className="flex items-center text-green-600 font-semibold">
            <CurrencyRupeeIcon className="h-5 w-5 mr-1" />
            {booking.amount}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <MapPinIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
            <div className="flex flex-col">
              <span className="text-sm font-medium dark:text-white">From</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{booking.source}</span>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <MapPinIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
            <div className="flex flex-col">
              <span className="text-sm font-medium dark:text-white">To</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{booking.destination}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <TruckIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{booking.carType}</span>
          </div>
          <span className="px-2 py-1 text-xs font-semibold rounded-full" 
            style={{
              backgroundColor: booking.status === 'completed' ? '#dcfce7' : '#fee2e2',
              color: booking.status === 'completed' ? '#166534' : '#991b1b'
            }}
          >
            {booking.status}
          </span>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Payment: {booking.paymentMethod}
        </div>
      </div>
    </div>
  );
}
