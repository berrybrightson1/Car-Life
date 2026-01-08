"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Users, Activity, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getOrders, getDashboardStats } from "@/app/actions/logistics";
import { useRouter } from "next/navigation";

function StatCard({ title, value, icon: Icon, trend, color, bg }: any) {
    return (
        <div className={`p-6 rounded-[24px] border ${bg} relative overflow-hidden group hover:shadow-lg transition-all`}>
            <div className={`w-12 h-12 rounded-2xl ${color.replace('text', 'bg').replace('700', '100')} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} className={color} />
            </div>
            <div className="relative z-10">
                <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">{title}</p>
                <h3 className={`text-3xl font-black ${color} tracking-tight`}>{value}</h3>
            </div>
            {trend && (
                <div className="absolute top-6 right-6 text-xs font-bold bg-white/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                    {trend}
                </div>
            )}
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0, inventory: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsData, ordersData] = await Promise.all([
                    getDashboardStats(),
                    getOrders(),
                ]);
                setStats(statsData);
                setRecentOrders(ordersData.slice(0, 5)); // Top 5 recent
            } catch (error) {
                console.error("Dashboard Load Error", error);
            }
        };

        loadData();
        // Poll for "Real-time" effect
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Dashboard</h1>
                    <p className="text-gray-500">Overview of your dealership&apos;s performance.</p>
                </div>

                <div className="flex gap-3">
                    <Link
                        href="/admin/listings/new"
                        className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-gray-200 flex items-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                        + Add Listing
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`₵${stats.revenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="Est."
                    color="text-emerald-700"
                    bg="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-100"
                />
                <StatCard
                    title="Active Orders"
                    value={stats.pending.toString()}
                    icon={ShoppingCart}
                    trend="Now"
                    color="text-blue-700"
                    bg="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-100"
                />
                <StatCard
                    title="Total Inventory"
                    value={stats.inventory.toString()}
                    icon={Users}
                    trend="Live"
                    color="text-indigo-700"
                    bg="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-100"
                />
                <StatCard
                    title="System Status"
                    value="Online"
                    icon={Activity}
                    trend="100%"
                    color="text-orange-700"
                    bg="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-100"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main: Recent Orders Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                            <Link href="/admin/customers" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentOrders.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <ShoppingCart size={24} />
                                    </div>
                                    <p>No orders yet. Waiting for customers...</p>
                                </div>
                            ) : (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100 group">
                                        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-xl">
                                            🚗
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-gray-900">{order.clientName}</h3>
                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{order.status}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium mb-1">Ordered: {order.carDetails || 'Custom Request'}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{order.clientPhone}</span>
                                            </div>
                                        </div>
                                        <button className="p-2 bg-white rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600" aria-label="View order details">
                                            <ExternalLink size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Quick Actions or Mini-stats */}
                <div className="space-y-6">
                    <div className="bg-black text-white rounded-[24px] p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Creator Studio</h3>
                            <p className="text-gray-400 text-sm mb-6">Manage listings and social assets.</p>
                            <Link
                                href="/admin/listings/new"
                                className="w-full bg-white text-black py-3 rounded-xl font-bold text-center block"
                            >
                                Go to Studio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
