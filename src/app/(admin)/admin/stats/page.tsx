"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/app/actions/logistics";
import { BarChart3, TrendingUp, Users, Car, ShoppingBag, ArrowUpRight, DollarSign } from "lucide-react";

export default function StatsPage() {
    const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0, inventory: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats().then(data => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-10 text-gray-400 animate-pulse">Loading analytics...</div>;

    const METRICS = [
        { label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "bg-green-500" },
        { label: "Active Orders", value: stats.pending, icon: ShoppingBag, color: "bg-blue-500" },
        { label: "Total Inventory", value: stats.inventory, icon: Car, color: "bg-purple-500" },
        { label: "Conversion Rate", value: "12%", icon: TrendingUp, color: "bg-orange-500" }, // Mock conversion for now
    ];

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Performance Analytics</h1>
            <p className="text-gray-500 mb-10">Real-time business insights.</p>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {METRICS.map((m) => (
                    <div key={m.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-2xl ${m.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                            <m.icon className={m.color.replace('bg-', 'text-')} size={24} />
                        </div>
                        <p className="text-sm font-bold text-gray-400 mb-1">{m.label}</p>
                        <h3 className="text-3xl font-black text-gray-900">{m.value}</h3>
                        <div className="flex items-center gap-1 text-green-600 text-xs font-bold mt-2">
                            <ArrowUpRight size={14} /> +4.5% vs last month
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section (Placeholder visuals with CSS bars for speed) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-lg">Revenue Overview</h3>
                        <select className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold px-3 py-1">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-blue-100 rounded-t-xl group-hover:bg-blue-600 transition-colors relative"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ${h}k
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400">
                                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Sources */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-lg mb-6">Traffic Sources</h3>
                    <div className="space-y-6">
                        {[
                            { label: "Direct", val: 45, color: "bg-blue-500" },
                            { label: "Social Media", val: 30, color: "bg-purple-500" },
                            { label: "Referral", val: 15, color: "bg-green-500" },
                            { label: "Organic Search", val: 10, color: "bg-yellow-500" }
                        ].map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm font-bold mb-2">
                                    <span className="text-gray-600">{item.label}</span>
                                    <span className="text-gray-900">{item.val}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-50">
                        <button className="w-full py-3 rounded-xl border border-gray-200 font-bold text-sm hover:bg-gray-50 transition-colors">
                            View Full Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
