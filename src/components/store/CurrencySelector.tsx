"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { ChevronDown, Coins } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CurrencySelector() {
    const { currency, setCurrency, setCustomRate, customRate } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currencies = ['GHS', 'USD', 'NGN', 'Custom'] as const;

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full text-sm font-bold text-gray-700 transition-colors border border-gray-100"
            >
                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs">
                    {currency === 'GHS' && '🇬🇭'}
                    {currency === 'USD' && '🇺🇸'}
                    {currency === 'NGN' && '🇳🇬'}
                    {currency === 'Custom' && '⚙️'}
                </div>
                <span>{currency}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 overflow-hidden"
                    >
                        {currencies.map((c) => (
                            <button
                                key={c}
                                onClick={() => {
                                    setCurrency(c);
                                    if (c !== 'Custom') setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currency === c ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <span className="text-base">
                                    {c === 'GHS' && '🇬🇭'}
                                    {c === 'USD' && '🇺🇸'}
                                    {c === 'NGN' && '🇳🇬'}
                                    {c === 'Custom' && '⚙️'}
                                </span>
                                {c}
                            </button>
                        ))}

                        {currency === 'Custom' && (
                            <div className="mt-2 pt-2 border-t border-gray-100 px-2 pb-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Custom Rate (1 GHS = ?)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={customRate}
                                        onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:border-blue-500"
                                        placeholder="Rate"
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
