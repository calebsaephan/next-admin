import { BadgeVariant } from "@/types"

export const statusMap: Record<string, BadgeVariant> = {
    processing: "progress",
    pending: "warning",
    packed: "progress",
    shipped: "info",
    delivered: "success",
    completed: "success",
    cancelled: "neutral",
    refunded: "neutral",
    hold: "error",
}

export const getStatusBadgeVariant = (status: string) => {
    const variant: BadgeVariant = statusMap[status.toLowerCase()] ?? "default"

    return variant
}
