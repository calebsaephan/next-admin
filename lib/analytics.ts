import { OrderStatus } from "@/app/generated/prisma"
import prisma from "./prisma"

export type DashboardRange = "7d" | "30d" | "90d" | "all"

function getDateFromRange(range: DashboardRange): Date | undefined {
    const now = new Date()
    switch (range) {
        case "7d":
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        case "30d":
            return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        case "90d":
            return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        default:
            return undefined
    }
}

export async function getDashboardMetrics(range: DashboardRange = "all") {
    const from = getDateFromRange(range)

    const orderWhere = {
        status: { not: OrderStatus.CANCELLED },
        ...(from && { createdAt: { gte: from } }),
    }

    const [orders, refunds, lineItems, totalCancelled] = await Promise.all([
        prisma.order.findMany({
            where: orderWhere,
            select: {
                total: true,
                shipping: true,
                discount: true,
                tax: true,
                createdAt: true,
                status: true,
            },
        }),

        prisma.refund.aggregate({
            where: from ? { createdAt: { gte: from } } : undefined,
            _sum: { amount: true },
        }),

        prisma.lineItem.aggregate({
            where: from ? { createdAt: { gte: from } } : undefined,
            _sum: { quantity: true, discount: true },
        }),

        prisma.order.count({
            where: from
                ? { status: OrderStatus.CANCELLED, createdAt: { gte: from } }
                : { status: OrderStatus.CANCELLED },
        }),
    ])

    // Aggregations
    const totalRevenue = orders.reduce((acc, o) => acc + Number(o.total), 0)
    const totalShipping = orders.reduce((acc, o) => acc + Number(o.shipping), 0)
    const totalDiscounts =
        orders.reduce((acc, o) => acc + Number(o.discount), 0) +
        Number(lineItems._sum.discount ?? 0)
    const totalTax = orders.reduce((acc, o) => acc + Number(o.tax), 0)
    const totalRefunds = Number(refunds._sum.amount ?? 0)
    const totalItemsSold = Number(lineItems._sum.quantity ?? 0)

    const totalProfit =
        totalRevenue - totalShipping - totalDiscounts - totalTax - totalRefunds

    return {
        totalRevenue,
        totalProfit,
        totalItemsSold,
        totalRefunds,
        totalCancelled,
        totalDiscounts,
        totalShipping,
        totalTax,
        orders, // For charting (e.g. revenue over time)
    }
}
