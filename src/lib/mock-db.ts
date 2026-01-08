export type Order = {
    id: string;
    customerName: string; // We might not capture this if just phone, but good to have schema
    customerPhone: string;
    customerEmail: string;
    dialCode: string;
    carDetails: string;
    budget: string;
    notes: string;
    date: string;
    status: 'Pending' | 'Contacted' | 'Closed';
};

import { PUBLIC_CARS } from "./mock-data";

// Centralized categories to avoid duplication
export const CAR_CATEGORIES = [
    'SUV', 'Sedan', 'Luxury', 'Sports', 'Electric',
    'Trucks', 'Hatchback', 'Convertible', 'Coupe',
    'Van', 'Bus', 'Heavy Duty'
] as const;

export type CarCategory = typeof CAR_CATEGORIES[number];

export type Listing = {
    id: string;
    name: string;
    price: string;
    image: string; // Keep for backward compat / thumbnail
    images: string[]; // Support multiple images
    status: 'shipping' | 'arrived' | 'sold' | 'draft';
    specs: {
        year: string;
        fuel: string;
        transmission: string;
        condition: string;
    };
    type: CarCategory;
    description?: string;
    dateAdded: string;
};

export const MockDB = {
    saveOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => {
        if (typeof window === 'undefined') return;

        const newOrder: Order = {
            ...order,
            id: `#CL-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toISOString(),
            status: 'Pending'
        };

        const existing = JSON.parse(localStorage.getItem('cl_orders') || '[]');
        localStorage.setItem('cl_orders', JSON.stringify([newOrder, ...existing]));
        return newOrder.id;
    },

    getOrders: (): Order[] => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem('cl_orders') || '[]');
    },

    // INVENTORY METHODS
    saveListing: (data: any) => {
        if (typeof window === 'undefined') return;

        // Transform ListingData to Listing storage format
        const mainImage = data.images[0] || "https://images.unsplash.com/photo-1560156713-ef3765e10085?auto=format&fit=crop&q=80&w=800";

        const newListing: Listing = {
            id: (Math.floor(1000 + Math.random() * 9000)).toString(),
            name: `${data.make} ${data.model}`,
            price: data.price, // assuming string
            image: mainImage,
            images: data.images.length > 0 ? data.images : [mainImage],
            status: data.status,
            specs: {
                year: data.specs.year,
                fuel: data.specs.fuel,
                transmission: data.specs.transmission,
                condition: data.specs.condition
            },
            type: data.type || 'Luxury', // Default if not selected
            description: data.description,
            dateAdded: new Date().toLocaleDateString()
        };

        const existing = MockDB.getListings();
        localStorage.setItem('cl_listings', JSON.stringify([newListing, ...existing]));
        return newListing;
    },

    deleteListing: (id: string) => {
        if (typeof window === 'undefined') return;
        const stored = MockDB.getListings();
        const updated = stored.filter(l => l.id !== id);
        localStorage.setItem('cl_listings', JSON.stringify(updated));
    },

    updateListing: (id: string, updates: Partial<Listing>) => {
        if (typeof window === 'undefined') return;
        const stored = MockDB.getListings();
        const updated = stored.map(l => l.id === id ? { ...l, ...updates } : l);
        localStorage.setItem('cl_listings', JSON.stringify(updated));
        return updated.find(l => l.id === id);
    },

    getListings: (): Listing[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem('cl_listings');
        if (!stored) {
            // Initialize with seed data if empty
            // Transform PUBLIC_CARS to match Listing type
            const seed: Listing[] = PUBLIC_CARS.map((car: any) => ({
                id: car.id,
                name: car.name,
                price: car.price,
                image: car.image,
                images: [car.image], // Default to single image array
                status: car.status || 'available',
                specs: car.specs,
                type: car.type || 'Luxury',
                description: car.description || "No description provided.",
                dateAdded: '2023-11-01'
            }));
            localStorage.setItem('cl_listings', JSON.stringify(seed));
            return seed;
        }

        // Patch existing data if missing fields
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
            ...item,
            images: item.images || [item.image], // Ensure images array exists
            description: item.description || "No description provided for this vehicle.",
            type: item.type || 'Luxury'
        }));
    },

    getStats: () => {
        if (typeof window === 'undefined') return { total: 0, pending: 0, revenue: 0, inventory: 0 };
        const orders = JSON.parse(localStorage.getItem('cl_orders') || '[]') as Order[];
        const listings = JSON.parse(localStorage.getItem('cl_listings') || '[]');

        return {
            total: orders.length,
            pending: orders.filter(o => o.status === 'Pending').length,
            revenue: orders.length * 1500, // Mock revenue
            inventory: listings.length
        };
    },

    // CALENDAR EVENTS
    getEvents: (): CalendarEvent[] => {
        return [
            { id: '1', title: 'Shipment Arrival: Toyota Rav4', date: new Date().toISOString().split('T')[0], type: 'shipment' },
            { id: '2', title: 'Meeting w/ Kwame', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], type: 'meeting' },
            { id: '3', title: 'Delivery: Honda Civic', date: new Date(Date.now() + 172800000).toISOString().split('T')[0], type: 'sale' },
        ];
    },

    // DEALS PIPELINE
    getDeals: (): Deal[] => {
        return [
            { id: '1', client: 'John Doe', vehicle: 'Toyota Land Cruiser', value: '65,000', stage: 'negotiation', date: '2024-01-10' },
            { id: '2', client: 'Sarah Smith', vehicle: 'Honda CR-V', value: '18,500', stage: 'deposit', date: '2024-01-12' },
            { id: '3', client: 'Mike Johnson', vehicle: 'Hyundai Santa Fe', value: '22,000', stage: 'lead', date: '2024-01-15' },
            { id: '4', client: 'Abigail Mensah', vehicle: 'Lexus RX350', value: '45,000', stage: 'sold', date: '2024-01-05' },
        ];
    },

    // TRACKING
    // TRACKING (New Schema)
    getShipments: (): Shipment[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem('cl_shipments');

        // Initial Seed if empty
        if (!stored) {
            const seed: Shipment[] = [
                {
                    id: 'TRK-ORD-1002',
                    waybill_id: 'TRK-ORD-1002',
                    client_id: 'CUST-001',
                    service_type: 'inventory',
                    bookingRef: 'BL-778899',
                    vehicle: '2024 Toyota Land Cruiser',
                    consignee: 'John Doe',
                    consigneePhone: '0551171353',
                    origin: 'Dubai Port',
                    destination: 'Tema Port',
                    eta: '2024-02-15',
                    status: 'at_sea',
                    current_status_step: 3,
                    progress: 60,
                    notes: [
                        { id: 'LOG-1', admin_id: 'ADMIN-1', timestamp: '2024-01-30T10:00:00Z', note: 'Client asked for bill of lading copy.' }
                    ],
                    updates: [
                        { id: 'EVT-2', status_name: 'Departed Dubai Port', location: 'Dubai, UAE', timestamp: '2024-01-30', description: 'Vessel has left the port.' },
                        { id: 'EVT-1', status_name: 'Loaded onto Vessel', location: 'Dubai, UAE', timestamp: '2024-01-28', description: 'Vehicle loaded on container.' }
                    ]
                }
            ];
            localStorage.setItem('cl_shipments', JSON.stringify(seed));
            return seed;
        }

        // WARM PATCH: Ensure phone exists on old records
        const parsed = JSON.parse(stored);
        return parsed.map((s: any) => ({
            ...s,
            consigneePhone: s.consigneePhone || (s.id === 'TRK-ORD-1002' ? '0551171353' : '')
        }));
    },

    saveShipment: (data: Partial<Shipment> & { orderId?: string }) => {
        if (typeof window === 'undefined') return;

        // ID Generation Logic based on Requirement
        let newId = '';
        if (data.service_type === 'inventory' && data.orderId) {
            newId = `TRK-ORD-${data.orderId}`;
        } else {
            newId = `TRK-SER-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        const newShipment: Shipment = {
            id: newId,
            waybill_id: newId,
            client_id: 'CUST-GEN',
            service_type: data.service_type || 'service',
            bookingRef: data.bookingRef || 'PENDING',
            vehicle: data.vehicle || 'Unknown Vehicle',
            consignee: data.consignee || 'Unknown Client',
            consigneePhone: (data as any).consigneePhone || '',
            origin: data.origin || 'Dubai',
            destination: data.destination || 'Tema',
            eta: data.eta || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'procured',
            current_status_step: 0,
            progress: 10,
            notes: [],
            updates: [
                {
                    id: `EVT-${Date.now()}`,
                    status_name: 'Shipment Created',
                    location: data.origin || 'System',
                    timestamp: new Date().toISOString(),
                    description: 'Shipment record created in system.'
                }
            ]
        };

        const existing = MockDB.getShipments();
        localStorage.setItem('cl_shipments', JSON.stringify([newShipment, ...existing]));
        return newShipment;
    },

    addShipmentNote: (id: string, note: string) => {
        if (typeof window === 'undefined') return;
        const shipments = MockDB.getShipments();
        const updated = shipments.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    notes: [{
                        id: `LOG-${Date.now()}`,
                        admin_id: 'ADMIN-CURR',
                        timestamp: new Date().toISOString(),
                        note
                    }, ...s.notes]
                };
            }
            return s;
        });
        localStorage.setItem('cl_shipments', JSON.stringify(updated));
    },

    updateShipmentStatus: (id: string, status: Shipment['status'], location: string) => {
        if (typeof window === 'undefined') return;
        const shipments = MockDB.getShipments();

        const steps = ['procured', 'processing', 'at_port_origin', 'at_sea', 'arrived_port', 'customs', 'delivered'];
        const pMap: Record<string, number> = {
            procured: 10, processing: 25, at_port_origin: 40, at_sea: 60, arrived_port: 80, customs: 90, delivered: 100
        };

        const updated = shipments.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    status,
                    current_status_step: steps.indexOf(status),
                    progress: pMap[status] || s.progress,
                    updates: [{
                        id: `EVT-${Date.now()}`,
                        status_name: status.replace(/_/g, ' ').toUpperCase(),
                        location,
                        timestamp: new Date().toISOString(),
                        description: `Status updated to ${status}`
                    }, ...s.updates]
                };
            }
            return s;
        });
        localStorage.setItem('cl_shipments', JSON.stringify(updated));
    },

    // SETTINGS METHODS
    getSettings: (): StoreSettings => {
        const defaults: StoreSettings = {
            profile: { name: 'Admin User', email: 'admin@carlife.com', phone: '+233 55 117 1353' },
            store: { name: 'Car Life Dealership', currency: 'GHS', exchangeRate: '12.5' },
            notifications: { emailAlerts: true, dailyReport: false },
            appearance: { theme: 'light', compactMode: false },
            logistics: { defaultOrigin: 'Dubai Port', defaultDest: 'Tema Port' },
            privacy: { showContactPublicly: true }
        };

        if (typeof window === 'undefined') return defaults;

        const stored = localStorage.getItem('cl_settings');
        if (!stored) {
            localStorage.setItem('cl_settings', JSON.stringify(defaults));
            return defaults;
        }

        // Merge with defaults to handle new fields for existing users
        return { ...defaults, ...JSON.parse(stored) };
    },

    saveSettings: (settings: StoreSettings) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('cl_settings', JSON.stringify(settings));
    }
};

