'use client'
import { createContext, useState } from 'react'

interface SelectedCarAmountContextType {
  carAmount: number | null;
  setCarAmount: (amount: number | null) => void;
}

const defaultContext: SelectedCarAmountContextType = {
  carAmount: null,
  setCarAmount: () => {},
};

export const SelectedCarAmountContext = createContext<SelectedCarAmountContextType>(defaultContext);

export function SelectedCarAmountContextProvider({ children }: { children: React.ReactNode }) {
  const [carAmount, setCarAmount] = useState<number | null>(null);

  return (
    <SelectedCarAmountContext.Provider value={{ carAmount, setCarAmount }}>
      {children}
    </SelectedCarAmountContext.Provider>
  );
}