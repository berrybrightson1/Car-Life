"use client";

import { useState, useEffect } from "react";
import { Ship, Anchor, Clock, MapPin, Truck, Plus, FileText, Phone, User, Package, X, Save, MoreHorizontal, ArrowRight, CheckCircle2 } from "lucide-react";
import { MockDB, Shipment, Order } from "@/lib/mock-db"; // Assuming Order is exported
import { toast } from "sonner";

export default function TrackingPage() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

    // Initial Load & Listen to LocalStorage
    useEffect(() => {
        setShipments(MockDB.getShipments());
    }, []);

    const refreshData = () => {
        setShipments(MockDB.getShipments());
        if (selectedShipment) {
            // Refresh drawer data if open
            const updated = MockDB.getShipments().find(s => s.id === selectedShipment.id);
            if (updated) setSelectedShipment(updated);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50 pb-32">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Logistics Dashboard</h1>
                    <p className="text-gray-500">Track internal inventory and client procurement services.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-black text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                    >
                        <Plus size={20} />
                        New Shipment
                    </button>
                </div>
            </div>

            {/* Shipments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {shipments.map(shipment => (
                    <div
                        key={shipment.id}
                        onClick={() => setSelectedShipment(shipment)}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer hover:shadow-md transition-all group"
                    >
                        {/* Status Bar */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                            <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${shipment.progress}%` }} />
                        </div>

                        {/* Card Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 mt-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md whitespace-nowrap">{shipment.waybill_id}</span>
                                    {shipment.service_type === 'inventory' ? (
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase border border-blue-100 whitespace-nowrap">Inventory Sale</span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase border border-purple-100 whitespace-nowrap">Procurement</span>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{shipment.vehicle}</h2>
                                <div className="text-sm font-medium text-gray-500 flex items-center gap-1 mt-1">
                                    <User size={14} /> {shipment.consignee}
                                </div>
                            </div>
                            <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide whitespace-nowrap ${getStatusColor(shipment.status)}`}>
                                {shipment.status.replace(/_/g, ' ')}
                            </span>
                        </div>

                        {/* Route Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex-1 w-full">
                                <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Origin</div>
                                <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-400 shrink-0" />
                                    <span className="break-words">{shipment.origin}</span>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center justify-center text-gray-300">
                                <Ship size={20} />
                            </div>
                            {/* Mobile Divider/Icon */}
                            <div className="flex sm:hidden text-gray-300 pl-1">
                                <ArrowRight size={16} className="rotate-90" />
                            </div>

                            <div className="flex-1 w-full sm:text-right">
                                <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Destination</div>
                                <div className="font-bold text-gray-900 text-sm flex items-center sm:justify-end gap-2">
                                    <span className="sm:hidden"><Anchor size={14} className="text-gray-400 shrink-0" /></span>
                                    <span className="break-words">{shipment.destination}</span>
                                    <span className="hidden sm:inline"><Anchor size={14} className="text-gray-400 shrink-0" /></span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium text-xs">ETA: <span className="text-gray-900 font-bold">{shipment.eta}</span></span>
                            <span className="text-blue-600 font-bold text-xs flex items-center gap-1">
                                View Details <ArrowRight size={14} />
                            </span>
                        </div>
                    </div>
                ))}

                {shipments.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400">
                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No active shipments found.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isAddModalOpen && <AddShipmentModal onClose={() => setIsAddModalOpen(false)} onSave={refreshData} />}
            {selectedShipment && <ShipmentDetailDrawer shipment={selectedShipment} onClose={() => setSelectedShipment(null)} onUpdate={refreshData} />}
        </div>
    );
}

// --- HELPER COMPONENTS ---

