"use client";

import {
    LayoutDashboard, Car, Calendar, Menu, X, Tag, Ship, BarChart3,
    Settings, HelpCircle, Plus, Users, FileText, Share2, Globe, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// Unified Menu Structure
const DRAWER_SECTIONS = [
    {
        label: 'Main Menu', items: [
            { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
            { label: 'Listings', icon: Car, href: '/admin/listings' },
            { label: 'Customers', icon: Users, href: '/admin/customers' },
            { label: 'Calendar', icon: Calendar, href: '/admin/calendar' },
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
            {/* Mobile Top Bar (Header) */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-40 flex md:hidden items-center justify-between px-4">
                {/* Hamburger (Left) */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-50 active:scale-95 transition-transform"
                >
                    <Menu size={24} />
                </button>

                {/* Logo (Center) */}
                <Link href="/admin">
                    <img src="/assets/images/logo-full.png" alt="Car Life" className="h-6 object-contain" />
                </Link>

                {/* Profile or Add (Right) */}
                <Link
                    href="/admin/listings/new"
                    className="p-2 -mr-2 text-blue-600 hover:bg-blue-50 rounded-full active:scale-95 transition-transform"
                >
                    <Plus size={24} />
                </Link>
            </div>

            {/* Spacer to push content down below header */}
            <div className="h-16 md:hidden" />

            {/* Drawer Backdrop & Panel */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm md:hidden"
                        />

                        {/* Left Sidebar Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white z-[60] flex flex-col shadow-2xl md:hidden"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <img src="/assets/images/logo-full.png" alt="Car Life" className="w-28 object-contain" />
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 -mr-2 text-gray-400 hover:text-gray-900 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-8">

                                {/* Quick Actions */}
                                <Link
                                    href="/admin/listings/new"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                                >
                                    <Plus size={20} />
                                    Add New Listing
                                </Link>

                                {/* Menu Sections */}
                                {DRAWER_SECTIONS.map((section) => (
                                    <div key={section.label}>
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                                            {section.label}
                                        </h3>
                                        <div className="space-y-1">
                                            {section.items.map((item) => {
                                                const isActive = pathname === item.href;
                                                return (
                                                    <Link
                                                        key={item.label}
                                                        href={item.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                                            isActive
                                                                ? "bg-blue-50 text-blue-600 font-bold"
                                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                        )}
                                                    >
                                                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                                        {item.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Drawer Footer (Profile) */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                        SA
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-gray-900 truncate">Super Admin</h4>
                                        <p className="text-xs text-gray-500 truncate">admin@carlife.com</p>
                                    </div>
                                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
