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
              <main className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4">
                <div className="md:col-span-2">
                  <MapBox />
                </div>
                <div>
                  <Booking />
                </div>
              </main>
            </SelectedCarAmountContextProvider>
          </DirectionDataContextProvider>
        </DestinationCordiContextProvider>
      </SourceCordiContextProvider>
    </UserLocationContextProvider>
  )
}
