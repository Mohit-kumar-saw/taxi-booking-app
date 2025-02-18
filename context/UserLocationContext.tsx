'use client'
import { createContext, useState } from 'react'

interface Coordinates {
  lng: number;
  lat: number;
}

interface UserLocationContextType {
  userLocation: Coordinates | null;
  setUserLocation: (location: Coordinates | null) => void;
}

export const UserLocationContext = createContext<UserLocationContextType>({
  userLocation: null,
  setUserLocation: () => {},
});

export function UserLocationContextProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  return (
    <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
      {children}
    </UserLocationContext.Provider>
  );
}
