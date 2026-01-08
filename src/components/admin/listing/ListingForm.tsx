"use client";

import { ListingData } from "@/app/(admin)/admin/listings/new/page";
import { Upload, X, ShieldCheck, Ship, Info, Sparkles, Globe, GripVertical } from "lucide-react";
import { useState } from "react";
import { Reorder } from "framer-motion";
import DescriptionGenerator from "@/components/admin/listing/DescriptionGenerator";
import { CAR_CATEGORIES } from "@/lib/utils";

export default function ListingForm({
    data,
    onChange,
    onFilesAdded
}: {
    data: ListingData;
    onChange: (d: ListingData) => void;
    onFilesAdded?: (files: File[]) => void;
}) {

    const handleChange = (field: keyof ListingData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleSpecChange = (field: string, value: string) => {
        onChange({ ...data, specs: { ...data.specs, [field]: value } });
    };

    return (
        <div className="max-w-2xl space-y-4">

            {/* MEDIA SECTION */}
            <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Upload size={18} /> Media
                </h3>

                <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group relative"
                    onClick={() => document.getElementById('image-upload-input')?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle dropped files
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            const files = Array.from(e.dataTransfer.files);
                            if (onFilesAdded) {
                                onFilesAdded(files);
                            } else {
                                const newUrls = files.map(file => URL.createObjectURL(file));
                                onChange({ ...data, images: [...data.images, ...newUrls] });
                            }
                        }
                    }}
                >
                    <input
                        type="file"
                        id="image-upload-input"
                        multiple
                        accept="image/*"
                        className="hidden"
                        aria-label="Upload vehicle images"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                const files = Array.from(e.target.files);
                                if (onFilesAdded) {
                                    onFilesAdded(files);
                                } else {
                                    const newUrls = files.map(file => URL.createObjectURL(file));
                                    onChange({ ...data, images: [...data.images, ...newUrls] });
                                }
                            }
                        }}
                    />
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Drag & Drop Photos</p>
                    <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                </div>

                {/* Image List (Mock) */}
                {/* Image List (Reorderable) */}
                {data.images.length > 0 && (
                    <Reorder.Group
                        axis="x"
                        values={data.images}
                        onReorder={(newOrder) => handleChange('images', newOrder)}
                        className="grid grid-cols-4 gap-3 mt-4"
                    >
                        {data.images.map((img, idx) => (
                            <Reorder.Item
                                key={img}
                                value={img}
                                className="aspect-square rounded-lg bg-gray-100 overflow-hidden relative group cursor-grab active:cursor-grabbing border border-gray-200"
                            >
                                <img src={img} alt="" className="w-full h-full object-cover pointer-events-none" />

                                {/* Drag Handle Indicator (Optional visual cue) */}
                                <div className="absolute top-1 left-1 bg-black/30 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <GripVertical size={12} />
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent drag start
                                        const newImages = [...data.images];
                                        newImages.splice(idx, 1);
                                        handleChange('images', newImages);
                                    }}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                    title="Remove Image"
                                >
                                    <X size={12} />
                                </button>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}

                {/* Temp helper to add mock image */}
                <button
                    onClick={() => handleChange('images', [...data.images, `https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=300&v=${Date.now()}`])}
                    className="text-xs text-blue-500 mt-2 underline"
                    type="button"
                >
                    + Add Mock Image
                </button>
            </section>

            {/* BASIC INFO */}
            <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info size={18} /> Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Make</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
                            placeholder="e.g. Bentley"
                            value={data.make}
                            onChange={(e) => handleChange("make", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Model</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
                            placeholder="e.g. Flying Spur"
                            value={data.model}
                            onChange={(e) => handleChange("model", e.target.value)}
                        />
                    </div>
                </div>

                {/* CATEGORY SELECTOR */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Category</label>
                    <div className="flex flex-wrap gap-2">
                        {CAR_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleChange('type', cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${data.type === cat
                                    ? 'bg-black text-white border-black shadow-lg'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Price</label>
                    <div className="flex gap-2">
                        <select
                            aria-label="Currency"
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary"
                            value={data.currency}
                            onChange={(e) => handleChange("currency", e.target.value)}
                        >
                            <option value="GHS">GHS ₵</option>
                            <option value="USD">USD $</option>
                        </select>
                        <div className="relative flex-1">
                            {/* <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span> */}
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-lg"
                                placeholder="0.00"
                                value={data.price}
                                onChange={(e) => handleChange("price", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <DescriptionGenerator
                        value={data.description}
                        onChange={(val) => handleChange("description", val)}
                        carName={`${data.make} ${data.model}`}
                    />
                </div>
            </section>

            {/* LOGISTICS & SPECS */}
            <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Ship size={18} /> Logistics & Specs
                </h3>

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => handleChange('status', 'shipping')}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${data.status === 'shipping' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400'}`}
                        type="button"
                    >
                        <Ship size={24} />
                        <span className="font-bold text-sm">On High Seas</span>
                    </button>
                    <button
                        onClick={() => handleChange('status', 'arrived')}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${data.status === 'arrived' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-100 text-gray-400'}`}
                        type="button"
                    >
                        <ShieldCheck size={24} />
                        <span className="font-bold text-sm">In Ghana</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {['year', 'fuel', 'transmission', 'mileage', 'color'].map((spec) => (
                        <div key={spec}>
                            <label htmlFor={`spec-${spec}`} className="block text-xs font-semibold text-gray-500 mb-1 capitalize">{spec}</label>
                            <input
                                id={`spec-${spec}`}
                                type="text"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium placeholder-gray-300"
                                placeholder={spec === 'mileage' ? 'e.g. 50,000 km' : ''}
                                value={(data.specs as any)[spec]}
                                onChange={(e) => handleSpecChange(spec, e.target.value)}
                            />
                        </div>
                    ))}

                    {/* Condition Toggle */}
                    <div className="col-span-2 mt-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-2">Vehicle Condition</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleSpecChange('condition', 'Brand New')}
                                className={`p-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${data.specs.condition === 'Brand New' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                            >
                                <Sparkles size={16} className={data.specs.condition === 'Brand New' ? 'text-yellow-500' : ''} />
                                Brand New
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSpecChange('condition', 'Foreign Used')}
                                className={`p-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${data.specs.condition === 'Foreign Used' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                            >
                                <Globe size={16} className={data.specs.condition === 'Foreign Used' ? 'text-blue-500' : ''} />
                                Foreign Used
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
