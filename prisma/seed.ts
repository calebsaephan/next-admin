import {
    PrismaClient,
    OrderStatus,
    PaymentStatus,
    ShipmentStatus,
    RefundStatus,
    Product,
    UserAddress,
    Order,
    User,
    Payment,
    Prisma,
} from "@/app/generated/prisma"
import { Decimal } from "@/app/generated/prisma/runtime/library"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

const generateOrderNumber = async () => {
    const sequence: any =
        await prisma.$queryRaw`SELECT nextval('order_number_seq')`
    return `ORD${sequence[0].nextval.toString()}`
}

const generateRandomPriceAndStock = () => {
    return {
        price: new Decimal(
            parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 }))
        ),
        stock: faker.number.int({ min: 10, max: 100 }),
    }
}

const generateShippingAddresses = async (
    amount: number = 100
): Promise<UserAddress[]> => {
    const addresses = []

    for (let i = 0; i < amount; i++) {
        const addr = {
            addressLine1: faker.location.streetAddress(),
            addressLine2: faker.location.secondaryAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            postalCode: faker.location.zipCode(),
            country: faker.location.country(),
            isDefault: true,
        }

        addresses.push(addr)
    }

    const addressesDB = await prisma.userAddress.createManyAndReturn({
        data: addresses,
    })
    return addressesDB
}

const createProduct = () => {
    const { price, stock } = generateRandomPriceAndStock()
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price,
        stock,
    }
}

const generateProducts = async (amount: number = 100): Promise<Product[]> => {
    const products = []
    for (let i = 0; i < amount; i++) {
        const product = createProduct()
        products.push(product)
    }

    const productsDB = await prisma.product.createManyAndReturn({
        data: products,
    })

    return productsDB
}

const createLineItem = async (orderId: string, products: Product[]) => {
    const randomProduct = faker.helpers.arrayElement(products)

    return {
        orderId,
        productId: randomProduct.id,
        quantity: faker.number.int({ min: 1, max: 3 }),
        price: randomProduct.price,
        discount: 0,
    }
}

const createShipment = async (orderId: string) => {
    return {
        orderId,
        trackingNumber: faker.string.uuid(),
        carrier: faker.company.name(),
        trackingUrl: faker.internet.url(),
        shippedAt: faker.date.past(),
        status: faker.helpers.arrayElement([
            ShipmentStatus.PENDING,
            ShipmentStatus.AWAITING_PICKUP,
            ShipmentStatus.IN_TRANSIT,
            ShipmentStatus.OUT_FOR_DELIVERY,
            ShipmentStatus.DELIVERED,
            ShipmentStatus.DELAYED,
            ShipmentStatus.FAILED,
            ShipmentStatus.RETURNED,
        ]),
    }
}

const createRefund = async (paymentId: string) => {
    return {
        paymentId,
        amount: parseFloat(faker.commerce.price()),
        reason: faker.commerce.productName(),
        status: faker.helpers.arrayElement([
            RefundStatus.PENDING,
            RefundStatus.SUCCEEDED,
            RefundStatus.FAILED,
            RefundStatus.CANCELED,
        ]),
        paymentIntentId: faker.string.uuid(),
    }
}

const createOrder = async (userId: string, address: UserAddress) => {
    const orderNumber = await generateOrderNumber()
    const subtotal = parseFloat(faker.commerce.price())
    const tax = subtotal * 0.1
    const shipping = faker.number.int({ min: 5, max: 20 })
    const discount =
        faker.number.int({ min: 0, max: 10 }) === 0
            ? faker.number.int({ min: 5, max: 50 })
            : 0

    const order = {
        orderNumber,
        userId,
        status: faker.helpers.arrayElement([
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PROCESSING,
            OrderStatus.PARTIALLY_SHIPPED,
            OrderStatus.PARTIALLY_REFUNDED,
            OrderStatus.SHIPPED,
            OrderStatus.COMPLETED,
            OrderStatus.CANCELLED,
        ]),
        total: subtotal + tax + shipping - discount,
        subtotal,
        tax,
        shipping: parseFloat(shipping.toString()),
        discount: parseFloat(discount.toString()),
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.postalCode,
    }

    return order
}

