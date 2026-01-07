"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-3">
                <Link href="/" aria-label="Back">
                    <ArrowLeft size={24} className="text-gray-900" />
                </Link>
                <h1 className="font-bold text-lg text-gray-900">Your Cart</h1>
            </header>

            <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                    <ShoppingBag size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Your Garage is Empty</h2>
                <p className="text-gray-500 text-sm max-w-xs">
                    You haven't added any cars to your cart yet. Browse our inventory to find your dream ride.
                </p>

                <Link href="/" className="px-8 py-3 bg-black text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform">
                    Browse Inventory
                </Link>
            </div>
        </div>
    );
}
