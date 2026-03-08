"use client";
import { useCurrency } from "./CurrencyProvider";

export default function CurrencySelect() {
  const { currency, setCurrency, rates } = useCurrency();

  // Ako rates još nisu učitani sa API-ja, prikazaćemo samo RSD
  const availableCurrencies = Object.keys(rates).length > 1 
    ? Object.keys(rates) 
    : ["RSD"];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Valuta</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs text-white outline-none cursor-pointer hover:bg-white/10 transition-all focus:border-pub-orange/50"
      >
        {availableCurrencies.map((curr) => (
          <option key={curr} value={curr} className="bg-[#0a1b30] text-white">
            {curr}
          </option>
        ))}
      </select>
    </div>
  );
}