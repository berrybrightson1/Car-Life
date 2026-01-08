"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, Ship, Leaf, Fuel, Gauge, Calendar, Info, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import CarPlaceholder from "@/components/ui/CarPlaceholder";
// import { Listing } from "@/lib/mock-db"; // Removed

interface CarDetailViewProps {
    car: any; // Prisma Car
    onBack: () => void;
}

const WHATSAPP_NUMBER = "233551171353";

export default function CarDetailView({ car, onBack }: CarDetailViewProps) {

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const images = car.images && car.images.length > 0 ? car.images : [];
    // Fallback if no images, handle in UI using Placeholder or empty

    // Reset index when car changes
    useEffect(() => {
        setActiveImageIndex(0);
    }, [car.id]);

    const handleNext = () => {
        if (images.length === 0) return;
        setActiveImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        if (images.length === 0) return;
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const title = `${car.make} ${car.model} ${car.year}`;

    const handleCheckout = () => {
        const message = `Hello Car Life, I am interested in the ${title} listed for ${car.price}. Is it available?`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-y-auto pb-safe">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"
                    aria-label="Back to Inventory"
                >
                    <ArrowLeft size={24} className="text-gray-900" />
                </button>
                <span className="font-semibold text-sm opacity-0 animate-fade-in">{title}</span>
                <button
                    className="p-2 -mr-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"
                    aria-label="Share this listing"
                >
                    <Share2 size={24} className="text-gray-900" />
                </button>
            </div>

            {/* Hero Image Carousel */}
            <div className="relative w-full aspect-[4/3] bg-black group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full"
                    >
                        {images[activeImageIndex] ? (
                            <img
                                src={images[activeImageIndex]}
                                alt={`${title} - View ${activeImageIndex + 1}`}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <CarPlaceholder className="w-full h-full" />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-all active:scale-95"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-all active:scale-95"
                            aria-label="Next image"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {/* Dot Indicators */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                        {images.map((_: any, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === activeImageIndex
                                    ? "bg-white w-4"
                                    : "bg-white/50 hover:bg-white/80"
                                    }`}
                                aria-label={`View image ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}

                <div className="absolute top-4 right-4 z-10">
                    {car.status === 'shipping' ? (
                        <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold border border-white/10 shadow-lg">
                            <Ship size={14} className="text-yellow-400" />
                            <span>ON HIGH SEAS</span>
                        </div>
                    ) : (
                        <div className="bg-green-500/90 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold border border-white/10 shadow-lg">
                            <Leaf size={14} />
                            <span>IN GHANA</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 flex flex-col gap-6">
                {/* Title & Price */}
                <div>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-primary text-[11px] font-bold rounded-full mb-3">
                        VERIFIED LISTING
                    </span>
                    <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">{title}</h1>
                    <div className="mt-2 inline-flex bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg shadow-blue-200">
                        <h2 className="text-2xl font-extrabold tracking-wide">₵ {car.price}</h2>
                    </div>
                </div>

                {/* Logistics Card (if shipping) */}
                {car.status === 'shipping' && (
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-4 items-start">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <Ship size={24} className="text-yellow-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Logistics Status</h4>
                            <p className="text-xs text-yellow-800 mt-1 font-medium">Container: MSC-8829-CN</p>
                            <p className="text-xs text-yellow-700 mt-0.5">Est. Arrival: 15 Aug</p>
                        </div>
                    </div>
                )}

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-2">
                        <Calendar className="text-gray-400" size={20} />
                        <span className="text-xs text-gray-500 font-medium">Year</span>
                        <span className="font-bold text-gray-900">{car.year}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-2">
                        <Fuel className="text-gray-400" size={20} />
                        <span className="text-xs text-gray-500 font-medium">Fuel Type</span>
                        <span className="font-bold text-gray-900">{car.fuel}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-2">
                        <Gauge className="text-gray-400" size={20} />
                        <span className="text-xs text-gray-500 font-medium">Transmission</span>
                        <span className="font-bold text-gray-900">{car.transmission}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-2">
                        <Info className="text-gray-400" size={20} />
                        <span className="text-xs text-gray-500 font-medium">Condition</span>
                        <span className="font-bold text-gray-900">{car.condition}</span>
                    </div>
                </div>

                {/* Description */}
                {car.description && (
                    <div className="bg-gray-50 rounded-2xl p-5">
                        <h3 className="font-bold text-gray-900 mb-2">Vehicle Overview</h3>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {car.description}
                        </p>
                    </div>
                )}

                {/* Re-positioned CTA */}
                <button
                    onClick={handleCheckout}
                    className="w-full bg-[#25D366] hover:bg-[#1ebc57] text-white py-4 rounded-2xl font-bold text-lg tracking-wide shadow-lg shadow-green-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                >
                    <Share2 className="rotate-90" size={20} />
                    <span>Buy on WhatsApp</span>
                </button>

                {/* Bottom Spacer */}
                <div className="h-10" />
            </div>
        </div>
    );
}
