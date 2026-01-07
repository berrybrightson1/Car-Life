"use client";

import { Home, Search, Ship, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { label: 'Feed', icon: Home, href: '/' },
    // Keeping Search as /search for now, assuming user might want a dedicated page or we can map it to home
    { label: 'Search', icon: Search, href: '/search' },
    { label: 'Track', icon: Ship, href: '/tracking' }, // Updated to match /tracking page
    { label: 'Cart', icon: ShoppingBag, href: '/cart' },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] z-50 md:hidden">
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-2 flex justify-between items-center"
            >
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center w-full py-2 group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white shadow-sm rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <div className={cn(
                                "relative z-10 flex flex-col items-center gap-1 transition-colors duration-200",
                                isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                            )}>
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                </motion.div>
                                <span className="text-[10px] font-semibold">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </motion.nav>
        </div>
    );
}
