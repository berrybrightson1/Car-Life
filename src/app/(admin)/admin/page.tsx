"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MockDB, Order } from "@/lib/mock-db";
import { DollarSign, ShoppingCart, Users, Activity, ExternalLink, ArrowUpRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import SystemActivityLog from "@/components/admin/SystemActivityLog";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0, inventory: 0 });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);

    useEffect(() => {
        const loadData = () => {
            setStats(MockDB.getStats());
            const orders = MockDB.getOrders();
            setRecentOrders(orders.slice(0, 5)); // Top 5 recent
        };

        loadData();
        // Poll for "Real-time" effect
        const interval = setInterval(loadData, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Dashboard</h1>
                    <p className="text-gray-500">Overview of your dealership's performance.</p>
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
                    trend="+12%"
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
                    title="Conversion Rate"
                    value="2.4%"
                    icon={Activity}
                    trend="-0.1%"
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
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-bold text-gray-900 truncate">
                                                    New Order: {order.carDetails}
                                                </h3>
                                                <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">
                                                    {order.id}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">
                                                From <span className="font-semibold text-gray-700">{order.dialCode} {order.customerPhone}</span>
                                            </p>
                                            <div className="flex gap-2">
                                                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                    {order.budget}
                                                </span>
                                                <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600">
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: System Activity Log */}
                <div className="space-y-6">
                    <SystemActivityLog />

                    <div className="bg-gradient-to-br from-gray-900 to-black rounded-[24px] p-6 text-white text-center shadow-xl shadow-gray-200">
                        <h3 className="font-bold text-lg mb-2">Share Storefront</h3>
                        <p className="text-gray-400 text-sm mb-6">Send your store link to more customers on WhatsApp.</p>
                        <button className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                            <ExternalLink size={18} />
                            Share Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${bg} ${color}`}>
                    <Icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={12} />
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h3>
            </div>
        </div>
    );
}
