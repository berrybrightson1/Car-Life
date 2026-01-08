"use client";

import { useState, useEffect } from "react";
import {
    Bell,
    Lock,
    User,
    Globe,
    Shield,
    Smartphone,
    Plus,
    Activity,
    LogOut,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { getSystemActivity } from "@/app/actions/system";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [currency, setCurrency] = useState("GHS");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activityLog, setActivityLog] = useState<any[]>([]);

    useEffect(() => {
        getSystemActivity().then(setActivityLog);
    }, []);

    return (
        <div className="flex flex-col xl:flex-row h-screen overflow-hidden bg-gray-50 box-border">

            {/* MAIN CONTENT (Left/Center) */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                <div className="max-w-4xl mx-auto">

                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Settings & Config</h1>
                    <p className="text-gray-500 font-medium mb-10">Manage your system preferences.</p>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 bg-white p-1 rounded-xl border border-gray-100 w-fit shadow-sm overflow-x-auto">
                        {[
                            { id: "general", label: "General", icon: Globe },
                            { id: "account", label: "My Account", icon: User },
                            { id: "security", label: "Security", icon: Lock },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-black text-white shadow-md"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
                        {activeTab === "general" && (
                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Store Configuration</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 border border-gray-100 rounded-2xl hover:border-blue-100 transition-colors">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-sm font-bold text-gray-700">Currency</label>
                                                <div className="flex bg-gray-100 rounded-lg p-1">
                                                    {['GHS', 'USD'].map(c => (
                                                        <button
                                                            key={c}
                                                            onClick={() => setCurrency(c)}
                                                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${currency === c ? 'bg-white shadow-sm text-black' : 'text-gray-400'
                                                                }`}
                                                        >
                                                            {c}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400">Default currency for new listings.</p>
                                        </div>

                                        <div className="p-4 border border-gray-100 rounded-2xl hover:border-blue-100 transition-colors">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="text-sm font-bold text-gray-700">Dark Mode</label>
                                                <button
                                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                                    className={`w-11 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-black' : 'bg-gray-200'}`}
                                                >
                                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isDarkMode ? 'translate-x-5' : ''}`} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400">Toggle system appearance.</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === "account" && (
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <User size={32} className="text-gray-400" />
                                </div>
                                <h3 className="font-bold text-gray-900">Admin User</h3>
                                <p className="text-sm text-gray-500 mb-6">admin@carlife.com</p>
                                <button className="text-red-600 font-bold text-sm hover:underline flex items-center gap-2 justify-center">
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start gap-4">
                                    <Shield className="text-yellow-600 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-yellow-800 text-sm">Two-Factor Authentication</h4>
                                        <p className="text-xs text-yellow-700 mt-1">Currently disabled. Enable it to protect your admin access.</p>
                                    </div>
                                    <button className="ml-auto bg-white text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-yellow-200 shadow-sm hover:bg-yellow-100">
                                        Enable
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Live Preview Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Smartphone size={20} className="text-blue-500" />
                                Storefront Preview
                            </h3>
                            <Link href="/" target="_blank" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                Open Live Site <ExternalLink size={12} />
                            </Link>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                {/* Phone Mockup */}
                                <div className="w-[280px] h-[580px] bg-black rounded-[40px] border-8 border-gray-800 shadow-2xl overflow-hidden relative shrink-0 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                    {/* Mock Screen */}
                                    <div className="w-full h-full bg-white relative">
                                        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/50 to-transparent z-10 p-4">
                                            <div className="w-full flex justify-between text-white">
                                                <span className="text-[10px] font-bold">Car Life</span>
                                            </div>
                                        </div>
                                        {/* Mock Content */}
                                        <div className="pt-16 px-4 space-y-4">
                                            <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
                                            <div className="h-24 bg-gray-50 rounded-xl" />
                                            <div className="h-24 bg-gray-50 rounded-xl" />
                                        </div>

                                        {/* Floating ACTION BUTTON inside preview */}
                                        <div className="absolute bottom-6 right-6">
                                            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                                                <Plus className="text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* "Plus Icon Behind It" - The Call to Action */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl font-black mb-4">Ready to grow?</h2>
                                    <p className="text-gray-300 font-medium mb-8 leading-relaxed">
                                        Your storefront is live and verified. Add new inventory to reach more customers instantly.
                                    </p>

                                    <Link
                                        href="/admin/listings/new"
                                        className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/50 transition-transform active:scale-95 group"
                                    >
                                        <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                                            <Plus size={24} />
                                        </div>
                                        Add New Listing
                                    </Link>
                                </div>
                            </div>

                            {/* Decorative Background Icons */}
                            <Plus className="absolute top-10 right-10 text-white/5 w-64 h-64 rotate-12" />
                        </div>
                    </div>

                </div>
            </div>

            {/* RIGHT SIDEBAR (System Activity & Profile) */}
            <div className="w-full xl:w-[320px] bg-white border-l border-gray-100 p-6 flex flex-col h-auto xl:h-full border-t xl:border-t-0">
                {/* Profile Card */}
                <div className="bg-gray-50 p-6 rounded-3xl mb-8 text-center border border-gray-100">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <img
                            src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff&size=128"
                            alt="Admin"
                            className="w-full h-full rounded-full border-4 border-white shadow-sm"
                        />
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Admin User</h3>
                    <p className="text-sm text-gray-400 font-medium mb-4">Head of Operations</p>
                    <button className="text-xs font-bold bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                        Edit Profile
                    </button>
                </div>

                {/* System Activity */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Activity size={18} className="text-blue-500" />
                            System Activity
                        </h3>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">REALTIME</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                        {activityLog.length === 0 ? (
                            <p className="text-xs text-center text-gray-400 py-4">Loading activity...</p>
                        ) : activityLog.map((log) => (
                            <div key={log.id} className="relative pl-6 before:absolute before:left-[7px] before:top-2 before:bottom-[-24px] before:w-[2px] before:bg-gray-100 last:before:hidden">
                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-100 ring-1 ring-blue-50"></div>

                                <p className="text-xs font-bold text-gray-900">{log.action}</p>
                                <p className="text-[11px] text-gray-500 font-medium truncate mb-1">{log.target}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="text-[10px] text-blue-600 font-bold">{log.user}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
