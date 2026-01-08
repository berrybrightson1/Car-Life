"use client";

import { X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountrySelect, { COUNTRIES } from "@/components/ui/CountrySelect";
import { createOrder } from "@/app/actions/orders";

export default function OrderCustomModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void
}) {
    const [request, setRequest] = useState({
        make: '',
        model: '',
        budget: '',
        notes: '',
        customerPhone: '',
        customerEmail: '',
        dialCode: COUNTRIES[0].dial
    });

    const handleSend = async () => {
        // Save to database for Admin persistence
        const order = await createOrder({
            customerName: "Guest User", // We could add a name field later
            customerPhone: request.customerPhone,
            customerEmail: request.customerEmail,
            dialCode: request.dialCode,
            carDetails: `${request.make} ${request.model}`,
            budget: request.budget,
            notes: request.notes
        });

        const phone = "233551171353"; // Hardcoded for now
        const fullCustomerPhone = `${request.dialCode} ${request.customerPhone}`;

        // Include Unique Order ID in the message
        const text = `Hi, I want to order a custom car:%0A%0A🆔 *Order ID: ${order.id}*%0A🚗 *${request.make} ${request.model}*%0A💰 Budget: ${request.budget}%0A📝 Notes: ${request.notes}%0A%0A👤 *Customer Details:*%0A📞 Phone: ${fullCustomerPhone}%0A📧 Email: ${request.customerEmail}`;

        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        className="fixed left-1/2 top-1/2 w-[90%] md:w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 z-[70] shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                            aria-label="Close Modal"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-extrabold text-gray-900">Order Custom</h2>
                            <p className="text-gray-500 text-sm mt-1">Can&apos;t find what you need? We&apos;ll import it for you.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Make</label>
                                    <input
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-black"
                                        placeholder="e.g. Toyota"
                                        value={request.make}
                                        onChange={e => setRequest({ ...request, make: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Model</label>
                                    <input
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-black"
                                        placeholder="e.g. Highlander"
                                        value={request.model}
                                        onChange={e => setRequest({ ...request, model: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Budget Range</label>
                                <input
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-black"
                                    placeholder="e.g. $20,000 - $30,000"
                                    value={request.budget}
                                    onChange={e => setRequest({ ...request, budget: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Your Phone</label>
                                <div className="flex gap-2">
                                    <CountrySelect
                                        value={request.dialCode}
                                        onChange={(dial) => setRequest({ ...request, dialCode: dial })}
                                    />
                                    <input
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-black"
                                        placeholder="123 4567"
                                        value={request.customerPhone}
                                        onChange={e => setRequest({ ...request, customerPhone: e.target.value })}
                                        type="tel"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Email <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <input
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-black"
                                    placeholder="you@email.com"
                                    value={request.customerEmail}
                                    onChange={e => setRequest({ ...request, customerEmail: e.target.value })}
                                    type="email"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Additional Notes</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-black resize-none h-24"
                                    placeholder="Color preference, leather seats, etc."
                                    value={request.notes}
                                    onChange={e => setRequest({ ...request, notes: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={handleSend}
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-95"
                            >
                                <MessageCircle size={24} fill="white" />
                                Send Request on WhatsApp
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
