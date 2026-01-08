'use server';

import { prisma } from '@/lib/prisma';

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
    const [totalOrders, pendingOrders, totalCars] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.car.count(),
    ]);

    // Calculate mock revenue (we don't have actual revenue tracking yet)
    const revenue = totalOrders * 1500;

    return {
        total: totalOrders,
        pending: pendingOrders,
        revenue,
        inventory: totalCars,
    };
}
