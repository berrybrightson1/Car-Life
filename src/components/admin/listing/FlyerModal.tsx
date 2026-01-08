"use client";

import { X, Download, Copy, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { Listing } from "@/lib/mock-db";
import { toast } from "sonner";

export default function FlyerModal({
    listing,
    isOpen,
    onClose
}: {
    listing: any | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen || !listing) return null;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://carlifeghana.app.com/store?id=${listing.id}`)}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`https://carlifeghana.app.com/store?id=${listing.id}`);
        toast.success("Link copied to clipboard!");
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
                onClick={onClose}
            >
                <div className="w-full max-w-sm flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>

                    {/* THE FLYER CARD */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white w-full rounded-[3px] overflow-hidden shadow-2xl relative flex flex-col aspect-[9/16]"
                        id="flyer-card"
                    >
                        {/* HERO SECTION */}
                        <div className="h-[55%] relative w-full bg-gray-100">
                            <img
                                src={listing.images?.[0] || listing.image}
                                alt={listing.make || listing.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay Logo */}
                            <div className="absolute top-4 left-4 w-32 drop-shadow-lg">
                                <img src="/assets/images/logo-white.png" alt="Car Life" className="w-full object-contain" />
                            </div>
                        </div>

                        {/* CONTENT SECTION */}
                        <div className="flex-1 px-8 pt-6 pb-8 bg-white flex flex-col">

                            {/* Title & Price Row */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1 pr-4">
                                    <h1 className="text-[28px] leading-[1.1] font-bold text-slate-900 tracking-tight">
                                        {listing.make || listing.name} {listing.model} {listing.year || listing.specs?.year}
                                    </h1>
                                </div>
                                <div className="bg-[#2563EB] text-white px-5 py-2 rounded-full font-bold text-xl shadow-blue-200/50 shadow-lg whitespace-nowrap">
                                    ₵ {listing.price}
                                </div>
                            </div>

                            {/* Specs Pills */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-slate-50 text-slate-600 px-4 py-2 rounded-lg font-semibold text-sm border border-slate-100 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20" /></svg>
                                    {listing.fuel || listing.specs?.fuel}
                                </span>
                                <span className="bg-slate-50 text-slate-600 px-4 py-2 rounded-lg font-semibold text-sm border border-slate-100 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                                    {listing.transmission || listing.specs?.transmission}
                                </span>
                                <span className="bg-slate-50 text-slate-600 px-4 py-2 rounded-lg font-semibold text-sm border border-slate-100">
                                    Details {listing.year || listing.specs?.year}
                                </span>
                            </div>

                            {/* Footer Area */}
                            <div className="mt-auto border-t border-slate-100 pt-6 flex items-center justify-between">
                                {/* QR Code */}
                                <div className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-20 h-20 flex-shrink-0">
                                    <img src={qrCodeUrl} alt="Scan to Order" className="w-full h-full" />
                                </div>

                                {/* Call to Action Text */}
                                <div className="text-right flex-1 pl-4">
                                    <h3 className="text-[#2563EB] font-bold text-2xl mb-1">Scan to Order</h3>
                                    <p className="text-slate-900 font-bold text-xs mb-1">Quick & Easy WhatsApp Checkout</p>
                                    <p className="text-slate-400 text-[10px] font-medium tracking-wide">carlifeghana.app.com</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ACTIONS (Outside Card) */}
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleCopyLink}
                            className="bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-xl font-semibold backdrop-blur-md transition-colors flex items-center gap-2 border border-white/10"
                        >
                            <Copy size={18} /> Copy Link
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-white/10 text-white hover:bg-white/20 px-6 py-3 rounded-xl font-semibold backdrop-blur-md transition-colors flex items-center gap-2 border border-white/10"
                        >
                            <X size={18} /> Close
                        </button>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
}
