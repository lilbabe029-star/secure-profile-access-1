import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { SUPPORTED_CURRENCIES } from '../lib/constants';

interface CurrencyContextType {
  convert: (usdAmount: number) => number;
  format: (usdAmount: number) => string;
  currentCurrency: string;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const selectedCurrency = useMemo(() => {
    const code = user?.currency || 'USD';
    return SUPPORTED_CURRENCIES.find(c => c.code === code) || SUPPORTED_CURRENCIES[0];
  }, [user?.currency]);

  const convert = (usdAmount: number) => {
    return usdAmount * selectedCurrency.rate;
  };

  const format = (usdAmount: number) => {
    const converted = convert(usdAmount);
    return `${selectedCurrency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      convert, 
      format, 
      currentCurrency: selectedCurrency.code,
      currencySymbol: selectedCurrency.symbol 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};