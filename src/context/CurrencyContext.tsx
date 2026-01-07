"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'GHS' | 'USD' | 'NGN' | 'Custom';

interface CurrencyContextType {
    currency: Currency;
    rate: number; // Rate relative to GHS (e.g., 1 GHS = X Currency)
    customRate: number;
    setCurrency: (c: Currency) => void;
    setCustomRate: (r: number) => void;
    convertPrice: (priceGHS: number | string) => string;
    symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Approximate rates (1 GHS = X)
// 1 USD approx 15.6 GHS -> 1 GHS = 0.064 USD
// 1 NGN approx 0.010 GHS -> 1 GHS = 98 NGN
const RATES = {
    GHS: 1,
    USD: 0.064,
    NGN: 100, // rough estimate
    Custom: 1
};

const SYMBOLS = {
    GHS: '₵',
    USD: '$',
    NGN: '₦',
    Custom: '*'
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('GHS');
    const [customRate, setCustomRate] = useState(1);

    // Persist to local storage
    useEffect(() => {
        const saved = localStorage.getItem('cl_currency');
        if (saved) {
            const parsed = JSON.parse(saved);
            setCurrency(parsed.currency);
            setCustomRate(parsed.customRate);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cl_currency', JSON.stringify({ currency, customRate }));
    }, [currency, customRate]);

    const rate = currency === 'Custom' ? customRate : RATES[currency];
    const symbol = SYMBOLS[currency];

    const convertPrice = (priceGHS: number | string) => {
        // Clean price string (remove commas)
        const val = typeof priceGHS === 'string'
            ? parseFloat(priceGHS.replace(/,/g, ''))
            : priceGHS;

        if (isNaN(val)) return 'N/A';

        const converted = val * rate;

        return converted.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    return (
        <CurrencyContext.Provider value={{ currency, rate, customRate, setCurrency, setCustomRate, convertPrice, symbol }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
