'use client'
import { createContext, useState } from 'react'

interface Coordinates {
  lng: number;
  lat: number;
}

export interface DestinationContextType {
  DestinationCordinates: Coordinates | null;
  setDestinationCordinates: (coordinates: Coordinates | null) => void;
}

export const DestinationCordiContext = createContext<DestinationContextType>({
  DestinationCordinates: null,
  setDestinationCordinates: () => {},
});

export function DestinationCordiContextProvider({ children }: { children: React.ReactNode }) {
  const [DestinationCordinates, setDestinationCordinates] = useState<Coordinates | null>(null);

  return (
    <DestinationCordiContext.Provider value={{ DestinationCordinates, setDestinationCordinates }}>
      {children}
    </DestinationCordiContext.Provider>
  );
}
