'use client'
import MapBox from '@/components/Map/MapBox'
import Booking from '@/components/Booking/Booking'
import { SourceCordiContextProvider } from '@/context/SourceCordiContext'
import { DestinationCordiContextProvider } from '@/context/DestinationCordiContext'
import { DirectionDataContextProvider } from '@/context/DirectionDataContext'
import { SelectedCarAmountContextProvider } from '@/context/SelectedCarAmountContext'
import { UserLocationContextProvider } from '@/context/UserLocationContext'

export default function Home() {
  return (
    <UserLocationContextProvider>
      <SourceCordiContextProvider>
        <DestinationCordiContextProvider>
          <DirectionDataContextProvider>
            <SelectedCarAmountContextProvider>
              <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 rounded-xl overflow-hidden shadow-lg">
                      <MapBox />
                    </div>
                    <div className="bg-white rounded-xl shadow-lg">
                      <Booking />
                    </div>
                  </div>
                </div>
              </main>
            </SelectedCarAmountContextProvider>
          </DirectionDataContextProvider>
        </DestinationCordiContextProvider>
      </SourceCordiContextProvider>
    </UserLocationContextProvider>
  )
}
