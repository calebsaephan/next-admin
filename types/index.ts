import {
    LineItem,
    Order,
    Payment,
    Product,
    Shipment,
    User,
} from "@/app/generated/prisma"

export type OrderWithUserPayment = Order & { user: User; payment: Payment }

export type OrderWithFullDetails = Order & {
    user: User
    payments: Payment[]
    shipments: Shipment[]
    lineItems: LineItemWithProductDetail[]
}

export type LineItemWithProductDetail = LineItem & { product: Product }
