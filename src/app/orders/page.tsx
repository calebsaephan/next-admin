import OrdersTable from "./components/OrdersTable"

export default function Page() {
    return (
        <div className="flex flex-col p-4 gap-4">
            <h3>Orders</h3>
            <OrdersTable></OrdersTable>
        </div>
    )
}
