'use client'
import { createContext, useState } from 'react'

interface Route {
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  distance: number;
  duration: number;
}

interface DirectionData {
  routes: Route[];
  code: string;
}

export interface DirectionDataContextType {
  directionData: DirectionData | null;
  setDirectionData: (data: DirectionData | null) => void;
}

export const DirectionDataContext = createContext<DirectionDataContextType>({
  directionData: null,
  setDirectionData: () => {},
});

export function DirectionDataContextProvider({ children }: { children: React.ReactNode }) {
  const [directionData, setDirectionData] = useState<DirectionData | null>(null);

  const handleSetDirectionData = (data: DirectionData | null) => {
    console.log('Setting direction data:', data);
    setDirectionData(data);
  };

  return (
    <DirectionDataContext.Provider value={{ directionData, setDirectionData: handleSetDirectionData }}>
      {children}
    </DirectionDataContext.Provider>
  );
}