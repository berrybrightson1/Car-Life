"use client";

import { useState } from "react";
import IOSNavigationStack from "@/components/mobile/IOSNavigationStack";
import { ArrowLeft } from "lucide-react";

export default function IOSNavigationExample() {
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    return (
        <div className="h-screen w-full max-w-md mx-auto border-x border-gray-200">
            <IOSNavigationStack
                onBack={() => setSelectedItem(null)}
                detailPage={
                    selectedItem !== null ? (
                        <div className="h-full flex flex-col bg-white">
                            <header className="p-4 border-b flex items-center gap-2">
                                <button onClick={() => setSelectedItem(null)} aria-label="Back">
                                    <ArrowLeft />
                                </button>
                                <h1 className="font-bold">Detail View {selectedItem}</h1>
                            </header>
                            <div className="flex-1 p-4 bg-gray-50">
                                <p>Swipe from the left edge to right to go back!</p>
                                <div className="mt-10 p-10 bg-blue-100 rounded-xl">
                                    Content for item {selectedItem}
                                </div>
                            </div>
                        </div>
                    ) : undefined
                }
            >
                {/* HOMEPAGE CONTENT */}
                <div className="h-full flex flex-col bg-gray-100 p-4 overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-6">Home Feed</h1>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedItem(i)}
                                className="w-full bg-white p-6 rounded-2xl shadow-sm text-left active:scale-95 transition-transform"
                            >
                                <span className="font-semibold">Open Item {i}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </IOSNavigationStack>
        </div>
    );
}
