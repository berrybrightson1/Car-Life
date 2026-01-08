"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Ship, Smartphone } from "lucide-react";
import { toast } from "sonner";
import MobilePreview from "@/components/admin/listing/MobilePreview";
import ListingForm from "@/components/admin/listing/ListingForm";
import MobileAssistiveTouch from "@/components/admin/listing/MobileAssistiveTouch";
import { createListing } from "@/app/actions/listings";
import { compressImage } from "@/lib/utils";

// Define strict types for the component state
export type ListingData = {
    make: string;
    model: string;
    description: string;
    price: string;
    currency: 'GHS' | 'USD';
    type: string; // Changed from custom type for flexibility
    specs: {
        year: string;
        fuel: string;
        transmission: string;
        condition: string;
        mileage: string;
        color: string;
    };
    status: 'shipping' | 'arrived';
    images: string[]; // Preview URLs
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

const CreateListingContent = () => {
    const [data, setData] = useState<ListingData>(INITIAL_DATA);
    const [uploadFiles, setUploadFiles] = useState<File[]>([]); // Store real files for upload
    const [mobileView, setMobileView] = useState<'edit' | 'preview' | 'drafts'>('edit');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Restore draft if requested (Logic preserved)
    useEffect(() => {
        if (searchParams.get('restore') === 'true') {
            const saved = localStorage.getItem('cl_current_edit');
            if (saved) {
                const parsed = JSON.parse(saved);
                setData(parsed);
            }
        }
    }, [searchParams]);

    const handleSaveDraft = () => {
        const drafts = JSON.parse(localStorage.getItem('cl_drafts') || '[]');
        const newDraft = { ...data, id: (data as any).id || Date.now(), savedAt: new Date().toISOString() };
        const filtered = drafts.filter((d: any) => d.id !== newDraft.id);
        localStorage.setItem('cl_drafts', JSON.stringify([newDraft, ...filtered]));
        toast.success("Draft saved to 'Drafts' folder!");
    };

    // New Handler for File Selection with Compression
    const handleFilesAdded = async (files: File[]) => {
        try {
            toast.loading("Compressing images...", { id: "compress-toast" }); // Add ID to dismiss

            const compressedFiles = await Promise.all(
                files.map(async (file) => {
                    return await compressImage(file);
                })
            );

            // Update state with new files appended
            setUploadFiles(prev => [...prev, ...compressedFiles]);

            // Create preview URLs
            const newPreviewUrls = compressedFiles.map(file => URL.createObjectURL(file));
            setData(prev => ({
                ...prev,
                images: [...prev.images, ...newPreviewUrls]
            }));

            toast.dismiss("compress-toast");
            toast.success(`Added ${files.length} images (Optimized)`);
        } catch (error) {
            console.error("Compression error:", error);
            toast.error("Failed to process images");
        }
    };

    const handlePublish = async () => {
        if (!data.make || !data.model || !data.price) {
            toast.error("Please fill in Make, Model and Price");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Publishing listing...");

        try {
            const formData = new FormData();
            formData.append("make", data.make);
            formData.append("model", data.model);
            formData.append("year", data.specs.year);
            formData.append("price", data.price.replace(/[^0-9.]/g, ''));
            formData.append("description", data.description);
            formData.append("category", data.type);
            formData.append("condition", data.specs.condition);
            formData.append("fuel", data.specs.fuel);
            formData.append("transmission", data.specs.transmission);
            formData.append("color", data.specs.color);
            formData.append("mileage", data.specs.mileage);

            // Append images
            uploadFiles.forEach((file) => {
                formData.append("images", file);
            });

            await createListing(formData);

            toast.dismiss(toastId);
            toast.success("Listing Published Successfully!");

            // Cleanup
            setUploadFiles([]);
            setData(INITIAL_DATA);
            localStorage.removeItem('cl_current_edit');

            // Redirect or Scroll
            window.scrollTo({ top: 0, behavior: 'smooth' });
            router.refresh();

        } catch (error: any) {
            console.error("Publish Error:", error);
            toast.dismiss(toastId);
            toast.error("Failed to publish listing: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddAnother = () => {
        if (confirm("Start a new listing? Unsaved changes will be lost.")) {
            setData(INITIAL_DATA);
            setUploadFiles([]);
            router.push('/admin/listings/new');
        }
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

                <ListingForm
                    data={data}
                    onChange={setData}
                    onFilesAdded={handleFilesAdded}
                />

                {/* Footer Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:flex gap-3 items-center">
                    <button
                        onClick={handleSaveDraft}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-sm disabled:opacity-50"
                    >
                        Save Draft
                    </button>

                    <button
                        onClick={handleAddAnother}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-sm disabled:opacity-50"
                    >
                        + Add Another
                    </button>

                    <button
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="col-span-2 md:col-span-1 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>Uploading...</>
                        ) : (
                            <>Publish Listing</>
                        )}
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
};

import { Suspense } from "react";

export default function NewListingPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading editor...</div>}>
            <CreateListingContent />
        </Suspense>
    );
}
