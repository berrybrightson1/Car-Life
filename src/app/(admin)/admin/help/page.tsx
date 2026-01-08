"use client";

import { useState } from "react";
import {
    Search, LayoutDashboard, Car, Users, Calendar,
    Briefcase, Truck, BarChart3, Settings, ChevronRight, HelpCircle,
    FileText
} from "lucide-react";

// EXTENSIVE GUIDES DATA
const GUIDES = [
    {
        id: 'dashboard',
        title: 'Dashboard Overview',
        icon: LayoutDashboard,
        color: 'bg-indigo-50 text-indigo-600',
        description: 'Your command center for daily operations. Learn how to interpret the live data feed and access quick actions.',
        content: [
            '### 1. The Command Center',
            'The dashboard is designed to give you a 360-degree view of your dealership in seconds. It aggregates data from sales, logistics, and inventory.',
            '',
            '### 2. Key Metrics Explained',
            '• **Total Revenue**: The sum of all orders marked as "Closed" or "Sold". Updated in real-time.',
            '• **Active Listings**: The number of vehicles currently published and visible on the storefront.',
            '• **Pending Orders**: Buying requests from customers that need your attention.',
            '',
            '### 3. Quick Action Buttons',
            '• **Add Listing**: Immediately opens the "Creator Studio" to upload a new car.',
            '• **New Shipment**: Shortcuts to the logistics tracking form.',
            '',
            '### 4. Recent Activity Feed',
            'On the right sidebar (desktop) or bottom (mobile), you will see a live log of system events. This tracks everything: new orders, status updates, and inventory changes.'
        ]
    },
    {
        id: 'inventory',
        title: 'Inventory & Listings',
        icon: Car,
        color: 'bg-blue-50 text-blue-600',
        description: 'Master functionality for the "Creator Studio". How to upload cars, manage specs, and generate marketing flyers.',
        content: [
            '### 1. Adding a New Vehicle',
            'Navigate to **Inventory > Add New**. You will enter the "Creator Studio".',
            '• **Photos**: Drag and drop up to 10 high-res images. The first image is the cover photo.',
            '• **Specs**: Enter the Year, Make, Model, Fuel Type, and Mileage.',
            '• **Pricing**: Set the price in USD or GHS. The system handles currency display on the front end.',
            '',
            '### 2. Managing Status',
            '• **Mark as Sold**: In the main Inventory list, click the "Checkmark" icon. This overlays a "SOLD" badge on the storefront card.',
            '• **Edit**: Click the "Pencil" icon to update price or description.',
            '• **Delete**: Remove a listing permanently.',
            '',
            '### 3. Generating Flyers',
            'Click the **"Flyer"** icon on any car row. This generates a branded image with the car photo, price, and specifications, ready for Instagram or WhatsApp Status.'
        ]
    },
    {
        id: 'orders',
        title: 'Orders & CRM',
        icon: Users,
        color: 'bg-green-50 text-green-600',
        description: 'Managing customer relationships. Handling checkout requests, phone numbers, and closing sales.',
        content: [
            '### 1. Receiving Orders',
            'When a client clicks "Checkout on WhatsApp" or "Inquire", an order is created in the **Orders** tab.',
            '• **Status**: All new orders start as "Pending".',
            '',
            '### 2. Processing a Lead',
            'Click on any order row to view the **Customer Detail Modal**.',
            '• **Contact Info**: You will see the Client Name and Phone Number.',
            '• **WhatsApp Integration**: Click the WhatsApp button to open a direct chat with the client, pre-filled with the car details.',
            '',
            '### 3. Closing the Loop',
            'Once you have spoken to the client:',
            '• Change status to **"Contacted"** if negotiations are ongoing.',
            '• Change status to **"Closed"** if the deal is done or lost.',
            'This keeps your dashboard "Pending" count clean.'
        ]
    },
    {
        id: 'tracking',
        title: 'Logistics Tracking',
        icon: Truck,
        color: 'bg-cyan-50 text-cyan-600',
        description: 'Advanced shipment tracking. Creating waybills, updating timelines, and notifying clients.',
        content: [
            '### 1. Creating a Shipment',
            'Go to the **Tracking** tab and click **"New Shipment"**. You have two modes:',
            '• **Inventory Sale**: Select a "Pending Order". The system auto-fills the vehicle and client details. Generates ID: `TRK-ORD-XXXX`.',
            '• **Procurement Service**: Manually enter client details for a custom import service. Generates ID: `TRK-SER-XXXX`.',
            '',
            '### 2. Updating Status (The Timeline)',
            'Click on any shipment card to open the **Detail Drawer**.',
            '• **Status Stepper**: You will see steps like "Procured", "At Sea", "Customs".',
            '• **Update**: Click the next step circle to advance the shipment. This updates the progress bar.',
            '',
            '### 3. Client Notifications',
            '**Crucial Step**: After updating a status, click the **WhatsApp Icon** next to the status step.',
            '• This opens WhatsApp with a pre-written message: *"Hello [Name], your car is now [Status]. Track here: [Link]"*.',
            '• This ensures clients are always informed without typing manual updates.',
            '',
            '### 4. Communication Log',
            'Use the text area in the drawer to log internal notes (e.g., "Bill of Lading received", "Client paid duty").'
        ]
    },
    {
        id: 'calendar',
        title: 'Calendar System',
        icon: Calendar,
        color: 'bg-orange-50 text-orange-600',
        description: 'Scheduling and events. How to use the monthly view for organization.',
        content: [
            '### 1. Overview',
            'The Calendar gives you a visual timeline of your month.',
            '',
            '### 2. Event Types',
            '• **Shipment Arrivals**: Automatically synced from your Logistics ETA dates.',
            '• **Deliveries**: Scheduled handovers for Sold cars.',
            '• **Meetings**: Manual appointments with clients.',
            '',
            '### 3. Planning',
            'Use this view to prevent booking conflicts. If a shipment is arriving on the 15th, avoid scheduling a big delivery for the same morning.'
        ]
    },
    {
        id: 'deals',
        title: 'Deals Pipeline',
        icon: Briefcase,
        color: 'bg-pink-50 text-pink-600',
        description: 'Visual sales funnel (Kanban). moving deals from Lead to Sold.',
        content: [
            '### 1. The Kanban Board',
            'Unlike the list-based Orders view, the Deals board is for visual learners.',
            '• **Columns**: Lead --> Negotiation --> Deposit --> Sold.',
            '',
            '### 2. Managing Deals',
            '• **Drag and Drop**: Simply click and drag a card from one column to another.',
            '• **Value Calculation**: The top of each column shows the total $$ value of deals in that stage. Use this to forecast revenue.',
            '',
            '### 3. Strategy',
            'Focus your energy on the "Negotiation" and "Deposit" columns. These are your hottest leads.'
        ]
    },
    {
        id: 'stats',
        title: 'Statistics & Reports',
        icon: BarChart3,
        color: 'bg-purple-50 text-purple-600',
        description: 'Understanding your numbers. Revenue analysis and inventory insights.',
        content: [
            '### 1. Revenue Charts',
            'The bar charts show your sales performance over the last 6-12 months.',
            '• Use this to identify seasonal trends (e.g., "Do we sell more SUVs in December?").',
            '',
            '### 2. Inventory Breakdown',
            '• **Distribution**: See if you are over-stocked on Sedans vs SUVs.',
            '• **Action**: If you have too many "Luxury" cars sitting unsold, consider running a promo.'
        ]
    },
    {
        id: 'settings',
        title: 'Settings & Config',
        icon: Settings,
        color: 'bg-gray-100 text-gray-600',
        description: 'Platform configuration. Profile, Currency, and Security.',
        content: [
            '### 1. Store Configuration',
            '• **Currency**: Toggle between GHS (Cedis) and USD. This updates all prices across the Admin and Storefront.',
            '• **Exchange Rate**: Set a manual rate if needed.',
            '',
            '### 2. User Profile',
            '• Update your display name and administrative contact email.',
            '',
            '### 3. Future Updates',
            'We are adding Multi-User roles (Admin vs Editor) and 2FA security in the next patch.'
        ]
    }
];

