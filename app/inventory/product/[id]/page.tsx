import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductForm from "../../components/ProductForm"

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id: productId } = await params
    if (!productId) {
        throw new Error("Product ID is required")
    }

    const data = await prisma.product.findUnique({
        where: { id: productId },
        include: { ProductImage: { orderBy: { order: "asc" } } },
    })

    if (!data) return notFound()

    const product = JSON.parse(JSON.stringify(data))

    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col gap-4">
            <h3>Edit Product</h3>
            <ProductForm product={product} />
        </div>
    )
}
