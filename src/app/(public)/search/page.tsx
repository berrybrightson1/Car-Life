"use client";

import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-bgBody pb-24">
            <header className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-3">
                <Link href="/" aria-label="Back">
                    <ArrowLeft size={24} className="text-gray-900" />
                </Link>
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search cars, brands, VINs..."
                        autoFocus
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </header>

            <div className="p-6 text-center text-gray-400 text-sm mt-10">
                Start typing to find your dream ride...
            </div>
        </div>
    );
}
