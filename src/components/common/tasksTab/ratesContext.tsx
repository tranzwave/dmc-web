import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the ratesMap context
interface RatesContextType {
  ratesMap: Map<string, string>;
  setRatesMap: React.Dispatch<React.SetStateAction<Map<string, string>>>;
}

// Create a context with a default value
const RatesContext = createContext<RatesContextType | undefined>(undefined);

// Create a Provider to wrap the app
export const RatesProvider = ({ children }: { children: ReactNode }) => {
  const [ratesMap, setRatesMap] = useState<Map<string, string>>(new Map());

  return (
    <RatesContext.Provider value={{ ratesMap, setRatesMap }}>
      {children}
    </RatesContext.Provider>
  );
};

// Custom hook to use the RatesContext
export const useRatesContext = (): RatesContextType => {
  const context = useContext(RatesContext);
  if (!context) {
    throw new Error("useRatesContext must be used within a RatesProvider");
  }
  return context;
};
