"use client";

import { motion } from "framer-motion";
import { Ship, Leaf, Fuel, Gauge, Share2 } from "lucide-react";
import Image from "next/image";
import CarPlaceholder from "@/components/ui/CarPlaceholder";
import { useCurrency } from "@/context/CurrencyContext";
// import { Listing } from "@/lib/mock-db"; // Removed
import ImageWithError from "@/components/ui/ImageWithError";

const WHATSAPP_NUMBER = "233551171353";

export default function FeedCard({ car, onClick }: { car: any; onClick?: () => void }) {

    const { convertPrice, symbol } = useCurrency(); // Hook

    const handleCheckout = () => {
        const title = `${car.make} ${car.model} ${car.year}`;
        const message = `Hello Car Life, I am interested in the ${title} listed for ${car.price}. Is it available?`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const title = `${car.make} ${car.model}`;
    const image = car.images && car.images.length > 0 ? car.images[0] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white rounded-[30px] p-4 shadow-sm border border-gray-100 mb-6 cursor-pointer transform transition-transform active:scale-[0.99]"
            onClick={onClick}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden mb-4 bg-gray-100">
                <ImageWithError car={car} />

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                    {car.status === 'shipping' ? (
                        <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold border border-white/10">
                            <Ship size={14} className="text-yellow-400" />
                            <span>ON HIGH SEAS</span>
                        </div>
                    ) : car.status === 'sold' ? (
                        <div className="bg-red-600/90 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold border border-white/10 shadow-lg shadow-red-500/20">
                            <span>SOLD</span>
                        </div>
                    ) : (
                        <div className="bg-green-500/90 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold border border-white/10">
                            <Leaf size={14} />
                            <span>IN GHANA</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                        className="bg-white/90 backdrop-blur p-2.5 rounded-full text-gray-700 shadow-lg active:scale-95 transition-transform"
                        aria-label="Share"
                    >
                        <Share2 size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight w-[65%] line-clamp-2">{title}</h2>
                    <div className="text-right flex-shrink-0 ml-4">
                        <div className={`${car.status === 'sold' ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white shadow-blue-200'} px-4 py-2 rounded-full shadow-md transition-colors`}>
                            <span className="block text-sm font-extrabold tracking-wide whitespace-nowrap">{symbol} {convertPrice(car.price)}</span>
                        </div>
                    </div>
                </div>

                {/* Specs Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1.5 bg-gray-50 rounded-lg text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 border border-gray-100">
                        <Fuel size={12} /> {car.fuel}
                    </span>
                    <span className="px-3 py-1.5 bg-gray-50 rounded-lg text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 border border-gray-100">
                        <Gauge size={12} /> {car.transmission}
                    </span>
                    <span className="px-3 py-1.5 bg-gray-50 rounded-lg text-[11px] font-semibold text-gray-500 flex items-center gap-1.5 border border-gray-100">
                        Details {car.year}
                    </span>
                </div>

                {/* CTA */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (car.status !== 'sold') handleCheckout();
                    }}
                    disabled={car.status === 'sold'}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2
                        ${car.status === 'sold'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-[#25D366] hover:bg-[#1ebc57] text-white shadow-green-200'}`}
                >
                    <span>{car.status === 'sold' ? 'Sold Out' : 'Buy on WhatsApp'}</span>
                </button>
            </div>
        </motion.div>
    );
}
