"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const COUNTRIES = [
    { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
    { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
    { code: "US", name: "USA", dial: "+1", flag: "🇺🇸" },
    { code: "GB", name: "UK", dial: "+44", flag: "🇬🇧" },
    { code: "TG", name: "Togo", dial: "+228", flag: "🇹🇬" },
    { code: "CI", name: "Ivory Coast", dial: "+225", flag: "🇨🇮" },
    { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
];

interface CountrySelectProps {
    value: string;
    onChange: (dial: string) => void;
}

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedCountry = COUNTRIES.find(c => c.dial === value) || COUNTRIES[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 h-full hover:bg-gray-100 transition-colors"
                type="button"
            >
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="text-sm font-bold text-gray-700">{selectedCountry.dial}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-64 overflow-y-auto"
                    >
                        {COUNTRIES.map((country) => (
                            <button
                                key={country.code}
                                onClick={() => {
                                    onChange(country.dial);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{country.flag}</span>
                                    <span className="text-sm font-medium text-gray-700">{country.name}</span>
                                    <span className="text-xs text-gray-400 font-mono">{country.dial}</span>
                                </div>
                                {value === country.dial && <Check size={14} className="text-primary" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
