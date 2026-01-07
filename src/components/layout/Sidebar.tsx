"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Tag, Ship, BarChart3, Settings, HelpCircle, Car, Plus, Users, FileText, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

// Menu Configuration

const MENU_ITEMS = [
    {
        section: 'MAIN MENU', items: [
            { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
            { label: 'Listings', icon: Car, href: '/admin/listings' },
            { label: 'Customers', icon: Users, href: '/admin/customers' },
            { label: 'Calendar', icon: Calendar, href: '/admin/calendar' },
            { label: 'Deals', icon: Tag, href: '/admin/deals' },
        ]
    },
    {
        section: 'LOGISTICS', items: [
            { label: 'Tracking', icon: Ship, href: '/admin/tracking' },
            { label: 'Statistics', icon: BarChart3, href: '/admin/stats' },
        ]
    },
    {
        section: 'SYSTEM', items: [
            { label: 'Settings', icon: Settings, href: '/admin/settings' },
            { label: 'Help Center', icon: HelpCircle, href: '/admin/help' },
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[260px] bg-white h-screen fixed left-0 top-0 border-r border-gray-100 hidden md:flex flex-col p-6 z-50">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-10 text-primary">
                <Car size={32} strokeWidth={2.5} />
                <span className="text-2xl font-extrabold tracking-tight">Car Life</span>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
                {MENU_ITEMS.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
                            {section.section}
                        </h3>
                        <nav className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                                            isActive
                                                ? "bg-primary text-white shadow-lg shadow-blue-200"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        {/* Active Indicator on Left (Optional, but adds to clarity) */}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full opacity-0"></div>
                                        )}

                                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                ))}

                {/* Sidebar Call to Action */}
                <div className="pt-4 space-y-3">
                    <Link
                        href="/admin/listings/new"
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Add Listing
                    </Link>

                    <Link
                        href="/admin/listings/drafts"
                        className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 py-2 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 bg-white border border-transparent hover:border-gray-200"
                    >
                        <FileText size={16} />
                        View Drafts
                    </Link>

                    <Link
                        href="/"
                        target="_blank"
                        className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-blue-600 py-2 rounded-xl text-xs font-bold transition-all hover:bg-blue-50/50 mt-1"
                    >
                        <Globe size={14} />
                        Visit Storefront
                    </Link>
                </div>
            </div>

            {/* User Mini Profile */}
            <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
                <img
                    src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
                    alt="Admin"
                    className="w-10 h-10 rounded-full bg-gray-100"
                />
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">Admin User</span>
                    <span className="text-xs text-gray-400">Head of Operations</span>
                </div>
            </div>
        </aside>
    );
}
