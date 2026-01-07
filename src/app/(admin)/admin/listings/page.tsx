"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { MockDB, Listing } from "@/lib/mock-db";
import { toast } from "sonner";

export default function ListingsPage() {
    const router = useRouter();
    const [listings, setListings] = useState<Listing[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Initial load
        setListings(MockDB.getListings());

        // Poll for updates (poor man's real-time)
        const interval = setInterval(() => {
            setListings(MockDB.getListings());
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const filteredCars = listings.filter(car =>
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.price.includes(searchQuery)
    );

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
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4 bg-gray-50/30">
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
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2 ml-auto">
                        <Filter size={18} /> Filters
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Vehicle</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Specs</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCars.map((car) => (
                                <tr key={car.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{car.name}</div>
                                                <div className="text-xs text-gray-400 font-medium">ID: #{car.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">₵{car.price}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{car.specs?.year || 'N/A'}</span>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{car.specs?.fuel || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${car.status === 'arrived'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                            {car.status === 'arrived' ? 'In Stock' : 'Shipping'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-gray-400">
                                            <button
                                                onClick={() => {
                                                    toast.info(`Previewing ${car.name}`);
                                                    // For now, just show a toast as we don't have a dedicated "View" page for admin yet
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-lg hover:text-gray-900 transition-colors"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Save to current edit and redirect
                                                    // We need to map Listing back to ListingData structure roughly
                                                    const editData = {
                                                        id: car.id,
                                                        make: car.name.split(' ')[0],
                                                        model: car.name.split(' ').slice(1).join(' '),
                                                        price: car.price,
                                                        status: car.status,
                                                        images: [car.image],
                                                        specs: car.specs,
                                                        description: "Loaded from inventory."
                                                    };
                                                    localStorage.setItem('cl_current_edit', JSON.stringify(editData));
                                                    router.push('/admin/listings/new?restore=true');
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-lg hover:text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    toast("Are you sure?", {
                                                        description: "This listing will be permanently deleted.",
                                                        action: {
                                                            label: "Delete",
                                                            onClick: () => {
                                                                MockDB.deleteListing(car.id);
                                                                setListings(MockDB.getListings());
                                                                toast.success("Listing deleted");
                                                            }
                                                        },
                                                        cancel: {
                                                            label: "Cancel",
                                                            onClick: () => { }
                                                        }
                                                    });
                                                }}
                                                className="p-2 hover:bg-red-50 rounded-lg hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
