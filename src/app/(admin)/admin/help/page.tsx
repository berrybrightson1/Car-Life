"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Car,
    Ship,
    Tag,
    Users,
    Calendar,
    BarChart3,
    Settings,
    Search,
    ChevronRight,
    BookOpen,
    ArrowRight
} from "lucide-react";

// --- DATA: HELP TOPICS ---
const HELP_TOPICS = [
    {
        id: "dashboard",
        title: "Dashboard Overview",
        icon: LayoutDashboard,
        color: "bg-blue-50 text-blue-600",
        path: ["Main Menu", "Dashboard"],
        uses: [
            "Quick view of daily revenue and performance.",
            "Tracking active shipments at a glance.",
            "Monitoring recent system activity and alerts."
        ],
        steps: [
            {
                title: "Reading Active Bids",
                desc: "The 'Active Bids' widget shows current auctions you are participating in. It highlights items ending soon in red."
            },
            {
                title: "Exporting Data",
                desc: "Click the 'Export' button in the top-right corner to download a CSV report of your current dashboard stats for offline analysis."
            }
        ]
    },
    {
        id: "inventory",
        title: "Inventory & Listings",
        icon: Car,
        color: "bg-purple-50 text-purple-600",
        path: ["Listings", "Add Listing"],
        uses: [
            "Uploading new vehicles to the public storefront.",
            "Managing drafts and unpublished cars.",
            "Editing existing listing details and pricing."
        ],
        steps: [
            {
                title: "Drafts (Auto-Save)",
                desc: "As you type, the system automatically saves your progress as a 'Draft'. You can leave and come back later without losing data."
            },
            {
                title: "Managing Images",
                desc: "Drag and drop images into the upload zone. The first image in the list will automatically become the 'Cover Image' for the listing."
            },
            {
                title: "Publishing",
                desc: "Use the 'Publish' toggle at the bottom of the form to make the car visible on the website. If disabled, it saves as a draft."
            }
        ]
    },
    {
        id: "logistics",
        title: "Logistics Tracking",
        icon: Ship,
        color: "bg-orange-50 text-orange-600",
        path: ["Logistics", "Tracking"],
        uses: [
            "Generating official Waybills for shipments.",
            "Tracking containers from origin (e.g., China/USA) to Ghana.",
            "Updating clients on shipping milestones."
        ],
        steps: [
            {
                title: "Adding a Shipment",
                desc: "Click 'New Shipment'. Select 'Inventory' for cars you own, or 'Service' for third-party client shipping requests."
            },
            {
                title: "Updating Status",
                desc: "Click the status stepper (e.g., 'At Port', 'High Seas') to advance the shipment. This automatically updates the 'Estimated Arrival'."
            },
            {
                title: "Client Notification",
                desc: "When you update a status, you can click the 'WhatsApp' icon to send a pre-formatted template message to the client."
            }
        ]
    },
    {
        id: "deals",
        title: "Deals Pipeline",
        icon: Tag,
        color: "bg-pink-50 text-pink-600",
        path: ["Main Menu", "Deals"],
        uses: [
            "Visualizing your sales funnel (Kanban board).",
            "Tracking leads from 'New' to 'Sold'.",
            "Forecasting potential revenue."
        ],
        steps: [
            {
                title: "Moving Deals",
                desc: "Simply drag and drop a deal card from one column (e.g., 'Negotiation') to another (e.g., 'Closed') to update its status."
            },
            {
                title: "Adding Deal Value",
                desc: "Click a card to edit it. Add a 'Deal Value' ($) to ensure it contributes to the 'Total Projected Revenue' metric at the top."
            }
        ]
    },
    {
        id: "crm",
        title: "Orders & CRM",
        icon: Users,
        color: "bg-emerald-50 text-emerald-600",
        path: ["Main Menu", "Customers"],
        uses: [
            "Central database of all client contact info.",
            "Viewing past order history and invoices.",
            "Managing customer preferences."
        ],
        steps: [
            {
                title: "Searching Clients",
                desc: "Use the search bar at the top to find clients by Name, Phone, or Email. Results appear instantly."
            },
            {
                title: "Order History",
                desc: "Click on a customer's name to open their profile. You will see a list of all their past completed and pending orders."
            }
        ]
    },
    {
        id: "calendar",
        title: "Calendar System",
        icon: Calendar,
        color: "bg-indigo-50 text-indigo-600",
        path: ["Main Menu", "Calendar"],
        uses: [
            "Scheduling test drives with clients.",
            "Tracking shipment arrival dates.",
            "Setting personal reminders."
        ],
        steps: [
            {
                title: "Adding Events",
                desc: "Click directly on any date grid cell. A modal will appear allowing you to set a title (e.g., 'Pickup Reminder') and time."
            }
        ]
    },
    {
        id: "stats",
        title: "Statistics & Reports",
        icon: BarChart3,
        color: "bg-cyan-50 text-cyan-600",
        path: ["System", "Statistics"],
        uses: [
            "Analyzing business health and trends.",
            "Understanding conversion rates.",
            "Calculating net profits over time."
        ],
        steps: [
            {
                title: "Filtering Dates",
                desc: "Use the dropdown in the top-right to change the time period (e.g., 'Last 7 Days', 'Last 30 Days', 'Year to Date')."
            }
        ]
    },
    {
        id: "settings",
        title: "Settings & Config",
        icon: Settings,
        color: "bg-gray-100 text-gray-700",
        path: ["System", "Settings"],
        uses: [
            "Managing global application preferences.",
            "Updating your profile and security."
        ],
        steps: [
            {
                title: "Configuration",
                desc: "Use the toggles to switch the default currency (GHS/USD) or enable/disable system-wide dark mode."
            },
            {
                title: "Security",
                desc: "To change your password, go to the 'Security' tab. You will need to enter your current password to confirm the change."
            }
        ]
    }
];

