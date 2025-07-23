import {
    PrismaClient,
    OrderStatus,
    PaymentStatus,
    ShipmentStatus,
    Prisma,
} from "@/app/generated/prisma"

const prisma = new PrismaClient()

async function main() {
    // Create some Users
    const user1 = await prisma.user.create({
        data: {
            email: "user35576765@example.com",
            name: "John Doe",
        },
    })

    const user2 = await prisma.user.create({
        data: {
            email: "user5547443@example.com",
            name: "Jane Smith",
        },
    })

    // Create Products
    const product1 = await prisma.product.create({
        data: {
            name: "Laptop",
            description: "A high-end gaming laptop.",
            price: new Prisma.Decimal(1500.0),
            stock: 100,
        },
    })

    const product2 = await prisma.product.create({
        data: {
            name: "Smartphone",
            description: "Latest model smartphone.",
            price: new Prisma.Decimal(800.0),
            stock: 200,
        },
    })

    const generateOrderNumber = async () => {
        const sequence: any =
            await prisma.$queryRaw`SELECT nextval('order_number_seq')`
        return sequence[0].nextval
    }
    const orderNum1 = await generateOrderNumber()
    const orderNum2 = await generateOrderNumber()

    // Create Orders with Payment Statuses
    const order1 = await prisma.order.create({
        data: {
            orderNumber: `ORD${orderNum1}`,
            userId: user1.id,
            status: OrderStatus.PENDING, // Order is still pending
            paymentStatus: PaymentStatus.PENDING,
            totalAmount: new Prisma.Decimal(2300.0),
            shippingAddress: "123 Main St, New York, NY",
            createdBy: user1.id,
            updatedBy: user1.id,
        },
    })

    const order2 = await prisma.order.create({
        data: {
            orderNumber: `ORD${orderNum2}`,
            userId: user2.id,
            status: OrderStatus.CONFIRMED, // Confirmed order
            paymentStatus: PaymentStatus.AUTHORIZED, // Payment authorized
            totalAmount: new Prisma.Decimal(800.0),
            shippingAddress: "456 Oak Ave, San Francisco, CA",
            createdBy: user2.id,
            updatedBy: user2.id,
        },
    })

    // Add Order Items
    await prisma.orderItem.createMany({
        data: [
            {
                orderId: order1.id,
                productId: product1.id,
                quantity: 1,
                price: new Prisma.Decimal(1500.0),
                createdBy: user1.id,
                updatedBy: user1.id,
            },
            {
                orderId: order1.id,
                productId: product2.id,
                quantity: 1,
                price: new Prisma.Decimal(800.0),
                createdBy: user1.id,
                updatedBy: user1.id,
            },
        ],
    })

    await prisma.orderItem.create({
        data: {
            orderId: order2.id,
            productId: product2.id,
            quantity: 1,
            price: new Prisma.Decimal(800.0),
            createdBy: user2.id,
            updatedBy: user2.id,
        },
    })

    // Create Payments for Orders
    const payment1 = await prisma.payment.create({
        data: {
            orderId: order1.id,
            status: PaymentStatus.PENDING, // Not yet captured
            amount: new Prisma.Decimal(2300.0),
            paymentIntentId: "pi_12345",
            customerId: "cus_67890",
            paymentMethodId: "pm_abcde",
        },
    })

    const payment2 = await prisma.payment.create({
        data: {
            orderId: order2.id,
            status: PaymentStatus.CAPTURED, // Payment captured successfully
            amount: new Prisma.Decimal(800.0),
            paymentIntentId: "pi_23456",
            customerId: "cus_98765",
            paymentMethodId: "pm_fghij",
        },
    })

    // Create Shipments for the Orders
    const shipment1 = await prisma.shipment.create({
        data: {
            orderId: order1.id,
            trackingNumber: "TN123456",
            carrier: "UPS",
            trackingUrl: "https://ups.com/tracking/TN123456",
            shippedAt: new Date(),
            status: ShipmentStatus.IN_TRANSIT, // Item is in transit
            createdBy: user1.id,
            updatedBy: user1.id,
        },
    })

    const shipment2 = await prisma.shipment.create({
        data: {
            orderId: order2.id,
            trackingNumber: "TN789012",
            carrier: "FedEx",
            trackingUrl: "https://fedex.com/tracking/TN789012",
            shippedAt: new Date(),
            status: ShipmentStatus.OUT_FOR_DELIVERY, // Item out for delivery
            createdBy: user2.id,
            updatedBy: user2.id,
        },
    })

    // More complex case: Order with partial payment and multiple shipments
    const order3 = await prisma.order.create({
        data: {
            orderNumber: "ORD003",
            userId: user1.id,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            totalAmount: new Prisma.Decimal(3500.0),
            shippingAddress: "789 Elm St, Los Angeles, CA",
            createdBy: user1.id,
            updatedBy: user1.id,
        },
    })

    // Create Order Items for the third order
    await prisma.orderItem.createMany({
        data: [
            {
                orderId: order3.id,
                productId: product1.id,
                quantity: 2,
                price: new Prisma.Decimal(1500.0),
                createdBy: user1.id,
                updatedBy: user1.id,
            },
            {
                orderId: order3.id,
                productId: product2.id,
                quantity: 1,
                price: new Prisma.Decimal(800.0),
                createdBy: user1.id,
                updatedBy: user1.id,
            },
        ],
    })

    // Create a partial payment for order3
    const payment3 = await prisma.payment.create({
        data: {
            orderId: order3.id,
            status: PaymentStatus.CAPTURED, // Partial payment status
            amount: new Prisma.Decimal(2000.0), // Partial payment
            paymentIntentId: "pi_34567",
            customerId: "cus_11111",
            paymentMethodId: "pm_klmno",
        },
    })

    // Create multiple shipments for order3 (simulating split shipments)
    const shipment3 = await prisma.shipment.create({
        data: {
            orderId: order3.id,
            trackingNumber: "TN345678",
            carrier: "USPS",
            trackingUrl: "https://usps.com/tracking/TN345678",
            shippedAt: new Date(),
            status: ShipmentStatus.OUT_FOR_DELIVERY,
            createdBy: user1.id,
            updatedBy: user1.id,
        },
    })

    const shipment4 = await prisma.shipment.create({
        data: {
            orderId: order3.id,
            trackingNumber: "TN987654",
            carrier: "UPS",
            trackingUrl: "https://ups.com/tracking/TN987654",
            shippedAt: new Date(),
            status: ShipmentStatus.IN_TRANSIT,
            createdBy: user1.id,
            updatedBy: user1.id,
        },
    })

    console.log("Seeding finished successfully!")
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
