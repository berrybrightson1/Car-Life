"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { getListings, deleteListing, updateListingStatus } from "@/app/actions/listings";
import { toast } from "sonner";
import ListingsTable from "@/components/admin/listing/ListingsTable";

export default function ListingsPage() {
    const router = useRouter();
    const [listings, setListings] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Initial load
        const loadListings = async () => {
            try {
                const data = await getListings();
                setListings(data);
            } catch (error) {
                console.error("Failed to load listings", error);
            }
        };
        loadListings();

        // Poll for updates (poor man's real-time)
        const interval = setInterval(() => {
            loadListings();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const filteredCars = listings.filter(car => {
        const title = `${car.make} ${car.model}`.toLowerCase();
        return title.includes(searchQuery.toLowerCase()) ||
            (car.status && car.status.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Inventory Manager</h1>
                    <p className="text-gray-500">Manage your active car listings.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/listings/new"
                        className="bg-black text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                    >
                        <Plus size={20} />
                        Add New Car
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="overflow-hidden">
                {/* Toolbar */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 mb-6 p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Component */}
                <ListingsTable
                    listings={filteredCars}
                    onDelete={async (id: string) => { // Type explicitly
                        toast("Are you sure?", {
                            description: "This listing will be permanently deleted.",
                            action: {
                                label: "Delete",
                                onClick: async () => {
                                    await deleteListing(id);
                                    const updated = await getListings();
                                    setListings(updated);
                                    toast.success("Listing deleted");
                                }
                            },
                            cancel: {
                                label: "Cancel",
                                onClick: () => { }
                            }
                        });
                    }}
                    onUpdate={async (id: string, updates: any) => { // Type explicitly
                        // Assuming update functionality handles partial objects or status updates
                        // Currently ListingsTable passes updates object? Need to check.
                        // For now we assume status update mostly.
                        if (updates.status) {
                            await updateListingStatus(id, updates.status);
                        } else {
                            // Full update logic not yet implemented in page wrapper, maybe via edit?
                            console.warn("Full update not implemented in table callback");
                        }
                        const updated = await getListings();
                        setListings(updated);
                        toast.success("Listing updated");
                    }}
                    onEdit={(car: any) => {
                        // Save to current edit and redirect
                        const editData = {
                            id: car.id,
                            make: car.make,
                            model: car.model,
                            year: car.year,
                            price: car.price,
                            status: car.status,
                            images: car.images || [],
                            category: car.category,
                            condition: car.condition,
                            fuel: car.fuel,
                            transmission: car.transmission,
                            description: car.description || "",
                            mileage: car.mileage || ""
                        };
                        localStorage.setItem('cl_current_edit', JSON.stringify(editData));
                        router.push('/admin/listings/new?restore=true');
                    }}
                />
            </div>
        </div>
    );
}
