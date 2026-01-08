'use server';

import prisma from '@/lib/prisma';

/**
 * Create a new order/lead
 */
export async function createOrder(data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    dialCode?: string;
    carDetails: string;
    budget: string;
    notes?: string;
}) {
    // Generate custom order number
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
        data: {
            orderNumber,
            clientName: data.customerName,
            clientPhone: `${data.dialCode || ''}${data.customerPhone}`,
            amount: parseFloat(data.budget.replace(/[^0-9.]/g, '')) || 0,
            status: 'PENDING',
        },
    });

    return {
        id: orderNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || '',
        dialCode: data.dialCode || '',
        carDetails: data.carDetails,
        budget: data.budget,
        notes: data.notes || '',
        date: order.createdAt.toISOString(),
        status: 'Pending' as const,
    };
}

/**
 * Get all orders
 */
export async function getOrders() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            car: true,
        },
    });

    return orders.map(order => ({
        id: order.orderNumber,
        customerName: order.clientName,
        customerPhone: order.clientPhone,
        customerEmail: '',
        dialCode: '',
        carDetails: order.car ? `${order.car.make} ${order.car.model}` : 'N/A',
        budget: `$${order.amount.toString()}`,
        notes: '',
        date: order.createdAt.toISOString(),
        status: order.status === 'PENDING' ? 'Pending' : order.status === 'CONFIRMED' ? 'Contacted' : 'Closed' as any,
    }));
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderNumber: string, status: string) {
    await prisma.order.update({
        where: { orderNumber },
        data: {
            status: status.toUpperCase(),
        },
    });
}
