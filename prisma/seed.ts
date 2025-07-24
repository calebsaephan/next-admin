import {
    PrismaClient,
    OrderStatus,
    PaymentStatus,
    ShipmentStatus,
    RefundStatus,
} from "@/app/generated/prisma"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

const generateOrderNumber = async () => {
    const sequence: any =
        await prisma.$queryRaw`SELECT nextval('order_number_seq')`
    return `ORD${sequence[0].nextval.toString()}`
}

const generateRandomPriceAndStock = () => {
    return {
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
        stock: faker.number.int({ min: 10, max: 100 }),
    }
}

async function main() {
    const users = []
    for (let i = 0; i < 10; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                name: faker.person.fullName(),
            },
        })
        users.push(user)
    }

    const products = []
    for (let i = 0; i < 10; i++) {
        const { price, stock } = generateRandomPriceAndStock()
        const product = await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price,
                stock,
            },
        })
        products.push(product)
    }

    for (let i = 0; i < 10; i++) {
        const orderNumber = await generateOrderNumber()
        const order = await prisma.order.create({
            data: {
                orderNumber: orderNumber,
                userId: users[i % users.length].id,
                status: OrderStatus.PENDING,
                total: parseFloat(
                    faker.commerce.price({ min: 100, max: 5000, dec: 2 })
                ),
                subtotal: parseFloat(
                    faker.commerce.price({ min: 100, max: 4000, dec: 2 })
                ),
                tax: parseFloat(
                    faker.commerce.price({ min: 10, max: 200, dec: 2 })
                ),
                discount: parseFloat(
                    faker.commerce.price({ min: 0, max: 100, dec: 2 })
                ),
                shipping: parseFloat(
                    faker.commerce.price({ min: 10, max: 50, dec: 2 })
                ),
                shippingAddress: faker.location.streetAddress(),
                lineItems: {
                    create: products.slice(0, 3).map((product) => ({
                        productId: product.id,
                        quantity: faker.number.int({ min: 1, max: 3 }),
                        price: product.price,
                        discount: 0,
                    })),
                },
            },
        })

        const payment = await prisma.payment.create({
            data: {
                status: PaymentStatus.SUCCEEDED,
                amount: order.total,
                currency: "usd",
                paymentIntentId: "pi_" + faker.string.alphanumeric(20),
                customerId: "cus_" + faker.string.alphanumeric(20),
                chargeId: "ch_" + faker.string.alphanumeric(20),
                paidAt: new Date(),
                orderId: order.id, // Directly associating the order with the payment
            },
        })

        const shipment = await prisma.shipment.create({
            data: {
                orderId: order.id,
                trackingNumber: "1Z" + faker.string.alphanumeric(18),
                carrier: "UPS",
                trackingUrl:
                    "https://www.ups.com/track?tracknum=1Z" +
                    faker.string.alphanumeric(18),
                shippedAt: new Date(),
                status: ShipmentStatus.IN_TRANSIT,
            },
        })

        if (i % 3 === 0) {
            const refund = await prisma.refund.create({
                data: {
                    paymentId: payment.id,
                    amount: parseFloat(
                        faker.commerce.price({ min: 10, max: 1000, dec: 2 })
                    ),
                    reason: "Item returned",
                    status: RefundStatus.PENDING,
                    paymentIntentId: payment.paymentIntentId,
                    createdAt: new Date(),
                },
            })
        }
    }

    console.log("Seed data created successfully")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
