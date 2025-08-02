import prisma from "@/lib/prisma"
import OrdersTable from "./components/OrdersTable"

export default async function Page() {
    const data = await prisma.order.findMany({
        include: {
            user: true,
            payments: true,
        },
    })

    const orders = await JSON.parse(JSON.stringify(data))

    return (
        <div className="flex flex-col p-4">
            <h3>Orders</h3>
            <OrdersTable orders={orders}></OrdersTable>
        </div>
    )
}
