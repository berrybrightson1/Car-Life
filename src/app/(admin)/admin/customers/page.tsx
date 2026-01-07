"use client";

import { useEffect, useState } from "react";
import { MockDB, Order } from "@/lib/mock-db";
import { Search, Filter, MoreVertical, Phone, Mail, Car } from "lucide-react";

export default function CustomersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Load data from "DB"
        setOrders(MockDB.getOrders());

        // Poll for updates (since we don't have real sockets)
        const interval = setInterval(() => {
            setOrders(MockDB.getOrders());
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredOrders = orders.filter(o =>
        o.customerPhone.includes(searchQuery) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.carDetails.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Customers</h1>
                    <p className="text-gray-500">Manage your leads and active orders.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2">
                        <Filter size={18} /> Filter
                    </button>
                    <button className="bg-black text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-gray-900 transition-colors">
                        Export List
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-100 divide-x divide-gray-100 bg-gray-50/50">
                    <div className="p-6">
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Leads</div>
                        <div className="text-3xl font-black text-gray-900">{orders.length}</div>
                    </div>
                    <div className="p-6">
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Pending</div>
                        <div className="text-3xl font-black text-blue-600">{orders.filter(o => o.status === 'Pending').length}</div>
                    </div>
                    <div className="p-6">
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Conversion</div>
                        <div className="text-3xl font-black text-green-600">0%</div>
                    </div>
                    <div className="p-6 bg-blue-50/30">
                        <div className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Total Value</div>
                        <div className="text-3xl font-black text-blue-700">₵0.00</div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by ID, Phone, or Car..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Customer ID</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Vehicle Interest</th>
                                <th className="px-6 py-4">Budget</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
                                        No customers found yet. Orders placed on the storefront will appear here.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{order.id}</div>
                                            <div className="text-xs text-gray-400 font-medium">{new Date(order.date).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                    <Phone size={14} className="text-gray-400" />
                                                    {order.dialCode} {order.customerPhone}
                                                </div>
                                                {order.customerEmail && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Mail size={14} className="text-gray-400" />
                                                        {order.customerEmail}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                                    <Car size={16} />
                                                </div>
                                                <span className="font-medium text-gray-900">{order.carDetails}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-gray-600 font-bold">{order.budget}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${order.status === 'Pending'
                                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                    : 'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
