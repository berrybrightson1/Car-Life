"use client";

import MobileNav from "@/components/layout/MobileNav";
import OrderCustomModal from "@/components/store/OrderCustomModal";
import Link from 'next/link';
import { useState } from "react";
import { usePathname } from "next/navigation";
import CurrencySelector from "@/components/store/CurrencySelector";

import MikeWidget from "@/components/common/MikeWidget";

export default function StoreShell({ children }: { children: React.ReactNode }) {
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-bgBody">
            <OrderCustomModal
                isOpen={isCustomModalOpen}
                onClose={() => setIsCustomModalOpen(false)}
            />

            {/* Public Header (Desktop) */}
            <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b sticky top-0 z-40 shadow-sm">
                <Link href="/" className="font-extrabold text-2xl tracking-tight text-primary flex items-center gap-2">
                    <img src="/assets/images/logo-full.png" alt="Car Life Logo" className="h-8 object-contain" />
                </Link>

                <nav className="flex gap-8 text-sm font-bold text-gray-500">
                    <Link href="/" className={`transition-colors py-1 border-b-2 ${usePathname() === '/' ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-primary'}`}>Inventory</Link>
                    <Link href="/tracking" className={`transition-colors py-1 border-b-2 ${usePathname() === '/tracking' ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-primary'}`}>Tracking</Link>
                    <Link href="/how-it-works" className={`transition-colors py-1 border-b-2 ${usePathname() === '/how-it-works' ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-primary'}`}>How it Works</Link>
                    <Link href="/about" className={`transition-colors py-1 border-b-2 ${usePathname() === '/about' ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-primary'}`}>About Us</Link>
                    <a href="#" className="hover:text-primary transition-colors border-b-2 border-transparent hover:border-transparent py-1">Contact</a>
                </nav>

                <div className="flex items-center gap-4">
                    <CurrencySelector />
                    <button
                        onClick={() => setIsCustomModalOpen(true)}
                        className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                        Order Custom
                    </button>
                </div>
            </header>

            {/* Mobile Brand Header */}
            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
                <Link href="/">
                    <img src="/assets/images/logo-full.png" alt="Car Life Logo" className="h-6 object-contain" />
                </Link>




                <div className="flex items-center gap-2">
                    <CurrencySelector />
                    <button
                        onClick={() => setIsCustomModalOpen(true)}
                        className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-md active:scale-90 transition-transform dark:bg-white dark:text-black"
                        aria-label="Order Custom Car"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>
            </header>

            <main className="flex-1 relative flex flex-col md:pb-0 h-[calc(100vh-64px)] md:h-screen overflow-hidden">
                {children}
            </main>

            <MikeWidget />
            <MobileNav />
        </div>
    );
}