export type Shipment = {
    id: string; // Primary Key
    waybill_id: string; // Unique Tracking ID
    client_id: string;
    service_type: 'inventory' | 'service'; // Enum

    // Core Info
    bookingRef: string;
    vehicle: string;
    consignee: string;
    consigneePhone?: string; // Optional for now
    origin: string;
    destination: string;
    eta: string;

    // Status
    status: 'procured' | 'processing' | 'at_port_origin' | 'at_sea' | 'arrived_port' | 'customs' | 'delivered';
    current_status_step: number; // 0-6
    progress: number;

    // Relations (Simulated Tables)
    notes: CommunicationLog[];
    updates: ShipmentEvent[];
};

export type CommunicationLog = {
    id: string;
    shipment_id?: string;
    admin_id: string;
    note: string;
    timestamp: string;
};

export type ShipmentEvent = {
    id: string;
    shipment_id?: string;
    status_name: string;
    timestamp: string;
    location: string;
    description: string;
};

export type CalendarEvent = {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    type: 'shipment' | 'meeting' | 'sale';
};

export type Deal = {
    id: string;
    client: string;
    vehicle: string;
    value: string;
    stage: 'lead' | 'negotiation' | 'deposit' | 'sold';
    date: string;
};

export type StoreSettings = {
    profile: {
        name: string;
        email: string;
        phone: string;
    };
    store: {
        name: string;
        currency: 'GHS' | 'USD' | 'EUR';
        exchangeRate: string;
    };
    notifications: {
        emailAlerts: boolean;
        dailyReport: boolean;
    };
    appearance: {
        theme: 'light' | 'dark' | 'system';
        compactMode: boolean;
    };
    logistics: {
        defaultOrigin: string;
        defaultDest: string;
    };
    privacy: {
        showContactPublicly: boolean;
    };
};
