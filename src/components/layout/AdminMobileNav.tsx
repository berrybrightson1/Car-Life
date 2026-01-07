"use client";

import { LayoutDashboard, Car, Calendar, Menu, X, Tag, Ship, BarChart3, Settings, HelpCircle, Plus, Users, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
// Mobile Navigation Component
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// Primary Nav Items (Visible on Bar)
const TAB_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Listings', icon: Car, href: '/admin/listings' },
    { label: 'Calendar', icon: Calendar, href: '/admin/calendar' },
    { label: 'Menu', icon: Menu, href: '#menu' }, // Triggers Drawer
];

// All Menu Items for Drawer (matching Sidebar.tsx)
const DRAWER_SECTIONS = [
    {
        label: 'Main Menu', items: [
            { label: 'Customers', icon: Users, href: '/admin/customers' },
            { label: 'Deals', icon: Tag, href: '/admin/deals' },
        ]
    },
    {
        label: 'Logistics', items: [
            { label: 'Tracking', icon: Ship, href: '/admin/tracking' },
            { label: 'Statistics', icon: BarChart3, href: '/admin/stats' },
        ]
    },
    {
        label: 'System', items: [
            { label: 'Settings', icon: Settings, href: '/admin/settings' },
            { label: 'Help Center', icon: HelpCircle, href: '/admin/help' },
        ]
    }
];

export default function AdminMobileNav() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] z-50 md:hidden">
                <motion.nav
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-2 flex justify-between items-center"
                >
                    {TAB_ITEMS.map((item) => {
                        const isMenuTrigger = item.label === 'Menu';
                        const isActive = !isMenuTrigger && pathname === item.href;

                        return (
                            <button
                                key={item.label}
                                onClick={() => isMenuTrigger ? setIsMenuOpen(true) : null}
                                className="relative flex flex-col items-center justify-center w-full py-2 group"
                            >
                                {isMenuTrigger ? (
                                    // Menu Trigger Button
                                    <div className={cn(
                                        "relative z-10 flex flex-col items-center gap-1 transition-colors duration-200",
                                        isMenuOpen ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                                    )}>
                                        <item.icon size={24} strokeWidth={isMenuOpen ? 2.5 : 2} />
                                        <span className="text-[10px] font-semibold">{item.label}</span>
                                    </div>
                                ) : (
                                    // Regular Link
                                    <Link href={item.href} className="flex flex-col items-center gap-1 w-full">
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeAdminTab"
                                                className="absolute inset-0 bg-white shadow-sm rounded-xl"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <div className={cn(
                                            "relative z-10 flex flex-col items-center gap-1 transition-colors duration-200",
                                            isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                                        )}>
                                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                            <span className="text-[10px] font-semibold">{item.label}</span>
                                        </div>
                                    </Link>
                                )}
                            </button>
                        );
                    })}
                </motion.nav>
            </div>

            {/* Feature Parity Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm md:hidden"
                        />

                        {/* Drawer Content */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] p-6 pb-32 max-h-[85vh] overflow-y-auto md:hidden"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 bg-gray-100 rounded-full text-gray-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Add Listing Action */}
                            <Link
                                href="/admin/listings/new"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                            >
                                <Plus size={20} />
                                Add New Listing
                            </Link>

                            <Link
                                href="/admin/listings/drafts"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full flex items-center justify-center gap-2 text-gray-600 bg-gray-50 border border-gray-100 py-3 rounded-xl font-bold mb-8 active:scale-95 transition-transform"
                            >
                                <FileText size={18} />
                                View Saved Drafts
                            </Link>

                            {/* Links Grid */}
                            <div className="space-y-8">
                                {DRAWER_SECTIONS.map((section) => (
                                    <div key={section.label}>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                            {section.label}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {section.items.map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-3 p-4 rounded-xl transition-all border",
                                                        pathname === item.href
                                                            ? "bg-blue-50 border-blue-100 text-blue-600"
                                                            : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"
                                                    )}
                                                >
                                                    <item.icon size={20} />
                                                    <span className="font-semibold text-sm">{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
