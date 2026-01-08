"use client";
// Force rebuild

import { useState, useEffect } from "react";
import {
    User, Store, Bell, Save, Globe, Smartphone, Mail, AlertCircle,
    Palette, Truck, Shield, Monitor, Layout
} from "lucide-react";
import { toast } from "sonner";
import { MockDB, StoreSettings } from "@/lib/mock-db";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<StoreSettings | null>(null);

    useEffect(() => {
        setSettings(MockDB.getSettings());
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        MockDB.saveSettings(settings); // Persist

        // Trigger live theme update
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('theme-change'));
        }

        setIsLoading(false);
        toast.success("Settings saved successfully");
    };

    const updateProfile = (field: keyof StoreSettings['profile'], value: string) => {
        if (!settings) return;
        setSettings({ ...settings, profile: { ...settings.profile, [field]: value } });
    };

    const updateStore = (field: keyof StoreSettings['store'], value: string) => {
        if (!settings) return;
        setSettings({ ...settings, store: { ...settings.store, [field]: value } });
    };

    const updateAppearance = (field: keyof StoreSettings['appearance'], value: any) => {
        if (!settings) return;
        setSettings({ ...settings, appearance: { ...settings.appearance, [field]: value } });
    };

    const updateLogistics = (field: keyof StoreSettings['logistics'], value: string) => {
        if (!settings) return;
        setSettings({ ...settings, logistics: { ...settings.logistics, [field]: value } });
    };

    const updatePrivacy = (field: keyof StoreSettings['privacy'], value: boolean) => {
        if (!settings) return;
        setSettings({ ...settings, privacy: { ...settings.privacy, [field]: value } });
    };

    if (!settings) return null;

    return (
        <form onSubmit={handleSave} className="p-6 md:p-10 max-w-[1000px] mx-auto min-h-screen bg-gray-50/50 pb-32">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Settings</h1>
                    <p className="text-gray-500">Manage your profile, store, and system preferences.</p>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm md:px-8 md:py-3 md:rounded-xl md:text-base font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 disabled:opacity-50"
                >
                    {isLoading ? <div className="animate-spin w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="w-4 h-4 md:w-5 md:h-5" />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* User Profile */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20} /></div>
                        <h2 className="text-lg font-bold text-gray-900">Personal Profile</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                            <input type="text" value={settings.profile.name} onChange={(e) => updateProfile('name', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black/5" aria-label="Full Name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email</label>
                            <input type="email" value={settings.profile.email} onChange={(e) => updateProfile('email', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black/5" aria-label="Email Address" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone</label>
                            <input type="tel" value={settings.profile.phone} onChange={(e) => updateProfile('phone', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black/5" aria-label="Phone Number" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Role</label>
                            <input type="text" value="Administrator" disabled className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-500 cursor-not-allowed" aria-label="User Role" />
                        </div>
                    </div>
                </section>

                {/* Store Config */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Store size={20} /></div>
                        <h2 className="text-lg font-bold text-gray-900">Store Configuration</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Store Name</label>
                            <input type="text" value={settings.store.name} onChange={(e) => updateStore('name', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black/5" aria-label="Store Name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Currency</label>
                            <select value={settings.store.currency} onChange={(e) => updateStore('currency', e.target.value as any)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black/5" aria-label="Store Currency">
                                <option value="GHS">GHS (₵)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Exchange Rate (vs USD)</label>
                            <input type="number" value={settings.store.exchangeRate} onChange={(e) => updateStore('exchangeRate', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black/5" aria-label="Exchange Rate" />
                        </div>
                    </div>
                </section>

                {/* Appearance - NEW */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><Palette size={20} /></div>
                        <h2 className="text-lg font-bold text-gray-900">Appearance</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-3">
                                <Monitor size={20} className="text-gray-400" />
                                <span className="font-medium text-gray-700">Theme Preference</span>
                            </div>
                            <select
                                value={settings.appearance?.theme || 'light'}
                                onChange={(e) => updateAppearance('theme', e.target.value)}
                                className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold shadow-sm"
                                aria-label="Theme Preference"
                            >
                                <option value="light">Light Mode</option>
                                <option value="dark">Dark Mode</option>
                                <option value="system">System Default</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-3">
                                <Layout size={20} className="text-gray-400" />
                                <span className="font-medium text-gray-700">Compact View</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => updateAppearance('compactMode', !settings.appearance?.compactMode)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${settings.appearance?.compactMode ? 'bg-black' : 'bg-gray-200'}`}
                                aria-label="Toggle Compact View"
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.appearance?.compactMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Logistics - NEW */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg"><Truck size={20} /></div>
                        <h2 className="text-lg font-bold text-gray-900">Logistics Defaults</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Default Origin Port</label>
                            <input
                                type="text"
                                value={settings.logistics?.defaultOrigin || 'Dubai Port'}
                                onChange={(e) => updateLogistics('defaultOrigin', e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black/5"
                                aria-label="Default Origin Port"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Default Destination Port</label>
                            <input
                                type="text"
                                value={settings.logistics?.defaultDest || 'Tema Port'}
                                onChange={(e) => updateLogistics('defaultDest', e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black/5"
                                aria-label="Default Destination Port"
                            />
                        </div>
                    </div>
                </section>

                {/* Privacy & Security - NEW */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Shield size={20} /></div>
                        <h2 className="text-lg font-bold text-gray-900">Privacy & Security</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900">Public Contact Info</span>
                                <span className="text-xs text-gray-500">Show email/phone on storefront</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => updatePrivacy('showContactPublicly', !settings.privacy?.showContactPublicly)}
                                className={`w-12 h-6 rounded-full relative transition-colors ${settings.privacy?.showContactPublicly ? 'bg-teal-500' : 'bg-gray-200'}`}
                                aria-label="Toggle Public Contact Info"
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.privacy?.showContactPublicly ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 opacity-60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <div className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                            <AlertCircle size={14} /> Coming Soon
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Bell size={20} /></div>
                        <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <span className="font-medium text-gray-700">Email Alerts</span>
                            <div className="w-12 h-6 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <span className="font-medium text-gray-700">Daily Summary</span>
                            <div className="w-12 h-6 bg-gray-300 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}
