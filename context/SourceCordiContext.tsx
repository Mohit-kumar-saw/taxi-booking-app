'use client'
import { createContext, useState } from 'react'

interface Coordinates {
  lng: number;
  lat: number;
}

export interface SourceContextType {
  sourceCordinates: Coordinates | null;
  setSourceCordinates: (coordinates: Coordinates | null) => void;
}

export const SourceCordiContext = createContext<SourceContextType>({
  sourceCordinates: null,
  setSourceCordinates: () => {},
});

export function SourceCordiContextProvider({ children }: { children: React.ReactNode }) {
  const [sourceCordinates, setSourceCordinates] = useState<Coordinates | null>(null);

  return (
    <SourceCordiContext.Provider value={{ sourceCordinates, setSourceCordinates }}>
      {children}
    </SourceCordiContext.Provider>
  );
}
