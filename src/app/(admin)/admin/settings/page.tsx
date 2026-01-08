"use client";

import { Construction } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
            <Construction size={48} className="mb-4 opacity-50" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Settings Module Under Migration</h1>
            <p>This section is being updated to the new database architecture.</p>
        </div>
    );
}
