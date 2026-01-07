"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import FeedCard from "@/components/mobile/FeedCard";
import StoreSearch from "@/components/store/StoreSearch";
import IOSNavigationStack from "@/components/mobile/IOSNavigationStack";
import CarDetailView from "@/components/mobile/CarDetailView";

import { MockDB, Listing, CAR_CATEGORIES } from "@/lib/mock-db";
import ShippingCountries from "@/components/store/ShippingCountries";

export default function StorePage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [conditionFilter, setConditionFilter] = useState<'All' | 'Brand New' | 'Foreign Used'>('All');
    const [selectedCar, setSelectedCar] = useState<Listing | null>(null);

    useEffect(() => {
        // Initial load
        setListings(MockDB.getListings());

        // Poll for updates (Real-time syncing with admin)
        const interval = setInterval(() => {
            setListings(MockDB.getListings());
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const filteredCars = listings.filter(car => {
        const isPublished = car.status !== 'draft';
        const matchesCategory = categoryFilter === 'All' || car.type === categoryFilter;
        const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (car.specs?.year || '').includes(searchQuery);
        const matchesCondition = conditionFilter === 'All' || car.specs?.condition === conditionFilter;

        return isPublished && matchesCategory && matchesSearch && matchesCondition;
    });

    // The main content of the feed
    const FeedContent = (
        <div className="min-h-screen bg-gray-50/50">

            {/* Hero Section */}
            <div className="relative bg-white pt-24 pb-32 rounded-b-[40px] shadow-sm overflow-hidden mb-6">
                {/* Background Gradient */}
                <motion.div
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/30 to-cyan-300/20"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50/80 backdrop-blur-sm text-blue-600 font-bold text-xs tracking-wide mb-6 border border-blue-100">
                            TRUSTED BY 1000+ GHANAIANS 🇬🇭
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 mb-6 leading-tight drop-shadow-sm">
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Ride</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
                            Import custom vehicles directly to Ghana. Simple, transparent, and delivered to your doorstep.
                        </p>

                        <ShippingCountries />
                    </motion.div>
                </div>
            </div>


            {/* Floating Search Bar */}
            <div className="sticky top-4 z-30 px-4 -mt-16 mb-8">
                <div className="max-w-3xl mx-auto shadow-2xl shadow-blue-900/10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 p-2 ring-1 ring-gray-200/50 space-y-3">
                    <StoreSearch
                        value={searchQuery}
                        onChange={setSearchQuery}
                        selectedCategory={categoryFilter}
                        onCategoryChange={setCategoryFilter}
                    />

                    {/* Condition Toggles */}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {['All', 'Brand New', 'Foreign Used'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setConditionFilter(filter as any)}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${conditionFilter === filter
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8 pt-6">
                {filteredCars.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No cars found</h3>
                        <p className="text-gray-500">Try adjusting your search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                        {filteredCars.map(car => (
                            <FeedCard
                                key={car.id}
                                car={car}
                                onClick={() => setSelectedCar(car)}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center pb-20 md:pb-0">
                    <button className="bg-white border border-gray-200 px-8 py-3 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors text-gray-600 hover:text-primary">
                        View All Inventory
                    </button>
                    <p className="mt-4 text-xs text-gray-400">
                        Don't see what you want? Use the <span className="font-bold text-gray-600">Order Custom</span> button.
                    </p>
                </div>
            </div>
        </div >
    );

    return (
        <IOSNavigationStack
            onBack={() => setSelectedCar(null)}
            detailPage={
                selectedCar ? (
                    <CarDetailView car={selectedCar} onBack={() => setSelectedCar(null)} />
                ) : undefined
            }
        >
            {FeedContent}
        </IOSNavigationStack>
    );
}
