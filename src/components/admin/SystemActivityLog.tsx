"use client";

import { Clock, ShoppingCart, User, AlertCircle, CheckCircle2 } from "lucide-react";

const LOGS = [
    {
        id: 1,
        type: 'order',
        message: 'New order for Bentley Flying Spur',
        user: 'Kwame Mensah',
        time: '2 mins ago',
        icon: ShoppingCart,
        color: 'bg-green-100 text-green-600'
    },
    {
        id: 2,
        type: 'alert',
        message: 'High Seas container delayed (C-204)',
        user: 'System',
        time: '1 hour ago',
        icon: AlertCircle,
        color: 'bg-red-100 text-red-600'
    },
    {
        id: 3,
        type: 'user',
        message: 'New user registration',
        user: 'Sarah Doe',
        time: '3 hours ago',
        icon: User,
        color: 'bg-blue-100 text-blue-600'
    },
    {
        id: 4,
        type: 'system',
        message: 'Daily backup completed',
        user: 'System',
        time: '5 hours ago',
        icon: CheckCircle2,
        color: 'bg-gray-100 text-gray-600'
    },
    {
        id: 5,
        type: 'user',
        message: 'Updated profile details',
        user: 'Admin User',
        time: 'Yesterday',
        icon: User,
        color: 'bg-purple-100 text-purple-600'
    }
];

export default function SystemActivityLog() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-8">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    System Activity
                </h3>
                <span className="text-xs font-medium text-blue-600 cursor-pointer hover:underline">View All</span>
            </div>

            <div className="divide-y divide-gray-50">
                {LOGS.map(log => (
                    <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.color}`}>
                            <log.icon size={14} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                                {log.message}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded text-nowrap">
                                    {log.user}
                                </span>
                                <span className="text-[10px] text-gray-400">• {log.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full text-center py-3 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-t border-gray-50">
                Refresh Log
            </button>
        </div>
    );
}
