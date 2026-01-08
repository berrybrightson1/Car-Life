"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, DollarSign, User, Car } from "lucide-react";
import { MockDB, Deal } from "@/lib/mock-db";

const STAGES = [
    { id: 'lead', label: 'New Lead', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'negotiation', label: 'Negotiating', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'deposit', label: 'Deposit Paid', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'sold', label: 'Sold', color: 'bg-green-50 text-green-700 border-green-200' }
];

export default function DealsPage() {
    const [deals, setDeals] = useState<Deal[]>(MockDB.getDeals());
    const [search, setSearch] = useState("");

    const filteredDeals = deals.filter(d =>
        d.client.toLowerCase().includes(search.toLowerCase()) ||
        d.vehicle.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Deals Pipeline</h1>
                    <p className="text-gray-500">Track negotiations from lead to sale.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-black text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                        <Plus size={20} />
                        New Deal
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search deals..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
                {STAGES.map(stage => {
                    const stageDeals = filteredDeals.filter(d => d.stage === stage.id);
                    const totalValue = stageDeals.reduce((acc, curr) => acc + parseInt(curr.value.replace(/,/g, '')), 0);

                    return (
                        <div key={stage.id} className="min-w-[300px] flex-1 flex flex-col bg-gray-100/50 rounded-2xl p-4 snap-center">
                            {/* Column Header */}
                            <div className="flex justify-between items-start mb-4 px-1">
                                <div>
                                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${stage.color.split(' ')[0].replace('-50', '-400')}`} />
                                        {stage.label}
                                        <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">{stageDeals.length}</span>
                                    </h3>
                                    <p className="text-xs text-gray-400 font-medium mt-1">
                                        Value: ${totalValue.toLocaleString()}
                                    </p>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600" aria-label="Column Options">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>

                            {/* Cards */}
                            <div className="flex-1 space-y-3">
                                {stageDeals.map(deal => (
                                    <div
                                        key={deal.id}
                                        draggable
                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-shadow active:cursor-grabbing group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-bold text-gray-400">#{deal.id} • {deal.date}</span>
                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600" aria-label="Edit Deal">
                                                <EditBtn />
                                            </button>
                                        </div>

                                        <h4 className="font-bold text-gray-900 mb-1">{deal.vehicle}</h4>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 p-2 rounded-lg">
                                                <User size={14} className="text-blue-500" />
                                                {deal.client}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 bg-green-50 p-2 rounded-lg border border-green-100">
                                                <DollarSign size={14} className="text-green-600" />
                                                ${deal.value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {stageDeals.length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs font-medium">
                                        No deals
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function EditBtn() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
    )
}
