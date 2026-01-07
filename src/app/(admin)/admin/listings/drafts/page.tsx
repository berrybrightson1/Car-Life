"use client";

import { useEffect, useState } from "react";
import { ListingData } from "../new/page"; // We'll export this type
import { ArrowLeft, Calendar, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DraftsPage() {
    const [drafts, setDrafts] = useState<(ListingData & { id: number; savedAt: string })[]>([]);
    const router = useRouter();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('cl_drafts') || '[]');
        setDrafts(saved);
    }, []);

    const deleteDraft = (id: number) => {
        const updated = drafts.filter(d => d.id !== id);
        setDrafts(updated);
        localStorage.setItem('cl_drafts', JSON.stringify(updated));
    };

    const restoreDraft = (draft: any) => {
        // We'll pass the draft via query param or simple localStorage temp
        localStorage.setItem('cl_current_edit', JSON.stringify(draft));
        router.push('/admin/listings/new?restore=true');
    };

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen">
            <header className="mb-8">
                <Link href="/admin/listings/new" className="text-gray-500 hover:text-black flex items-center gap-2 text-sm font-bold mb-4">
                    <ArrowLeft size={16} />
                    Back to Creator Studio
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Saved Drafts</h1>
                <p className="text-gray-500 mt-2">Resume working on your saved listings.</p>
            </header>

            {drafts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No drafts found.</p>
                    <Link href="/admin/listings/new" className="text-primary font-bold mt-2 inline-block">Start a new listing</Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {drafts.map((draft) => (
                        <div key={draft.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                    Draft
                                </div>
                                <button
                                    onClick={() => deleteDraft(draft.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                                {draft.specs.year} {draft.make} {draft.model}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2 min-h-[40px]">
                                {draft.description || "No description..."}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-4 border-t border-gray-50 pt-3">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(draft.savedAt).toLocaleDateString()}
                                </div>
                                <div className="flex-1 text-right font-medium text-gray-900">
                                    {draft.currency} {draft.price}
                                </div>
                            </div>

                            <button
                                onClick={() => restoreDraft(draft)}
                                className="w-full mt-4 bg-black text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-gray-800 transition-colors"
                            >
                                <Edit3 size={14} />
                                Continue Editing
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
