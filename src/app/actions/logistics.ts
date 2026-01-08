"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createShipment(formData: FormData) {
    const type = formData.get("type") as string; // 'INVENTORY' | 'SERVICE'
    const origin = formData.get("origin") as string;
    const dest = formData.get("destination") as string;
    const bookingRef = formData.get("bookingRef") as string;
    const etaStr = formData.get("eta") as string;
    const status = "PROCESSING";

    let waybillId = "";

    if (type === 'INVENTORY') {
        const orderId = formData.get("orderId") as string;
        waybillId = `TRK-ORD-${orderId.substring(0, 8).toUpperCase()}`;
    } else {
        const random4 = Math.floor(1000 + Math.random() * 9000);
        waybillId = `TRK-SER-${random4}`;
    }

    const manualVehicle = formData.get("vehicle") as string || undefined;
    const manualClient = formData.get("consignee") as string || undefined;

    await prisma.shipment.create({
        data: {
            waybillId,
            type,
            currentStatus: status,
            originPort: origin,
            destPort: dest,
            manualVehicle,
            manualClient,
            eta: etaStr ? new Date(etaStr) : null,
        }
    });

    revalidatePath("/admin/tracking");
}

export async function getShipments() {
    return await prisma.shipment.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            car: true, // If linked
            order: true, // If linked
            logs: true // Include notes
        }
    });
}

// Public Tracking Lookup
export async function getShipmentByWaybill(waybillId: string) {
    if (!waybillId) return null;
    return await prisma.shipment.findUnique({
        where: { waybillId },
        include: {
            logs: {
                where: { isInternal: false } // Only show public logs
            },
            events: {
                orderBy: { timestamp: 'desc' }
            }
        }
    });
}

// Helpers for Tracking Page UI
export async function getOrders() {
    // Basic fetch for dropdown
    return await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        where: { status: 'PENDING' } // Only show pending orders for shipment
    });
}

export async function updateShipmentStatus(id: string, status: string, notes?: string) {
    await prisma.shipment.update({
        where: { id },
        data: { currentStatus: status }
    });

    if (notes) {
        await addShipmentNote(id, notes);
    }

    revalidatePath("/admin/tracking");
}

export async function addShipmentNote(shipmentId: string, note: string) {
    await prisma.commLog.create({
        data: {
            shipmentId,
            note,
            isInternal: true
        }
    });
    revalidatePath("/admin/tracking");
}

// Dashboard Helpers
export async function getDashboardStats() {
    const [totalOrders, pendingOrders, totalCars] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.car.count()
    ]);

    // Revenue estimation (mock calculation as per original stats.ts)
    const revenue = totalOrders * 1500;

    return {
        total: totalOrders,
        pending: pendingOrders,
        revenue,
        inventory: totalCars
    };
}
