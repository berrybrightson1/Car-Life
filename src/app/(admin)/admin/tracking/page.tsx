"use client";

import { useState, useEffect } from "react";
import { Ship, Anchor, MapPin, Plus, Phone, User, Package, X, Save, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getShipments, createShipment, updateShipmentStatus, addShipmentNote, getOrders } from "@/app/actions/logistics";
// Prisa types - using any for now to avoid specific client import issues if generation is pending, 
// but fundamentally we expect the shape from the DB.
type Shipment = any;
type Order = any;

// Initial Data Fetcher Component could be server component, but for migration speed we use client side fetch
// or we can convert this page to server component and pass data to client. 
// "Strict Migration" usually favors Server Components for data fetching. 
// However, the existing page is "use client" with heavy state. I will keep "use client" and fetch on mount for safety and speed.

export default function TrackingPage() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [s, o] = await Promise.all([getShipments(), getOrders()]);
            setShipments(s);
            setOrders(o);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load tracking data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refreshData = async () => {
        const s = await getShipments();
        setShipments(s);
        if (selectedShipment) {
            const updated = s.find((x: Shipment) => x.id === selectedShipment.id);
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

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading logistics data...</div>
            ) : (
                /* Shipments Grid */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {shipments.map(shipment => {
                        // Compute progress based on status index
                        const steps = ['procured', 'processing', 'at_port_origin', 'at_sea', 'arrived_port', 'customs', 'delivered'];
                        const currentStepIndex = steps.indexOf(shipment.currentStatus.toLowerCase()) >= 0 ? steps.indexOf(shipment.currentStatus.toLowerCase()) : 1;
                        const progress = (currentStepIndex / (steps.length - 1)) * 100;

                        // Determine display values based on type
                        const vehicleName = shipment.type === 'INVENTORY' && shipment.car
                            ? `${shipment.car.make} ${shipment.car.model} ${shipment.car.year}`
                            : shipment.manualVehicle || "Unknown Vehicle";

                        const consigneeName = shipment.type === 'INVENTORY' && shipment.order
                            ? shipment.order.clientName
                            : shipment.manualClient || "Unknown Client";

                        return (
                            <div
                                key={shipment.id}
                                onClick={() => setSelectedShipment(shipment)}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer hover:shadow-md transition-all group"
                            >
                                {/* Status Bar */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                                    <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
                                </div>

                                {/* Card Header */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 mt-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md whitespace-nowrap">{shipment.waybillId}</span>
                                            {shipment.type === 'INVENTORY' ? (
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase border border-blue-100 whitespace-nowrap">Inventory Sale</span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase border border-purple-100 whitespace-nowrap">Procurement</span>
                                            )}
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{vehicleName}</h2>
                                        <div className="text-sm font-medium text-gray-500 flex items-center gap-1 mt-1">
                                            <User size={14} /> {consigneeName}
                                        </div>
                                    </div>
                                    <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide whitespace-nowrap ${getStatusColor(shipment.currentStatus.toLowerCase())}`}>
                                        {shipment.currentStatus.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                {/* Route Info */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="flex-1 w-full">
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Origin</div>
                                        <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                            <MapPin size={14} className="text-gray-400 shrink-0" />
                                            <span className="break-words">{shipment.originPort}</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex items-center justify-center text-gray-300">
                                        <Ship size={20} />
                                    </div>
                                    <div className="flex sm:hidden text-gray-300 pl-1">
                                        <ArrowRight size={16} className="rotate-90" />
                                    </div>

                                    <div className="flex-1 w-full sm:text-right">
                                        <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Destination</div>
                                        <div className="font-bold text-gray-900 text-sm flex items-center sm:justify-end gap-2">
                                            <span className="sm:hidden"><Anchor size={14} className="text-gray-400 shrink-0" /></span>
                                            <span className="break-words">{shipment.destPort}</span>
                                            <span className="hidden sm:inline"><Anchor size={14} className="text-gray-400 shrink-0" /></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium text-xs">ETA: <span className="text-gray-900 font-bold">{shipment.eta ? new Date(shipment.eta).toLocaleDateString() : 'TBD'}</span></span>
                                    <span className="text-blue-600 font-bold text-xs flex items-center gap-1">
                                        View Details <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {shipments.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-400">
                            <Package size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-medium">No active shipments found.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            {isAddModalOpen && <AddShipmentModal onClose={() => setIsAddModalOpen(false)} onSave={refreshData} orders={orders} />}
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
function AddShipmentModal({ onClose, onSave, orders }: { onClose: () => void, onSave: () => void, orders: Order[] }) {
    const [serviceType, setServiceType] = useState<'INVENTORY' | 'SERVICE'>('SERVICE');
    const [selectedOrder, setSelectedOrder] = useState<string>("");

    // We handle the form submit by calling server action
    const handleSubmit = async (formData: FormData) => {
        try {
            // Append type explicit from state if not in form
            formData.set("type", serviceType);
            await createShipment(formData);
            toast.success("Shipment created successfully");
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create shipment");
        }
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
                        onClick={() => setServiceType('INVENTORY')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${serviceType === 'INVENTORY' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Inventory Sale
                    </button>
                    <button
                        onClick={() => setServiceType('SERVICE')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${serviceType === 'SERVICE' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Procurement Service
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    {/* Dynamic Fields based on Type */}
                    {serviceType === 'INVENTORY' ? (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Select Order</label>
                            <select
                                name="orderId"
                                value={selectedOrder}
                                onChange={(e) => setSelectedOrder(e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black"
                                required
                                aria-label="Select Pending Order"
                            >
                                <option value="">-- Choose Pending Order --</option>
                                {orders.map((order: any) => (
                                    <option key={order.id} value={order.id}>
                                        {/* Assuming order has car details, adjust if needed */}
                                        {order.orderNumber} - {order.clientName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        // Manual Entry for Service
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Consignee Name</label>
                                <input name="consignee" required placeholder="Client Name" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black" aria-label="Consignee Name" />
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
                            <input name="origin" required defaultValue="Dubai Auto Zone" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black" aria-label="Origin Port" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Destination Port</label>
                            <input name="destination" required defaultValue="Tema Port" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black" aria-label="Destination Port" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Estimated Arrival (ETA)</label>
                        <input name="eta" type="date" required className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-medium outline-none focus:ring-2 focus:ring-black" aria-label="Estimated Arrival" />
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
    const steps = ['procured', 'processing', 'at_port_origin', 'at_sea', 'arrived_port', 'customs', 'delivered'];

    // Determine current index from status string
    const statusLower = shipment.currentStatus.toLowerCase();
    const currentStepIndex = steps.indexOf(statusLower) >= 0 ? steps.indexOf(statusLower) : 1;

    // Display helpers
    const vehicleName = shipment.type === 'INVENTORY' && shipment.car
        ? `${shipment.car.make} ${shipment.car.model} ${shipment.car.year}`
        : shipment.manualVehicle || "Unknown Vehicle";

    const consigneeName = shipment.type === 'INVENTORY' && shipment.order
        ? shipment.order.clientName
        : shipment.manualClient || "Client";

    const handleAddNote = async () => {
        if (!note.trim()) return;
        await addShipmentNote(shipment.id, note);
        setNote("");
        onUpdate();
        toast.success("Log added");
    };

    const handleStatusUpdate = async (idx: number) => {
        const newStatus = steps[idx].toUpperCase(); // Assuming we store UPPER or map it back. 
        // Wait, schema defaults to "PROCESSING". My previous seeds used lowercase maybe?
        // Let's store consistent casing. The server action logs say "PROCESSING". 
        // I will send UPPERCASE here to match default.
        // Actually, the helper `getStatusColor` uses lowercase. 
        // I'll stick to UPPERCASE for storage, map to Lower for UI.

        await updateShipmentStatus(shipment.id, newStatus);
        onUpdate();
        toast.success("Status Updated");
        // onClose(); // Don't close, let them see update
    };

    const handleWhatsAppNotify = (status: string) => {
        // Need phone number. 
        // In this strict migration without phone in schema for Shipment, we might fail here.
        // But for now, we just toast if no phone.
        // We can try to grab it from order if linked.
        const phone = shipment.order?.clientPhone || ""; // manual phone not saved currently

        if (!phone) {
            toast.error("No phone number available for this client");
            return;
        }

        const trackingLink = `https://${window.location.host}/tracking/${shipment.waybillId}`; // Clean link
        const message = `Hello ${consigneeName} 👋,\n\nUpdate on your shipment: *${vehicleName}*\n\nCurrent Status: *${status.replace(/_/g, ' ').toUpperCase()}* ✅\nTracking ID: *${shipment.waybillId}*\n\nYou can track the full progress here:\n${trackingLink}\n\nThank you for choosing Car Life! 🚗`;

        window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-gray-100">
            <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex gap-2 mb-2">
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{shipment.waybillId}</span>
                            {shipment.type === 'INVENTORY' && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">INVENTORY</span>}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">{vehicleName}</h2>
                        <p className="text-gray-500 font-medium">Consignee: {consigneeName}</p>
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
                                                <Phone size={16} />
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
                        {(shipment.logs || []).map((n: any) => (
                            <div key={n.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <p className="text-gray-800 text-sm mb-2 font-medium">{n.note}</p>
                                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase">
                                    <span>System</span>
                                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                        {(!shipment.logs || shipment.logs.length === 0) && (
                            <div className="text-center text-gray-400 text-xs py-4">No logs yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
