"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Globe2, ShieldCheck, Users } from "lucide-react";

const ImagePlaceholder = ({ label, height = "h-64 md:h-96" }: { label: string, height?: string }) => (
    <div className={`w-full ${height} bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 gap-2 group hover:bg-gray-50 transition-colors cursor-pointer`}>
        <div className="p-4 bg-white rounded-full shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <span className="font-medium text-sm group-hover:text-gray-600 transition-colors uppercase tracking-wide">{label}</span>
        <span className="text-xs text-gray-300">(Click to Replace)</span>
    </div>
);

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gray-50 pt-10 pb-20 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="border-b border-gray-200 pb-16 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="order-2 md:order-1"
                        >
                            <span className="bg-blue-100/50 text-blue-700 font-bold px-4 py-1.5 rounded-full text-sm inline-block mb-6 border border-blue-100">
                                ESTABLISHED 2024
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.1]">
                                Changing how Ghana buys cars. <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    One key at a time.
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-500 mb-8 leading-relaxed max-w-lg">
                                We aren&apos;t just a dealership; we are your direct link to global automotive inventory. No middlemen, no mystery markups, just transparent imports.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-gray-200">
                                    Explore Inventory
                                </button>
                                <button className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                    Read Our Story
                                </button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="order-1 md:order-2"
                        >
                            <div className="relative h-64 md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="/showroom.png"
                                    alt="Car Life Showroom in Accra"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* The Problem & Solution */}
            <div className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="relative h-80 md:h-[600px] w-full rounded-3xl overflow-hidden shadow-xl">
                                <img
                                    src="/trust.png"
                                    alt="Car Delivery Handshake"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Floating Card */}
                            <div className="absolute -bottom-6 -right-6 md:-right-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <span className="font-bold text-gray-900">Verified Trusted</span>
                                </div>
                                <p className="text-sm text-gray-500">We inspect every vehicle report before it ships to Tema port.</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
                                We built <span className="text-blue-600">Car Life</span> to fix a broken system.
                            </h2>
                            <div className="space-y-6 text-lg text-gray-500">
                                <p>
                                    For too long, buying a car in Ghana has been a gamble. Unreliable agents, hidden accident histories, and prices that change overnight.
                                </p>
                                <p>
                                    <strong className="text-gray-900">We decided to change that.</strong>
                                </p>
                                <p>
                                    Car Life gives you direct access to auction-grade pricing from the USA, Canada, and Dubai. We handle the bidding, the shipping, and the clearing. You just handle the driving.
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-6">
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <h4 className="font-bold text-gray-900 text-2xl mb-1">500+</h4>
                                    <p className="text-sm text-blue-600 font-medium">Cars Delivered</p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <h4 className="font-bold text-gray-900 text-2xl mb-1">100%</h4>
                                    <p className="text-sm text-indigo-600 font-medium">Transparency</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Grid */}
            <div className="bg-gray-50 py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Why Ghanaians Trust Us</h2>
                        <p className="text-gray-500 text-lg">We don&apos;t just sell cars; we sell peace of mind. Here is why our customers keep coming back.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Globe2,
                                title: "Global Sourcing",
                                desc: "Access to Manheim, Copart, and IAAI auctions. We find the exact spec you want, not just what's on the lot."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Clean Title Guarantee",
                                desc: "We provide full Carfax/AutoCheck reports for every vehicle. No salvage titles disguised as clean ones."
                            },
                            {
                                icon: Users,
                                title: "Local Support",
                                desc: "Our office is right here in Accra. Walk in, talk to a human, and track your car's journey in person."
                            }
                        ].map((feature) => (
                            <div key={feature.title} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 text-gray-900">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
