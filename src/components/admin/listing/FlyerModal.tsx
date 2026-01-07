"use client";

import { X, Download, Copy, Share2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Listing } from "@/lib/mock-db";
import { toast } from "sonner";

export default function FlyerModal({
    listing,
    isOpen,
    onClose
}: {
    listing: Listing | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen || !listing) return null;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://carlife.gh/store?id=${listing.id}`)}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`https://carlife.gh/store?id=${listing.id}`);
        toast.success("Link copied to clipboard!");
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
                >
                    {/* Header Controls */}
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Share2 size={18} className="text-blue-600" />
                            Share Flyer
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* FLYER PREVIEW CONTAINER */}
                    <div className="p-6 bg-gray-200 flex justify-center">
                        <div id="flyer-card" className="bg-white w-full rounded-2xl overflow-hidden shadow-lg relative aspect-[4/5] flex flex-col">

                            {/* Hero Image */}
                            <div className="h-1/2 relative">
                                <img
                                    src={listing.images[0] || listing.image}
                                    alt={listing.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                                    {listing.specs.year}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                                    <h2 className="text-white text-xl font-black leading-tight">{listing.name}</h2>
                                    <div className="flex items-center gap-1 text-gray-300 text-xs mt-1">
                                        <MapPin size={12} />
                                        <span>Available in Ghana</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details & QR */}
                            <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-b from-white to-blue-50">

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Price</span>
                                        <span className="text-blue-600 font-black text-lg">{listing.price}</span>
                                    </div>
                                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Condition</span>
                                        <span className="text-gray-900 font-bold text-sm truncate">{listing.specs.condition}</span>
                                    </div>
                                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Engine</span>
                                        <span className="text-gray-900 font-bold text-sm truncate">{listing.specs.fuel}</span>
                                    </div>
                                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Trans.</span>
                                        <span className="text-gray-900 font-bold text-sm truncate">{listing.specs.transmission}</span>
                                    </div>
                                </div>

                                {/* Footer / QR */}
                                <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-extrabold text-gray-900">Scan to View</span>
                                        <span className="text-[10px] text-gray-500">Visit Car Life Store for details.</span>
                                    </div>
                                    <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100">
                                        <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16 mix-blend-multiply" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 border-t border-gray-100 flex gap-3">
                        <button
                            onClick={handleCopyLink}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Copy size={16} />
                            Copy Link
                        </button>
                        <button
                            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                            onClick={() => toast.info("Screenshot this card to share!")}
                        >
                            <Download size={16} />
                            Save Image
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
