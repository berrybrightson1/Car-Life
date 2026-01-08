"use client";

import { MockDB } from "@/lib/mock-db";
import { DollarSign, TrendingUp, ShoppingBag, Users, Calendar } from "lucide-react";
// Removed recharts to avoid build errors if package is missing
// Using custom SVG/CSS implementation for lightweight charts

// Mock Data for Charts
const SALES_DATA = [
    { name: 'Jan', sales: 4000, height: '60%' },
    { name: 'Feb', sales: 3000, height: '45%' },
    { name: 'Mar', sales: 2000, height: '30%' },
    { name: 'Apr', sales: 2780, height: '40%' },
    { name: 'May', sales: 1890, height: '28%' },
    { name: 'Jun', sales: 2390, height: '35%' },
    { name: 'Jul', sales: 3490, height: '52%' },
    { name: 'Aug', sales: 5200, height: '80%' },
    { name: 'Sep', sales: 6100, height: '90%' },
];

const MAKE_DATA = [
    { name: 'Toyota', value: 35, color: 'bg-blue-500' },
    { name: 'Honda', value: 25, color: 'bg-green-500' },
    { name: 'Lexus', value: 20, color: 'bg-purple-500' },
    { name: 'Hyundai', value: 15, color: 'bg-orange-500' },
    { name: 'Others', value: 5, color: 'bg-gray-300' },
];

export default function StatisticsPage() {
    const stats = MockDB.getStats();

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Business Pulse</h1>
                    <p className="text-gray-500">Overview of your dealership performance.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 shadow-sm">
                    <Calendar size={16} />
                    Last 30 Days
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    trend="+12%"
                    icon={DollarSign}
                    color="bg-green-50 text-green-600"
                />
                <StatCard
                    title="Active Orders"
                    value={stats.total.toString()}
                    trend="+5%"
                    icon={ShoppingBag}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Inventory"
                    value={stats.inventory.toString()}
                    trend="Stable"
                    icon={TrendingUp}
                    color="bg-purple-50 text-purple-600"
                />
                <StatCard
                    title="Pending Conversions"
                    value={stats.pending.toString()}
                    trend="-2%"
                    icon={Users}
                    color="bg-orange-50 text-orange-600"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart (Custom) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <h3 className="font-bold text-gray-900 mb-8">Revenue Trend (YTD)</h3>
                    <div className="h-[300px] w-full flex items-end justify-between gap-2 md:gap-4 px-2">
                        {SALES_DATA.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="relative w-full bg-gray-50 rounded-t-xl h-full flex items-end overflow-hidden">
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        ${item.sales.toLocaleString()}
                                    </div>
                                    <div
                                        className="w-full bg-blue-500/90 hover:bg-blue-600 rounded-t-lg transition-all duration-500 relative group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                        style={{ height: item.height }}
                                    >
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-400">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory Breakdown (Custom) */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-8">Inventory by Brand</h3>
                    <div className="space-y-6">
                        {MAKE_DATA.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-gray-700">{item.name}</span>
                                    <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
                        <div className="text-xs font-bold text-gray-500 uppercase">Total Inventory</div>
                        <div className="text-xl font-black text-gray-900">{stats.inventory} Cars</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon: Icon, color }: any) {
    const isPositive = trend.includes('+');
    const isStable = trend === 'Stable';

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' :
                            isStable ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="text-3xl font-black text-gray-900 tracking-tight mb-1">{value}</div>
            <div className="text-sm text-gray-400 font-medium">{title}</div>
        </div>
    );
}
