"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- SYSTEM ACTIVITY ---
export async function getSystemActivity() {
    try {
        // Fetch latest 50 events from multiple sources
        const [listings, orders, shipments] = await Promise.all([
            prisma.car.findMany({
                take: 20,
                orderBy: { createdAt: 'desc' },
                select: { id: true, make: true, model: true, year: true, createdAt: true }
            }),
            prisma.order.findMany({
                take: 20,
                orderBy: { createdAt: 'desc' },
                select: { id: true, clientName: true, orderNumber: true, createdAt: true }
            }),
            prisma.shipment.findMany({
                take: 20,
                orderBy: { createdAt: 'desc' },
                select: { id: true, waybillId: true, type: true, createdAt: true }
            })
        ]);

        // Normalize and merge
        const activities = [
            ...listings.map(l => ({
                id: `car-${l.id}`,
                type: 'LISTING',
                action: 'New Listing Created',
                target: `${l.year} ${l.make} ${l.model}`,
                user: 'Admin', // Placeholder for now
                timestamp: l.createdAt
            })),
            ...orders.map(o => ({
                id: `ord-${o.id}`,
                type: 'ORDER',
                action: 'New Order Received',
                target: `#${o.orderNumber} - ${o.clientName}`,
                user: 'System',
                timestamp: o.createdAt
            })),
            ...shipments.map(s => ({
                id: `shp-${s.id}`,
                type: 'SHIPMENT',
                action: 'Shipment Created',
                target: `${s.waybillId}`,
                user: 'Logistics',
                timestamp: s.createdAt
            }))
        ];

        // Sort by newest
        return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);

    } catch (error) {
        console.error("Error fetching system activity:", error);
        return [];
    }
}

// --- DEALS (KANBAN) ---
export async function getDealsPipeline() {
    try {
        // We use Orders as Deals
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { car: true }
        });

        // Group by Status
        // Statuses in DB: PENDING, CONFIRMED, PAID
        // Map to Kanban Columns: "New Leads" (PENDING), "Negotiation" (CONFIRMED), "Closed Won" (PAID)

        return {
            new: orders.filter(o => o.status === 'PENDING'),
            negotiation: orders.filter(o => o.status === 'CONFIRMED'),
            closed: orders.filter(o => o.status === 'PAID')
        };
    } catch (error) {
        console.error("Error fetching deals:", error);
        return { new: [], negotiation: [], closed: [] };
    }
}

export async function updateDealStatus(orderId: string, newStatus: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        });
        revalidatePath('/admin/deals');
        return { success: true };
    } catch (error) {
        console.error("Error updating deal status:", error);
        return { success: false, error: 'Failed to update deal' };
    }
}

export async function updateDealAmount(orderId: string, amount: number) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { amount: amount }
        });
        revalidatePath('/admin/deals');
        return { success: true };
    } catch (error) {
        console.error("Error updating deal amount:", error);
        return { success: false, error: 'Failed to update amount' };
    }
}
