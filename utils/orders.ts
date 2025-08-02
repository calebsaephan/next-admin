import { BadgeVariant } from "@/types"

export const statusMap: Record<string, BadgeVariant> = {
    pending: "neutral",
    processing: "warning",
    confirmed: "warning",
    shipped: "success",
    completed: "success",
    refunded: "info",
    cancelled: "error",
    hold: "error",
    partially_shipped: "info",
    partially_refunded: "warning",
}

export const getStatusBadgeVariant = (status: string) => {
    const variant: BadgeVariant = statusMap[status.toLowerCase()] ?? "default"

    return variant
}
