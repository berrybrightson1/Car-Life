"use client";

import { motion } from "framer-motion";
import { Search, FileText, Anchor, Key, HelpCircle, ChevronDown, CheckCheck, Clock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Link from 'next/link';

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="bg-white pt-12 pb-16 px-6 text-center border-b border-gray-100">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    <span className="text-blue-600 font-bold tracking-wide text-xs uppercase mb-4 block">Process</span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        How It <span className="text-blue-600">Works</span>
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Importing a car shouldn't be a mystery. Here is our simple 4-step process to get you behind the wheel.
                    </p>
                </motion.div>
            </div>

            {/* Steps Timeline */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute left-[27px] top-8 bottom-20 w-0.5 bg-gray-200"></div>

                    <div className="space-y-16">
                        {[
                            {
                                icon: Search,
                                title: "1. Find Your Car",
                                desc: "Browse our curated inventory of vehicles ready to ship, or use our 'Order Custom' feature to tell us exactly what you're looking for (Make, Model, Year, Budget).",
                                tip: "Tip: We source from Manheim, Copart, and IAAI with zero dealer markups."
                            },
                            {
                                icon: FileText,
                                title: "2. Transparent Quote",
                                desc: "Once you pick a car, we send you a full cost breakdown. This includes the car price, auction fees, shipping to Tema, and estimated duties.",
                                tip: "No hidden fees. You see exactly where every cedi goes."
                            },
                            {
                                icon: Anchor,
                                title: "3. Shipping & Clearing",
                                desc: "We secure the vehicle and handle all export paperwork. You can track the ship's journey to Ghana. Upon arrival, our clearing agents handle customs efficiently.",
                                tip: "Average shipping time: 6-8 weeks from US to Tema."
                            },
                            {
                                icon: Key,
                                title: "4. Drive Away",
                                desc: "Pick up your fully registered and cleaned vehicle from our Accra pickup point, or have it delivered straight to your home.",
                                tip: "Enjoy your new ride with a full tank on us!"
                            }
                        ].map((step, idx) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative flex flex-col md:flex-row gap-6 md:gap-10"
                            >
                                {/* Icon Bubble */}
                                <div className="flex-shrink-0 relative z-10">
                                    <div className="w-14 h-14 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center shadow-sm">
                                        <step.icon size={24} className="text-blue-600" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="pt-2 flex-grow">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-500 text-lg leading-relaxed mb-4">
                                        {step.desc}
                                    </p>
                                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800 flex gap-2 items-start">
                                        <div className="mt-0.5"><CheckCheck size={16} /></div>
                                        <span>{step.tip}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-black text-blue-500 mb-2">100%</div>
                        <div className="text-gray-400 text-sm uppercase tracking-wider">Clean Titles</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-blue-500 mb-2">30</div>
                        <div className="text-gray-400 text-sm uppercase tracking-wider">Days Avg Shipping</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-blue-500 mb-2">500+</div>
                        <div className="text-gray-400 text-sm uppercase tracking-wider">Cars Delivered</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-blue-500 mb-2">24/7</div>
                        <div className="text-gray-400 text-sm uppercase tracking-wider">Support</div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-500">Everything you need to know about importing with Car Life.</p>
                </div>

                <div className="space-y-4">
                    <FaqItem
                        question="How long does the entire process take?"
                        answer="Typically, it takes about 6-8 weeks from the day of purchase to the day you receive your car in Ghana. This includes auction clearance, inland transport to the US port, ocean shipping, and customs clearing."
                    />
                    <FaqItem
                        question="Do I need to pay the full amount upfront?"
                        answer="No. You pay in stages. First, the cost of the car and auction fees. Shipping is paid when the car is booked for sailing. Duty is paid when the car arrives at Tema."
                    />
                    <FaqItem
                        question="Can you help me clear a car I bought myself?"
                        answer="Yes! We offer clearing-only services. Just contact us with your Bill of Lading and shipping documents, and our agents will handle the customs process for you."
                    />
                    <FaqItem
                        question="What happens if the car has hidden damage?"
                        answer="We inspect every vehicle's report (Carfax/AutoCheck) before you buy. If a car arrives with damage not disclosed in the report, our insurance policy covers repair costs."
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="mx-6 pb-20">
                <div className="max-w-5xl mx-auto bg-blue-600 rounded-[40px] p-12 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to find your dream car?</h2>
                        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                            Start browsing our inventory or tell us exactly what you want, and we'll find it for you at the best auction price.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
                                Browse Inventory
                            </Link>
                            <button className="bg-blue-700 text-white border border-blue-500 px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors">
                                Get a Quote
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all hover:shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-bold text-gray-900 text-lg">{question}</span>
                <ChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-gray-500 leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
}
