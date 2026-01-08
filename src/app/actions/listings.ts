'use server';

import prisma from '@/lib/prisma';
import { Listing } from '@/lib/mock-db';

/**
 * Get all listings from the database
 */
export async function getListings(): Promise<Listing[]> {
    const cars = await prisma.car.findMany({
        orderBy: { createdAt: 'desc' },
    });

    // Transform Prisma Car to MockDB Listing format for compatibility
    return cars.map(car => ({
        id: car.id,
        name: `${car.make} ${car.model}`,
        price: `$${car.price.toString()}`,
        image: car.images[0] || '',
        images: car.images,
        status: car.status.toLowerCase() as 'shipping' | 'arrived' | 'sold' | 'draft',
        specs: {
            year: car.year.toString(),
            fuel: 'Petrol', // Default - we'll need to add this to schema later
            transmission: 'Automatic', // Default
            condition: 'Foreign Used', // Default
        },
        type: 'Luxury' as any, // Default - we'll add category to schema later
        description: '', // No description field yet
        dateAdded: car.createdAt.toLocaleDateString(),
    }));
}

/**
 * Get a single listing by ID
 */
export async function getListingById(id: string) {
    const car = await prisma.car.findUnique({
        where: { id },
    });

    if (!car) return null;

    return {
        id: car.id,
        name: `${car.make} ${car.model}`,
        price: `$${car.price.toString()}`,
        image: car.images[0] || '',
        images: car.images,
        status: car.status.toLowerCase() as 'shipping' | 'arrived' | 'sold' | 'draft',
        specs: {
            year: car.year.toString(),
            fuel: 'Petrol',
            transmission: 'Automatic',
            condition: 'Foreign Used',
        },
        type: 'Luxury' as any,
        description: '',
        dateAdded: car.createdAt.toLocaleDateString(),
    };
}

/**
 * Create a new listing
 */
export async function createListing(data: {
    make: string;
    model: string;
    year: number;
    price: number;
    images: string[];
    status?: string;
    vin?: string;
}) {
    const car = await prisma.car.create({
        data: {
            make: data.make,
            model: data.model,
            year: data.year,
            price: data.price,
            images: data.images,
            status: data.status?.toUpperCase() || 'AVAILABLE',
            vin: data.vin,
        },
    });

    return car;
}

/**
 * Update an existing listing
 */
export async function updateListing(id: string, data: {
    make?: string;
    model?: string;
    year?: number;
    price?: number | string;
    images?: string[];
    status?: string;
}) {
    const car = await prisma.car.update({
        where: { id },
        data: {
            ...(data.make && { make: data.make }),
            ...(data.model && { model: data.model }),
            ...(data.year && { year: data.year }),
            ...(data.price && { price: typeof data.price === 'string' ? parseFloat(data.price.replace(/[^0-9.]/g, '')) : data.price }),
            ...(data.images && { images: data.images }),
            ...(data.status && { status: data.status.toUpperCase() }),
        },
    });

    return car;
}

/**
 * Delete a listing
 */
export async function deleteListing(id: string) {
    await prisma.car.delete({
        where: { id },
    });
}
