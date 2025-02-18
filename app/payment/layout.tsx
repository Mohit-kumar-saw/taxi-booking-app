'use client'

import { SourceCordiContextProvider } from '@/context/SourceCordiContext'
import { DestinationCordiContextProvider } from '@/context/DestinationCordiContext'
import { DirectionDataContextProvider } from '@/context/DirectionDataContext'
import { SelectedCarAmountContextProvider } from '@/context/SelectedCarAmountContext'

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SourceCordiContextProvider>
      <DestinationCordiContextProvider>
        <DirectionDataContextProvider>
          <SelectedCarAmountContextProvider>
            {children}
          </SelectedCarAmountContextProvider>
        </DirectionDataContextProvider>
      </DestinationCordiContextProvider>
    </SourceCordiContextProvider>
  )
}
