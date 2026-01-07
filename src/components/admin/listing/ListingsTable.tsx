```
"use client";

import { useState } from "react";
import { Edit2, MoreHorizontal, Trash2, Eye, Filter, Share2 } from "lucide-react";
import Link from "next/link";
import { Listing } from "@/lib/mock-db";
import FlyerModal from "./FlyerModal";
import Image from "next/image";
import CarPlaceholder from "@/components/ui/CarPlaceholder";

// MOCK DATA
const MOCK_LISTINGS = [
    {
        id: '1',
        make: 'Bentley',
        model: 'Flying Spur',
        year: '2022',
        price: 358174,
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=300',
        status: 'shipping', // shipping, arrived, sold, draft
        dateAdded: '2023-10-24'
    },
    {
        id: '2',
        make: 'Mercedes',
        model: 'G63 AMG',
        year: '2023',
        price: 450000,
        image: 'https://images.unsplash.com/photo-1520031441872-265149a4e69d?auto=format&fit=crop&q=80&w=300',
        status: 'arrived',
        dateAdded: '2023-11-02'
    },
    {
        id: '3',
        make: 'Audi',
        model: 'R8 V10',
        year: '2021',
        price: 285892,
        image: 'https://images.unsplash.com/photo-1603584173870-7b299f58927e?auto=format&fit=crop&q=80&w=300',
        status: 'sold',
        dateAdded: '2023-09-15'
    },
    {
        id: '4',
        make: 'Porsche',
        model: '911 GT3',
        year: '2023',
        price: 320000,
        image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=300',
        status: 'draft',
        dateAdded: '2023-11-05'
    },
    {
        id: '5',
        make: 'Range Rover',
        model: 'Autobiography',
        year: '2024',
        price: 210000,
        image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&q=80&w=300',
        status: 'shipping',
        dateAdded: '2023-11-01'
    }
];

const STATUS_STYLES = {
    shipping: "bg-blue-50 text-blue-600 border-blue-100",
    arrived: "bg-green-50 text-green-600 border-green-100",
    sold: "bg-gray-100 text-gray-500 border-gray-200",
    draft: "bg-orange-50 text-orange-600 border-orange-100"
};

export default function ListingsTable() {
    const [filter, setFilter] = useState('all');

    const filteredListings = MOCK_LISTINGS.filter(l => filter === 'all' || l.status === filter);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                {['all', 'shipping', 'arrived', 'draft', 'sold'].map(status => (
        <div className="pb-32 md:pb-0">
            <FlyerModal 
                listing={activeFlyerListing} 
                isOpen={!!activeFlyerListing} 
                onClose={() => setActiveFlyerListing(null)} 
            />

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                    {['all', 'shipping', 'arrived', 'draft', 'sold'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px - 4 py - 2 rounded - xl text - xs font - bold capitalize transition - all ${
    filter === status
        ? 'bg-black text-white'
        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
} `}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Desktop Table Header */}
                <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_1fr_60px] gap-4 p-4 bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <div>Img</div>
                    <div>Vehicle</div>
                    <div>Price</div>
                    <div>Status</div>
                    <div>Added</div>
                    <div className="text-right">Action</div>
                </div>

                {/* List Content */}
                <div className="grid grid-cols-1 md:block divide-y md:divide-y-0 divide-gray-100">
                    {filteredListings.map((item) => (
                        <div
                            key={item.id}
                            className="group transition-colors hover:bg-blue-50/30"
                        >
                            {/* Mobile Card View */}
                            <div className="p-4 flex gap-4 md:hidden relative">
                                {/* Image */}
                                <div className="w-24 h-24 rounded-xl overflow-hidden relative flex-shrink-0">
                                    <CarPlaceholder className="w-full h-full" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-gray-900 truncate pr-6">
                                                {item.make} {item.model}
                                            </div>
                                            <div className="flex -mt-2 -mr-2">
                                                <button 
                                                    onClick={() => setActiveFlyerListing(item as any)}
                                                    className="p-2 text-blue-600"
                                                >
                                                    <Share2 size={18} />
                                                </button>
                                                <button className="text-gray-400 p-2">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium mb-2">
                                            {item.year} • #{1000 + parseInt(item.id)}
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div className="font-bold text-lg text-gray-900">
                                            ${item.price.toLocaleString()}
                                        </div>
                                        <span className={`inline - flex items - center px - 2 py - 0.5 rounded - md text - [10px] font - bold border uppercase tracking - wide ${ STATUS_STYLES[item.status as keyof typeof STATUS_STYLES] } `}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Row View */}
                            <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_1fr_60px] gap-4 p-4 items-center border-b border-gray-50 last:border-0">
                                {/* Image */}
                                <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                                    <CarPlaceholder className="w-full h-full" />
                                </div>

                                {/* Vehicle */}
                                <div>
                                    <div className="font-bold text-gray-900">{item.make} {item.model}</div>
                                    <div className="text-xs text-gray-400 font-medium">{item.year} • Stock #{1000 + parseInt(item.id)}</div>
                                </div>

                                {/* Price */}
                                <div className="font-bold text-gray-900">${item.price.toLocaleString()}</div>

                                {/* Status */}
                                <div>
                                    <span className={`inline - flex items - center px - 2.5 py - 1 rounded - lg text - [10px] font - bold border uppercase tracking - wide ${ STATUS_STYLES[item.status as keyof typeof STATUS_STYLES] } `}>
                                        {item.status}
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="text-sm text-gray-500 font-medium">{item.dateAdded}</div>

                                {/* Actions */}
                                <div className="flex justify-end relative gap-1">
                                    <button
                                        onClick={() => setActiveFlyerListing(item as any)}
                                        className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Share Flyer"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                    <button
                                        className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                        aria-label="More Options"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredListings.length === 0 && (
                    <div className="p-12 text-center text-gray-400 font-medium">
                        No listings found for this filter.
                    </div>
                )}
            </div>
        </div>
    );
}
```