export default function HelpCenterPage() {
    const [search, setSearch] = useState("");
    const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

    const filteredGuides = GUIDES.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase())
    );

    const activeGuide = GUIDES.find(g => g.id === selectedGuide);

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Help Center</h1>
                    <p className="text-gray-500">Comprehensive guides and documentation for the entire platform.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search guides..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium shadow-sm"
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Guides Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 w-full ${selectedGuide ? 'lg:w-[60%] hidden lg:grid' : ''}`}>
                    {filteredGuides.map(guide => (
                        <button
                            key={guide.id}
                            onClick={() => setSelectedGuide(guide.id)}
                            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-left hover:border-blue-200 hover:shadow-md transition-all group relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${guide.color.split(' ')[1]}`}>
                                <guide.icon size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl ${guide.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                        <guide.icon size={24} />
                                    </div>
                                    <div className="p-2 text-gray-300 group-hover:text-blue-600 transition-colors">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.title}</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{guide.description}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detail View (Mobile Overlay or Desktop Sidebar) */}
                {(selectedGuide) && (
                    <div className="w-full lg:flex-1 bg-white rounded-3xl shadow-2xl border border-blue-100 p-8 animate-in slide-in-from-right-10 duration-300 fixed inset-0 z-50 lg:static lg:z-auto overflow-y-auto">
                        <div className="flex items-center gap-2 mb-8">
                            <button onClick={() => setSelectedGuide(null)} className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full" aria-label="Back to Guides">
                                <ChevronRight className="rotate-180" size={24} />
                            </button>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide">
                                Detailed Guide
                            </span>
                        </div>

                        {activeGuide && (
                            <>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`p-4 rounded-2xl ${activeGuide.color}`}>
                                        <activeGuide.icon size={32} />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 leading-tight">{activeGuide.title}</h2>
                                </div>
                                <p className="text-lg text-gray-500 font-medium mb-10 leading-relaxed border-b border-gray-100 pb-8">
                                    {activeGuide.description}
                                </p>

                                <div className="space-y-8">
                                    {activeGuide.content.map((block, idx) => {
                                        const isHeader = block.startsWith('###');
                                        const isBullet = block.startsWith('•');

                                        if (isHeader) {
                                            return <h3 key={idx} className="text-xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
                                                <FileText size={20} className="text-blue-500" />
                                                {block.replace(/### /g, '')}
                                            </h3>;
                                        }
                                        if (isBullet) {
                                            return <div key={idx} className="flex gap-3 ml-1 mb-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2.5 shrink-0" />
                                                <p className="text-gray-700 font-medium leading-relaxed">
                                                    {block.replace(/• /g, '').split('**').map((part, i) =>
                                                        i % 2 === 1 ? <strong key={i} className="text-gray-900">{part}</strong> : part
                                                    )}
                                                </p>
                                            </div>;
                                        }
                                        if (block === '') return <br key={idx} />;

                                        return <p key={idx} className="text-gray-600 leading-relaxed mb-4 font-medium pl-1">
                                            {block}
                                        </p>;
                                    })}
                                </div>

                                <div className="mt-12 pt-8 border-t border-gray-100">
                                    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl text-white shadow-lg">
                                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                            <HelpCircle size={20} />
                                            Still stuck?
                                        </h4>
                                        <p className="text-gray-400 text-sm mb-4">Our support team is available 24/7 for critical issues.</p>
                                        <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors w-full sm:w-auto">
                                            Contact Support
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
