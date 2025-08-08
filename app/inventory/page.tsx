import prisma from "@/lib/prisma"
import InventoryTable from "./components/InventoryTable"

export default async function Page() {
    const data = await prisma.product.findMany()

    const products = await JSON.parse(JSON.stringify(data))

    return (
        <div className="flex flex-col p-4">
            <h3>Inventory</h3>
            <InventoryTable products={products}></InventoryTable>
        </div>
    )
}
