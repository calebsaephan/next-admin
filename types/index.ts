import {
    LineItem,
    Order,
    Payment,
    Product,
    Shipment,
    User,
} from "@/app/generated/prisma"
import { badgeVariants } from "@/components/ui/badge"
import { VariantProps } from "class-variance-authority"

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

export type OrderWithUserPayment = Order & { user: User; payment: Payment }

export type OrderWithFullDetails = Order & {
    user: User
    payments: Payment[]
    shipments: Shipment[]
    lineItems: LineItemWithProductDetail[]
}

export type LineItemWithProductDetail = LineItem & { product: Product }
