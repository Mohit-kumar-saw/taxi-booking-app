'use client'

import { ThemeProvider } from '@/components/ThemeProvider'
import { SourceCordiContextProvider } from '@/context/SourceCordiContext'
import { DestinationCordiContextProvider } from '@/context/DestinationCordiContext'
import { DirectionDataContextProvider } from '@/context/DirectionDataContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SourceCordiContextProvider>
        <DestinationCordiContextProvider>
          <DirectionDataContextProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              {children}
            </div>
          </DirectionDataContextProvider>
        </DestinationCordiContextProvider>
      </SourceCordiContextProvider>
    </ThemeProvider>
  )
}
