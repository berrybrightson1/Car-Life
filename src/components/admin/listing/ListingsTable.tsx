"use client";

import { useState } from "react";
import { MoreHorizontal, Share2, Edit, Trash2, CheckCircle } from "lucide-react";
import { Listing } from "@/lib/mock-db";
import FlyerModal from "./FlyerModal";
import CarPlaceholder from "@/components/ui/CarPlaceholder";
import ImageWithError from "@/components/ui/ImageWithError";

const STATUS_STYLES = {
    shipping: "bg-blue-50 text-blue-600 border-blue-100",
    arrived: "bg-green-50 text-green-600 border-green-100",
    sold: "bg-gray-100 text-gray-500 border-gray-200",
    draft: "bg-orange-50 text-orange-600 border-orange-100"
};

interface ListingsTableProps {
    listings: Listing[];
    onEdit: (listing: Listing) => void;
    onDelete: (id: string) => void;
    onUpdate?: (id: string, updates: Partial<Listing>) => void;
}

export default function ListingsTable({ listings, onEdit, onDelete, onUpdate }: ListingsTableProps) {
    const [filter, setFilter] = useState('all');
    const [activeFlyerListing, setActiveFlyerListing] = useState<Listing | null>(null);

    const filteredListings = listings.filter(l => filter === 'all' || l.status === filter);

    return (
        <div className="pb-32 md:pb-0 relative">
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
                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filter === status
                                ? 'bg-black text-white'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Desktop Table Header */}
                <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_1fr_100px] gap-4 p-4 bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <div>Img</div>
                    <div>Vehicle</div>
                    <div>Price</div>
                    <div>Status</div>
                    <div>Added</div>
                    <div className="text-right">Actions</div>
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
                                <div className="w-24 h-24 rounded-xl overflow-hidden relative flex-shrink-0 bg-gray-100">
                                    <ImageWithError car={item} className="w-full h-full object-cover absolute inset-0" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-gray-900 truncate pr-6">
                                                {item.name}
                                            </div>
                                            <div className="flex -mt-2 -mr-2">
                                                <button
                                                    onClick={() => setActiveFlyerListing(item)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Share2 size={18} />
                                                </button>
                                                <button onClick={() => onEdit(item)} className="text-gray-400 p-2 hover:text-gray-900">
                                                    <Edit size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium mb-2">
                                            {item.specs.year} • #{1000 + parseInt(item.id)}
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div className="font-bold text-lg text-gray-900">
                                            {item.price}
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wide ${STATUS_STYLES[item.status as keyof typeof STATUS_STYLES] || 'bg-gray-100 text-gray-500'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Row View */}
                            <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_1fr_100px] gap-4 p-4 items-center border-b border-gray-50 last:border-0 h-[88px]">
                                {/* Image */}
                                <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-gray-100">
                                    <ImageWithError car={item} className="w-full h-full object-cover absolute inset-0" />
                                </div>

                                {/* Vehicle */}
                                <div>
                                    <div className="font-bold text-gray-900">{item.name}</div>
                                    <div className="text-xs text-gray-400 font-medium">{item.specs.year} • Stock #{1000 + parseInt(item.id)}</div>
                                </div>

                                {/* Price */}
                                <div className="font-bold text-gray-900">
                                    {typeof item.price === 'number'
                                        ? item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '')
                                        : item.price}
                                </div>

                                {/* Status */}
                                <div>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wide ${STATUS_STYLES[item.status as keyof typeof STATUS_STYLES] || 'bg-gray-100 text-gray-500'}`}>
                                        {item.status}
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="text-sm text-gray-500 font-medium">{item.dateAdded}</div>

                                {/* Actions */}
                                <div className="flex justify-end relative gap-1">
                                    <button
                                        onClick={() => onUpdate && onUpdate(item.id, { status: item.status === 'sold' ? 'arrived' : 'sold' })}
                                        className={`p-2 rounded-lg transition-colors ${item.status === 'sold'
                                            ? 'text-green-600 hover:bg-green-50'
                                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                                        title={item.status === 'sold' ? "Mark Available" : "Mark Sold"}
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                    <button
                                        onClick={() => setActiveFlyerListing(item)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Share Flyer"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
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
