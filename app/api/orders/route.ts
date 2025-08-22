import { handleError } from "@/lib/api"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const orders = await prisma.order.findMany({
            include: {
                customer: true,
                payments: true,
            },
        })

        return new Response(JSON.stringify(orders), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error: any) {
        console.error("Error fetching orders:", error)

        handleError(error)
    } finally {
        await prisma.$disconnect()
    }
}
