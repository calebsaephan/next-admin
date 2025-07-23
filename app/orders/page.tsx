import { PrismaClient } from "../generated/prisma"
import OrdersTable from "./components/OrdersTable"
const prisma = new PrismaClient()

export default async function Page() {
    const data = await prisma.order.findMany({
        include: {
            user: true,
            payments: true,
        },
    })

    const orders = await JSON.parse(JSON.stringify(data))
    console.log(orders)

    return (
        <div className="flex flex-col p-4 gap-4">
            <h3>Orders</h3>
            <OrdersTable orders={orders}></OrdersTable>
        </div>
    )
}
