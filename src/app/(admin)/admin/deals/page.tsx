"use client";

import { useEffect, useState } from "react";
import { getDealsPipeline, updateDealStatus, updateDealAmount } from "@/app/actions/system";
import { DollarSign, MoreVertical, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

type Deal = {
    id: string;
    clientName: string;
    amount: number;
    status: string;
    car?: {
        make: string;
        model: string;
        year: number;
        images: string[];
    };
    createdAt: Date;
};

type Columns = {
    [key: string]: Deal[];
};

export default function DealsPage() {
    const [columns, setColumns] = useState<Columns>({
        new: [],
        negotiation: [],
        closed: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDeals();
    }, []);

    const loadDeals = async () => {
        try {
            const data = await getDealsPipeline();
            setColumns({
                new: (data.new as any[]).map(d => ({ ...d, amount: Number(d.amount) })),
                negotiation: (data.negotiation as any[]).map(d => ({ ...d, amount: Number(d.amount) })),
                closed: (data.closed as any[]).map(d => ({ ...d, amount: Number(d.amount) }))
            });
        } catch (error) {
            toast.error("Failed to load deals");
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;

        const sourceCol = result.source.droppableId;
        const destCol = result.destination.droppableId;

        // Optimistic update
        const sourceItems = [...columns[sourceCol]];
        const destItems = [...columns[destCol]];
        const [removed] = sourceItems.splice(result.source.index, 1);
        destItems.splice(result.destination.index, 0, removed);

        setColumns({
            ...columns,
            [sourceCol]: sourceItems,
            [destCol]: destItems
        });

        // Map column ID to DB Status
        const statusMap: any = {
            'new': 'PENDING',
            'negotiation': 'CONFIRMED',
            'closed': 'PAID'
        };

        const newStatus = statusMap[destCol];
        if (newStatus && removed.status !== newStatus) {
            const res = await updateDealStatus(removed.id, newStatus);
            if (!res.success) {
                toast.error("Failed to update status");
                loadDeals(); // Revert
            } else {
                toast.success("Deal updated");
            }
        }
    };

    const calculateTotal = (deals: Deal[]) => {
        return deals.reduce((sum, deal) => sum + Number(deal.amount), 0);
    };

    if (loading) return <div className="p-10 text-gray-400">Loading pipeline...</div>;

    return (
        <div className="p-6 md:p-10 h-screen overflow-hidden flex flex-col bg-gray-50/50">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Deals Pipeline</h1>
                    <p className="text-gray-500 font-medium">Drag and drop to move deals forward.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xs font-bold text-gray-400 uppercase mr-2">Total Value</span>
                    <span className="text-lg font-black text-green-600">
                        ${(calculateTotal(columns.new) + calculateTotal(columns.negotiation) + calculateTotal(columns.closed)).toLocaleString()}
                    </span>
                </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <div className="flex gap-6 h-full min-w-[1000px]">

                        {/* Column: New Leads */}
                        <Column
                            id="new"
                            title="New Leads"
                            deals={columns.new}
                            color="bg-blue-50 border-blue-100"
                            textColor="text-blue-700"
                        />

                        {/* Column: Negotiation */}
                        <Column
                            id="negotiation"
                            title="Negotiation"
                            deals={columns.negotiation}
                            color="bg-orange-50 border-orange-100"
                            textColor="text-orange-700"
                        />

                        {/* Column: Closed Won */}
                        <Column
                            id="closed"
                            title="Closed Won"
                            deals={columns.closed}
                            color="bg-green-50 border-green-100"
                            textColor="text-green-700"
                        />

                    </div>
                </div>
            </DragDropContext>
        </div>
    );
}

function Column({ id, title, deals, color, textColor }: { id: string, title: string, deals: Deal[], color: string, textColor: string }) {
    return (
        <Droppable droppableId={id}>
            {(provided) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 rounded-3xl p-4 flex flex-col h-full border ${color}`}
                >
                    <div className={`flex justify-between items-center mb-4 px-2 ${textColor}`}>
                        <h3 className="font-bold uppercase tracking-wide text-sm">{title}</h3>
                        <span className="bg-white/50 px-2 py-1 rounded-md text-xs font-bold">{deals.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                        {deals.map((deal, index) => (
                            <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group ${snapshot.isDragging ? 'shadow-xl rotate-2 scale-105 z-50' : ''}`}
                                        style={provided.draggableProps.style}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                                {new Date(deal.createdAt).toLocaleDateString()}
                                            </span>
                                            <button className="text-gray-300 hover:text-black">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>

                                        <h4 className="font-bold text-gray-900 mb-1">{deal.clientName}</h4>
                                        {deal.car && (
                                            <p className="text-xs text-gray-500 font-medium mb-3">
                                                {deal.car.year} {deal.car.make} {deal.car.model}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                            <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                                                <User size={12} /> Client
                                            </div>
                                            <span className="text-sm font-black text-gray-900">
                                                ${Number(deal.amount).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
}
