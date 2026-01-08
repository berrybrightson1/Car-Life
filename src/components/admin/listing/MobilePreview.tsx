"use client";

import FeedCard from "@/components/mobile/FeedCard";
import { ListingData } from "@/app/(admin)/admin/listings/new/page";

export default function MobilePreview({ data }: { data: ListingData }) {

    // Map ListingData to the format FeedCard expects
    const previewCar = {
        id: 'preview',
        name: `${data.make} ${data.model}`.trim() || "Your Car Name",
        price: data.price || "0",
        image: data.images[0] || "https://images.unsplash.com/photo-1560156713-ef3765e10085?auto=format&fit=crop&q=80&w=800", // Placeholder
        status: data.status,
        type: data.type || 'Luxury',
        images: data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1560156713-ef3765e10085?auto=format&fit=crop&q=80&w=800"],
        dateAdded: new Date().toLocaleDateString(),
        specs: {
            year: data.specs.year,
            fuel: data.specs.fuel,
            transmission: data.specs.transmission,
            condition: data.specs.condition
        }
    };

    return (
        <div className="w-[320px] h-[640px] bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-900 overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-xl z-50"></div>

            {/* Screen Content */}
            <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pt-10 pb-4">
                <div className="px-4 mb-4">
                    <h3 className="font-extrabold text-lg text-gray-900">Feed Preview</h3>
                </div>

                <div className="px-4">
                    <FeedCard car={previewCar} onClick={() => { }} />
                </div>

                {/* Mock other content to make it look realistic */}
                <div className="px-4 mt-6 opacity-30 pointer-events-none grayscale">
                    <div className="h-64 bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
                        <div className="bg-gray-200 h-40 rounded-xl mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full z-50"></div>
        </div>
    );
}
