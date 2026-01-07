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

    getListings: (): Listing[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem('cl_listings');
        if (!stored) {
            // Initialize with seed data if empty
            // Transform PUBLIC_CARS to match Listing type (adding dateAdded if needed or mapping)
            // For simplicity, we just use the structure we have or let's just map PUBLIC_CARS to be safe
            const seed = PUBLIC_CARS.map(car => ({
                ...car,
                dateAdded: '2023-11-01', // mock/default
                status: car.status as any,
                description: (car as any).description // explicit map
            }));
            localStorage.setItem('cl_listings', JSON.stringify(seed));
            return seed;
        }

        // Patch existing data if missing description or type
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
            ...item,
            description: item.description || "No description provided for this vehicle. Please contact us for more details.",
            type: item.type || 'Luxury' // Default category
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
    }
};
