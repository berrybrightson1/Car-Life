"use client";

import { useState } from "react";
import { Search, Package, MapPin, Truck, Ship, ArrowRight, Loader, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getShipmentByWaybill } from "@/app/actions/logistics";

export default function PublicTrackingPage() {
    const router = useRouter();
    const [trackingId, setTrackingId] = useState("");
    const [result, setResult] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId.trim()) return;

        setIsLoading(true);
        setHasSearched(true);
        setResult(null);

        try {
            const shipment = await getShipmentByWaybill(trackingId.trim());

            if (shipment) {
                setResult(shipment);
                toast.success("Shipment found!");
            } else {
                toast.error("Tracking ID not found. Please check and try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error searching for shipment");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to compute progress
    const getProgress = (status: string) => {
        const steps = ['procured', 'processing', 'at_port_origin', 'at_sea', 'arrived_port', 'customs', 'delivered'];
        const idx = steps.indexOf(status.toLowerCase());
        if (idx === -1) return 10;
        return (idx / (steps.length - 1)) * 100;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Native-style Navigation Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 h-14 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-blue-600 font-medium active:opacity-60 transition-opacity -ml-2 px-2 py-1"
                >
                    <ChevronLeft size={24} />
                    Back
                </button>
                <div className="font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">
                    Tracking
                </div>
                <div className="w-8" /> {/* Spacer for balance */}
            </div>

            <div className="py-8 px-4 md:px-8 max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Track Your Vehicle</h1>
                    <p className="text-gray-500 text-lg">Enter your Waybill No. or Tracking ID to see real-time updates.</p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleTrack} className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-500/5 border border-blue-100 flex gap-2 mb-12 transform transition-all focus-within:ring-4 focus-within:ring-blue-500/10">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            placeholder="e.g. TRK-SER-1234"
                            className="w-full h-14 pl-12 pr-4 rounded-xl outline-none font-bold text-lg text-gray-900 placeholder:text-gray-300"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold transition-all disabled:opacity-50 disabled:hover:bg-blue-600"
                    >
                        {isLoading ? <Loader className="animate-spin" /> : "Track"}
                    </button>
                </form>

                {/* Result Area */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-xl border border-blue-100"
                        >
                            {/* Header */}
                            <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10"><Ship size={120} /></div>
                                <div className="relative z-10">
                                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-lg text-xs font-bold mb-4 border border-white/20">
                                        {result.currentStatus.replace(/_/g, ' ').toUpperCase()}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black mb-1">
                                        {result.manualVehicle || "Vehicle Shipment"}
                                    </h2>
                                    <p className="opacity-80 font-medium">Tracking ID: {result.waybillId}</p>
                                </div>
                            </div>

                            <div className="p-8">
                                {/* Progress Bar */}
                                <div className="mb-10">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
                                        <span>Procured</span>
                                        <span>At Port</span>
                                        <span>Sailing</span>
                                        <span>Ghana</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all duration-1000 relative"
                                            style={{ width: `${getProgress(result.currentStatus)}%` }}
                                        >
                                            <div className="absolute top-0 bottom-0 right-0 w-full animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-gray-100">
                                    <div>
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <MapPin size={16} />
                                            <span className="text-xs font-bold uppercase">Origin</span>
                                        </div>
                                        <div className="font-bold text-gray-900">{result.originPort}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400 mb-1">
                                            <span className="text-xs font-bold uppercase">Destination</span>
                                            <MapPin size={16} />
                                        </div>
                                        <div className="font-bold text-gray-900">{result.destPort}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Truck size={16} />
                                            <span className="text-xs font-bold uppercase">ETA</span>
                                        </div>
                                        <div className="font-bold text-blue-600">
                                            {result.eta ? new Date(result.eta).toLocaleDateString() : 'TBD'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400 mb-1">
                                            <span className="text-xs font-bold uppercase">Ref No.</span>
                                            <Package size={16} />
                                        </div>
                                        <div className="font-bold text-gray-900">{result.id.substring(0, 8).toUpperCase()}</div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <ArrowRight className="bg-black text-white rounded-full p-1" size={20} />
                                        Latest Updates
                                    </h3>
                                    {result.events && result.events.length > 0 ? (
                                        <div className="space-y-8 relative pl-3 border-l-2 border-dashed border-gray-200 ml-2">
                                            {result.events.map((update: any, idx: number) => (
                                                <div key={idx} className="relative pl-6">
                                                    <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${idx === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                                                    <div className={`font-bold ${idx === 0 ? 'text-gray-900 text-lg' : 'text-gray-500'}`}>
                                                        {update.status}
                                                    </div>
                                                    <div className="text-sm text-gray-400 font-medium">
                                                        {update.location} • {new Date(update.timestamp).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 text-sm">No specific updates yet.</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {hasSearched && !result && !isLoading && (
                    <div className="text-center py-12 opacity-50">
                        <Package size={64} className="mx-auto mb-4 text-gray-300" />
                        <p className="font-medium text-gray-400">No shipment found with that ID.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
