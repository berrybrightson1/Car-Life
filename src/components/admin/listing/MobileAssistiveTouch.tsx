"use client";

import { Eye, Edit3 } from "lucide-react";
import { motion } from "framer-motion";

interface MobileAssistiveTouchProps {
    view: 'edit' | 'preview' | 'drafts';
    onChange: (view: 'edit' | 'preview' | 'drafts') => void;
}

export default function MobileAssistiveTouch({ view, onChange }: MobileAssistiveTouchProps) {

    return (
        <div className="fixed bottom-28 right-1/2 translate-x-1/2 z-[100] md:hidden flex items-center gap-1 p-1 bg-white/90 backdrop-blur border border-gray-200 shadow-2xl rounded-full pointer-events-auto">
            <button
                onClick={() => onChange('edit')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all ${view === 'edit' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <Edit3 size={16} />
                <span>Edit</span>
            </button>
            <button
                onClick={() => onChange('preview')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all ${view === 'preview' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <span>Preview</span>
                <Eye size={16} />
            </button>
        </div>
    );
}
