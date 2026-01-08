"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Ship, Smartphone } from "lucide-react";
import { toast } from "sonner";
import MobilePreview from "@/components/admin/listing/MobilePreview";
import ListingForm from "@/components/admin/listing/ListingForm";
import MobileAssistiveTouch from "@/components/admin/listing/MobileAssistiveTouch";
import { MockDB, CarCategory } from "@/lib/mock-db";

export type ListingData = {
    make: string;
    model: string;
    description: string;
    price: string;
    currency: 'GHS' | 'USD';
    type: CarCategory;
    specs: {
        year: string;
        fuel: string;
        transmission: string;
        condition: string;
        mileage: string;
        color: string;
    };
    status: 'shipping' | 'arrived';
    images: string[]; // URLs
};

const INITIAL_DATA: ListingData = {
    make: "",
    model: "",
    description: "Mint condition, single owner.",
    price: "",
    currency: "GHS",
    type: "Luxury",
    specs: {
        year: new Date().getFullYear().toString(),
        fuel: "Petrol",
        transmission: "Automatic",
        condition: "Foreign Used",
        mileage: "",
        color: "",
    },
    status: 'shipping',
    images: [],
};

export default function CreatorStudioPage() {
    const [data, setData] = useState<ListingData>(INITIAL_DATA);
    const [mobileView, setMobileView] = useState<'edit' | 'preview' | 'drafts'>('edit');

    const router = useRouter();
    const searchParams = useSearchParams();

    // Restore draft if requested
    useEffect(() => {
        if (searchParams.get('restore') === 'true') {
            const saved = localStorage.getItem('cl_current_edit');
            if (saved) {
                setData(JSON.parse(saved));
                // Clear the temp storage so refresh doesn't keep restoring old state unexpectedly? 
                // Actually keep it for safety until explicit clear.
            }
        }
    }, [searchParams]);

    const handleSaveDraft = () => {
        const drafts = JSON.parse(localStorage.getItem('cl_drafts') || '[]');
        // Update existing if ID match or create new
        const newDraft = { ...data, id: (data as any).id || Date.now(), savedAt: new Date().toISOString() };

        // Remove old version of this draft if exists
        const filtered = drafts.filter((d: any) => d.id !== newDraft.id);

        localStorage.setItem('cl_drafts', JSON.stringify([newDraft, ...filtered]));
        toast.success("Draft saved to 'Drafts' folder!");
    };

    // Helper to compress images for localStorage
    const compressImage = async (blobUrl: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = blobUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('No canvas context');

                // Max dimensions
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                // Compress to JPEG 0.6
                resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.onerror = (err) => reject(err);
        });
    };

    const handlePublish = async () => {
        const toastId = toast.loading("Processing images...");

        try {
            // Convert and compress images
            const processedImages = await Promise.all(data.images.map(async (img) => {
                if (img.startsWith('blob:')) {
                    try {
                        return await compressImage(img);
                    } catch (e) {
                        console.error("Failed to compress image:", e);
                        return img; // Fallback
                    }
                }
                return img;
            }));

            MockDB.saveListing({ ...data, images: processedImages });
            toast.dismiss(toastId);
            toast.success("Listing Published to Marketplace!");
            setData(INITIAL_DATA);
            localStorage.removeItem('cl_current_edit');
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error: any) {
            console.error("Publish Error:", error);
            toast.dismiss(toastId);
            if (error.name === 'QuotaExceededError' || error.message?.includes('exceeded')) {
                toast.error("Storage Full! Images are too big.", {
                    description: "Try removing some photos or using smaller ones."
                });
            } else {
                toast.error("Failed to publish listing.");
            }
        }
    };

    const handleAddAnother = () => {
        toast("Start a new listing?", {
            description: "Unsaved changes will be lost.",
            action: {
                label: "Yes, Clear Form",
                onClick: () => {
                    setData(INITIAL_DATA);
                    router.push('/admin/listings/new');
                }
            },
            cancel: {
                label: "Cancel",
                onClick: () => { }
            }
        });
    };

    return (
        <div className="md:h-[calc(100vh-64px)] md:overflow-hidden flex flex-col md:flex-row bg-gray-50 relative min-h-screen md:min-h-0">

            <MobileAssistiveTouch view={mobileView} onChange={setMobileView} />

            {/* LEFT: Editor Area */}
            <div className={`flex-1 md:overflow-y-auto p-4 md:p-10 pb-36 scrollbar-thin transition-opacity ${mobileView === 'preview' ? 'hidden md:block' : 'block'}`}>
                <header className="mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1">
                        <span>Listings</span>
                        <span>/</span>
                        <Link href="/admin/listings/drafts" className="hover:text-primary transition-colors">Drafts</Link>
                        <span>/</span>
                        <span className="text-gray-900">New Listing</span>
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Creator Studio
                        </h1>
                        <p className="text-gray-500 mt-1 md:mt-2 text-sm md:text-base">
                            Craft the perfect listing.
                        </p>
                    </div>
                </header>

                <ListingForm data={data} onChange={setData} />

                {/* Footer Actions (Static at bottom of form) */}
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:flex gap-3 items-center">
                    <button
                        onClick={handleSaveDraft}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-sm"
                    >
                        Save Draft
                    </button>

                    <button
                        onClick={handleAddAnother}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-sm"
                    >
                        + Add Another
                    </button>

                    <button
                        onClick={handlePublish}
                        className="col-span-2 md:col-span-1 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                    >
                        Publish Listing
                    </button>
                </div>
            </div>

            {/* RIGHT: Live Preview Area (Desktop) */}
            <div className="w-[420px] bg-white border-l border-gray-200 hidden md:flex flex-col relative z-20 shadow-xl">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                        <Smartphone size={14} />
                        Live Mobile Preview
                    </div>
                    <span className="text-[10px] text-gray-400">iPhone 13 Pro</span>
                </div>

                <div className="flex-1 bg-gray-100 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    <MobilePreview data={data} />
                </div>
            </div>

            {/* MOBILE ONLY: Full Screen Live Preview */}
            <div className={`md:hidden absolute inset-0 bg-gray-100 z-30 flex flex-col ${mobileView === 'preview' ? 'fixed' : 'hidden'}`}>
                <div className="flex-1 w-full h-full flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    <div className="scale-90 sm:scale-100 transition-transform origin-center">
                        <MobilePreview data={data} />
                    </div>
                </div>
            </div>

        </div>
    );
}