const getStatusColor = (status: string) => {
    const colors: any = {
        procured: 'bg-purple-100 text-purple-700 border-purple-200',
        processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        at_port_origin: 'bg-orange-100 text-orange-700 border-orange-200',
        at_sea: 'bg-blue-100 text-blue-700 border-blue-200',
        arrived_port: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        customs: 'bg-red-100 text-red-700 border-red-200',
        delivered: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
};

// --- ADD SHIPMENT MODAL ---
function AddShipmentModal({ onClose, onSave }: { onClose: () => void, onSave: () => void }) {
    const [serviceType, setServiceType] = useState<'inventory' | 'service'>('service');
    const [selectedOrder, setSelectedOrder] = useState<string>("");
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (serviceType === 'inventory') {
            const allOrders = MockDB.getOrders();
            // In a real app, verify they aren't already shipped
            setOrders(allOrders);
        }
    }, [serviceType]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const payload: any = {
            service_type: serviceType,
            bookingRef: formData.get('bookingRef') as string,
            origin: formData.get('origin') as string,
            destination: formData.get('destination') as string,
            eta: formData.get('eta') as string,
        };

        if (serviceType === 'inventory') {
            const order = orders.find(o => o.id === selectedOrder);
            if (order) {
                payload.orderId = order.id.replace('#CL-', ''); // Clean ID
                payload.vehicle = order.carDetails || "Unknown Car from Order";
                payload.consignee = order.customerName || "Customer";
                payload.consigneePhone = order.customerPhone || "";
            }
        } else {
            payload.vehicle = formData.get('vehicle') as string;
            payload.consignee = formData.get('consignee') as string;
            payload.consigneePhone = formData.get('consigneePhone') as string;
        }

        MockDB.saveShipment(payload);
        toast.success("Shipment created successfully");
        onSave();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">New Shipment</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close Modal"><X size={20} /></button>
                </div>

                {/* Service Toggle */}
                <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
                    <button
                        onClick={() => setServiceType('inventory')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${serviceType === 'inventory' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Inventory Sale
                    </button>
                    <button
                        onClick={() => setServiceType('service')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${serviceType === 'service' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Procurement Service
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dynamic Fields based on Type */}
                    {serviceType === 'inventory' ? (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Select Order</label>
                            <select
                                value={selectedOrder}
                                onChange={(e) => setSelectedOrder(e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black"
                                required
                                aria-label="Select Pending Order"
                            >
                                <option value="">-- Choose Pending Order --</option>
                                {orders.map(order => (
                                    <option key={order.id} value={order.id}>
                                        {order.id} - {order.carDetails} ({order.customerName})
                                    </option>
                                ))}
                            </select>
                            <p className="text-[10px] text-gray-400 pl-1">Selecting an order auto-fills vehicle & consignee details.</p>
                        </div>
                    ) : (
                        // Manual Entry for Service
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Consignee Name</label>
                                <input name="consignee" required placeholder="Client Name" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black" aria-label="Consignee Name" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Consignee Phone</label>
                                <input name="consigneePhone" placeholder="+233..." className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black" aria-label="Consignee Phone" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Target Vehicle</label>
                                <input name="vehicle" required placeholder="e.g. 2022 Honda Civic" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black" aria-label="Target Vehicle" />
                            </div>
                        </>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Booking Ref / Waybill (Optional)</label>
                        <input name="bookingRef" placeholder="e.g. BL-123456" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Origin Port</label>
                            <input name="origin" required defaultValue="Dubai Auto Zone" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Destination Port</label>
                            <input name="destination" required defaultValue="Tema Port" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Estimated Arrival (ETA)</label>
                        <input name="eta" type="date" required className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black" />
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors">
                        Confirm Shipment
                    </button>
                </form>
            </div>
        </div>
    );
}

// --- DETAIL DRAWER ---
function ShipmentDetailDrawer({ shipment, onClose, onUpdate }: { shipment: Shipment, onClose: () => void, onUpdate: () => void }) {
    const [note, setNote] = useState("");
    const currentStepIndex = shipment.current_status_step;
    const steps = ['procured', 'processing', 'at_port_origin', 'at_sea', 'arrived_port', 'customs', 'delivered'];

    const handleAddNote = () => {
        if (!note.trim()) return;
        MockDB.addShipmentNote(shipment.id, note);
        setNote("");
        onUpdate();
        toast.success("Log added");
    };

    const handleStatusUpdate = (idx: number) => {
        const status = steps[idx];
        MockDB.updateShipmentStatus(shipment.id, status as any, "Admin Update");
        onUpdate();
        toast.success("Status Updated");
        onClose(); // Force refresh
    };

    const handleWhatsAppNotify = (status: string) => {
        if (!shipment.consigneePhone) {
            toast.error("No phone number for this client");
            return;
        }

        const trackingLink = `http://localhost:3006/tracking?id=${shipment.waybill_id}`;
        const message = `Hello ${shipment.consignee} 👋,\n\nUpdate on your shipment: *${shipment.vehicle}*\n\nCurrent Status: *${status.replace(/_/g, ' ').toUpperCase()}* ✅\nTracking ID: *${shipment.waybill_id}*\n\nYou can track the full progress here:\n${trackingLink}\n\nThank you for choosing Car Life! 🚗`;

        window.open(`https://wa.me/${shipment.consigneePhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-gray-100">
            <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex gap-2 mb-2">
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{shipment.waybill_id}</span>
                            {shipment.service_type === 'inventory' && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">INVENTORY</span>}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">{shipment.vehicle}</h2>
                        <p className="text-gray-500 font-medium">Consignee: {shipment.consignee}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close Drawer"><X size={24} /></button>
                </div>

                {/* Stepper / Status Updater */}
                <div className="mb-10 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase">Shipment Status</h3>
                    <div className="relative flex flex-col gap-0 border-l-2 border-dashed border-gray-200 ml-3 pl-8 py-2">
                        {steps.map((step, idx) => {
                            const isCompleted = idx <= currentStepIndex;
                            const isCurrent = idx === currentStepIndex;
                            return (
                                <div key={step} className="relative mb-6 last:mb-0">
                                    <button
                                        onClick={() => handleStatusUpdate(idx)}
                                        className={`absolute -left-[43px] w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all ${isCompleted ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-transparent hover:border-gray-300'
                                            }`}
                                        aria-label={`Mark as ${step.replace(/_/g, ' ')}`}
                                    >
                                        <CheckCircle2 size={14} />
                                    </button>
                                    <div className="flex items-center justify-between group cursor-pointer">
                                        <div onClick={() => handleStatusUpdate(idx)} className="flex-1">
                                            <span className={`text-sm font-bold capitalize transition-colors ${isCurrent ? 'text-black text-base' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.replace(/_/g, ' ')}
                                            </span>
                                            {isCurrent && <span className="ml-2 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">CURRENT</span>}
                                        </div>

                                        {/* WhatsApp Notify Button - Only show for current or completed steps */}
                                        {isCompleted && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleWhatsAppNotify(step);
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                title="Notify Client via WhatsApp"
                                                aria-label="Notify Client via WhatsApp"
                                            >
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M16.53 14.88C16.33 14.78 15.36 14.29 15.18 14.22C15 14.15 14.86 14.11 14.73 14.31C14.6 14.5 14.23 14.93 14.11 15.06C14 15.19 13.88 15.21 13.67 15.11C13.47 15.01 12.82 14.8 12.05 14.11C11.45 13.58 11.04 12.91 10.92 12.7C10.8 12.49 10.91 12.38 11 12.28C11.09 12.19 11.21 12.05 11.31 11.93C11.41 11.82 11.44 11.73 11.51 11.6C11.57 11.46 11.54 11.34 11.48 11.23C11.43 11.12 11.01 10.1 10.84 9.68C10.66 9.27 10.49 9.33 10.37 9.32L9.93 9.32C9.81 9.32 9.6 9.37 9.43 9.55C9.26 9.74 8.78 10.19 8.78 11.1C8.78 12 9.44 12.88 9.53 13C9.62 13.12 10.86 15.04 12.75 15.86C14.33 16.54 14.67 16.43 15.25 16.38C15.88 16.33 16.53 16 16.66 15.63C16.8 15.29 16.8 15 16.76 14.94C16.72 14.89 16.62 14.86 16.53 14.88Z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Client Log (CRM) */}
                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase flex items-center gap-2">
                        <Phone size={16} /> Client Communication Log
                    </h3>

                    {/* Add Note */}
                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-4">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Type call summary or notes..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-black/5 mb-3 min-h-[80px]"
                        />
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-black focus:ring-black" />
                                <span className="text-xs font-bold text-gray-500">Notify Client (WhatsApp)</span>
                            </label>
                            <button onClick={handleAddNote} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 flex items-center gap-2">
                                <Save size={16} /> Save Log
                            </button>
                        </div>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-3">
                        {(shipment.notes || []).map((n) => (
                            <div key={n.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <p className="text-gray-800 text-sm mb-2 font-medium">{n.note}</p>
                                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase">
                                    <span>{n.admin_id}</span>
                                    <span>{new Date(n.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