export default function HelpPage() {
    const [activeTopicId, setActiveTopicId] = useState<string>("dashboard");
    const [searchQuery, setSearchQuery] = useState("");
    const [showMobileDetail, setShowMobileDetail] = useState(false);

    const activeTopic = HELP_TOPICS.find(t => t.id === activeTopicId) || HELP_TOPICS[0];

    const filteredTopics = HELP_TOPICS.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.uses.some(u => u.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-theme(spacing.20))] md:h-screen bg-gray-50/50 overflow-hidden">

            {/* LEFT COLUMN: NAVIGATION (Grid) */}
            <div className={`w-full md:w-[400px] flex flex-col border-r border-gray-200 bg-white h-full ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
                {/* Search Header */}
                <div className="p-6 border-b border-gray-100 flex-shrink-0">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Help Center</h1>
                    <p className="text-sm text-gray-500 mb-6 font-medium">Guides, tutorials, and tips.</p>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search topics..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Topics List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredTopics.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => {
                                setActiveTopicId(topic.id);
                                setShowMobileDetail(true);
                            }}
                            className={`w-full text-left p-4 rounded-xl transition-all border group relative overflow-hidden ${activeTopicId === topic.id
                                    ? 'bg-blue-50/50 border-blue-200 shadow-sm'
                                    : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
                                }`}
                        >
                            <div className="flex items-start gap-4 relative z-10">
                                <div className={`p-2.5 rounded-lg ${topic.color} bg-opacity-10 shrink-0`}>
                                    <topic.icon size={22} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className={`font-bold text-sm mb-1 ${activeTopicId === topic.id ? 'text-blue-700' : 'text-gray-900'
                                        }`}>
                                        {topic.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-medium line-clamp-1 truncate">
                                        {topic.uses[0]}
                                    </p>
                                </div>
                            </div>

                            {/* Desktop Active Indicator */}
                            {activeTopicId === topic.id && (
                                <div className="absolute top-0 right-0 bottom-0 w-1 bg-blue-500 hidden md:block" />
                            )}

                            {/* Mobile Chevron */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 md:hidden">
                                <ChevronRight size={16} />
                            </div>
                        </button>
                    ))}

                    {filteredTopics.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                            <BookOpen size={32} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm font-medium">No topics found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: READING PANE */}
            <div className={`flex-1 overflow-y-auto h-full bg-gray-50/50 ${showMobileDetail ? 'block' : 'hidden md:block'}`}>
                <div className="max-w-3xl mx-auto p-6 md:p-12">
                    {/* Mobile Back Button */}
                    <button
                        onClick={() => setShowMobileDetail(false)}
                        className="md:hidden flex items-center gap-2 text-gray-500 font-bold text-sm mb-6 hover:text-blue-600 transition-colors"
                    >
                        <div className="p-1 rounded-full bg-white border border-gray-200 shadow-sm">
                            <ChevronRight size={16} className="rotate-180" />
                        </div>
                        Back to Topics
                    </button>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTopic.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Breadcrumb Path */}
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                                {activeTopic.path.map((crumb, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className={idx === activeTopic.path.length - 1 ? "text-blue-600" : ""}>
                                            {crumb}
                                        </span>
                                        {idx < activeTopic.path.length - 1 && <ChevronRight size={12} />}
                                    </div>
                                ))}
                            </div>

                            {/* Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-3.5 rounded-2xl ${activeTopic.color} shadow-lg shadow-gray-100`}>
                                    <activeTopic.icon size={32} />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                    {activeTopic.title}
                                </h1>
                            </div>

                            {/* Section: Uses */}
                            <div className="prose prose-blue max-w-none mb-10">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                    Why use this?
                                </h3>
                                <ul className="grid gap-3 list-none p-0">
                                    {activeTopic.uses.map((use, idx) => (
                                        <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-600">
                                            <div className="mt-1 min-w-[6px] min-h-[6px] rounded-full bg-blue-400" />
                                            {use}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Section: Baby Steps */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                                    How to use it (Baby Steps)
                                </h3>

                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[19px] before:-z-10 before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent before:translate-y-2">
                                    {activeTopic.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-6 group">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-green-100 text-green-600 font-bold flex items-center justify-center shadow-sm relative z-10 group-hover:border-green-500 group-hover:bg-green-50 transition-colors">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-green-100">
                                                <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    </AnimatePresence>

                    {/* Bottom Padding */}
                    <div className="h-20" />
                </div>
            </div>
        </div>
    );
}
