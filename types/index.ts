import {
    LineItem,
    Order,
    Payment,
    Product,
    Shipment,
    Customer,
} from "@/app/generated/prisma"
import { badgeVariants } from "@/components/ui/badge"
import { VariantProps } from "class-variance-authority"

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

export type OrderWithUserPayment = Order & {
    customer: Customer
    payment: Payment
}

export type OrderWithFullDetails = Order & {
    customer: Customer
    payments: Payment[]
    shipments: Shipment[]
    lineItems: LineItemWithProductDetail[]
}

export type LineItemWithProductDetail = LineItem & { product: Product }

export type DisplayCurrencyLabelProps = React.ComponentProps<"span"> & {
    value: number | string
    locale?: string
    currency?: string
    showUnits?: boolean
}