const generateLineItemsForOrders = async (
    orders: Order[],
    products: Product[]
) => {
    const lineItemsData = []
    const numLineItems = faker.number.int({ min: 1, max: 10 })
    for (const order of orders) {
        for (let i = 0; i < numLineItems; i++) {
            const lineItem = await createLineItem(order.id, products)
            lineItemsData.push(lineItem)
        }
    }

    await prisma.lineItem.createMany({
        data: lineItemsData,
    })
}

const generateUsers = async (amount: number): Promise<User[]> => {
    const users = []
    for (let i = 0; i < amount; i++) {
        const userData = {
            email: faker.internet.email(),
            name: faker.person.fullName(),
            phoneNumber: faker.phone.number(),
        }
        users.push(userData)
    }
    const usersDB = await prisma.user.createManyAndReturn({
        data: users,
    })

    return usersDB
}

const generatePayments = async (orders: Order[]) => {
    const payments = []

    for (const order of orders) {
        for (let i = 0; i < faker.number.int({ min: 0, max: 3 }); i++) {
            const payment: Prisma.PaymentCreateManyInput = {
                status: faker.helpers.arrayElement([
                    PaymentStatus.PENDING,
                    PaymentStatus.SUCCEEDED,
                    PaymentStatus.FAILED,
                    PaymentStatus.REFUNDED,
                    PaymentStatus.REQUIRES_ACTION,
                    PaymentStatus.CANCELED,
                    PaymentStatus.PROCESSING,
                ]),
                amount: new Decimal(parseFloat(faker.commerce.price())),
                paymentIntentId: faker.string.uuid(),
                customerId: faker.string.uuid(),
                chargeId: faker.string.uuid(),
                orderId: order.id,
                paidAt: faker.date.anytime(),
            }

            payments.push(payment)
        }
    }
    const paymentsDB = await prisma.payment.createManyAndReturn({
        data: payments,
    })

    return paymentsDB
}

const generateShipments = async (orders: Order[]) => {
    const shipments = []

    for (const order of orders) {
        for (let i = 0; i < faker.number.int({ min: 0, max: 3 }); i++) {
            const shipment = await createShipment(order.id)
            shipments.push(shipment)
        }
    }

    const shipmentsDB = await prisma.shipment.createManyAndReturn({
        data: shipments,
    })

    return shipmentsDB
}

const generateRefunds = async (payments: Payment[]) => {
    const refunds = []
    for (const payment of payments) {
        for (let i = 0; i < faker.number.int({ min: 0, max: 3 }); i++) {
            const refund = await createRefund(payment.id)

            refunds.push(refund)
        }
    }

    const refundsDB = await prisma.refund.createManyAndReturn({
        data: refunds,
    })
    return refundsDB
}

const generateOrders = async (
    amount: number,
    users: User[],
    addresses: UserAddress[]
) => {
    const orders = []
    for (let i = 0; i < amount; i++) {
        const randomUser = faker.helpers.arrayElement(users)
        const randomAddr = faker.helpers.arrayElement(addresses)
        const order = await createOrder(randomUser.id, randomAddr)

        orders.push(order)
    }

    const ordersDB = await prisma.order.createManyAndReturn({
        data: orders,
    })
    return ordersDB
}

const seed = async () => {
    const users = await generateUsers(100)
    const addresses = await generateShippingAddresses(100)
    const products = await generateProducts(100)
    const orders = await generateOrders(100, users, addresses)

    await generateLineItemsForOrders(orders, products)
    const payments = await generatePayments(orders)
    await generateShipments(orders)
    await generateRefunds(payments)

    console.log("Seeding completed!")
}

seed()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
