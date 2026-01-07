"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { CAR_CATEGORIES } from "@/lib/mock-db";

export default function StoreSearch({
    value,
    onChange,
    selectedCategory,
    onCategoryChange
}: {
    value: string;
    onChange: (val: string) => void;
    selectedCategory: string;
    onCategoryChange: (cat: string) => void;
}) {
    return (
        <div className="w-full">
            <div className="flex gap-3">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search custom rides..."
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-500"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
                <button
                    className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                    aria-label="Toggle Filters"
                >
                    <SlidersHorizontal size={18} />
                </button>
            </div>

            {/* Compact Category Pills */}
            <div className="mt-2.5 flex gap-2 overflow-x-auto no-scrollbar mask-gradient-r pb-1">
                {['All', ...CAR_CATEGORIES].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${selectedCategory === cat
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
