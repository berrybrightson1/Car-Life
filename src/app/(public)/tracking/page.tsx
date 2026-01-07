"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PublicTrackingPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-3">
                <Link href="/" aria-label="Back">
                    <ArrowLeft size={24} className="text-gray-900" />
                </Link>
                <h1 className="font-bold text-lg text-gray-900">Track Order</h1>
            </header>

            <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-primary mb-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" /></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Track Your Ride</h2>
                <p className="text-gray-500 text-sm max-w-xs">
                    Enter your Order ID or VIN to see exactly where your car is in the shipping process.
                </p>

                <input
                    type="text"
                    placeholder="Enter Order ID or VIN"
                    className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />

                <button className="w-full max-w-sm bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform">
                    Find Shipment
                </button>
            </div>
        </div>
    );
}
