"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CurrencyContextType {
  currency: string;
  rates: Record<string, number>;
  setCurrency: (curr: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState("RSD");
  const [rates, setRates] = useState<Record<string, number>>({ RSD: 1 });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/RSD");
        const data = await res.json();
        setRates({
          RSD: 1,
          EUR: data.rates.EUR,
          USD: data.rates.USD,
          CHF: data.rates.CHF,
          GBP: data.rates.GBP,
        });
      } catch (err) {
        console.error("Greška pri učitavanju kurseva", err);
      }
    };
    fetchRates();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, rates, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
};