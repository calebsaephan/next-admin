import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { writeFile } from "fs/promises"
import prisma from "@/lib/prisma"

export async function PUT(
    req: NextRequest,
    { params }: { params: { productId: string } }
) {
    const formData = await req.formData()

    const name = formData.get("name")?.toString()
    const price = parseFloat(formData.get("price")?.toString() || "0")
    const stock = parseInt(formData.get("stock")?.toString() || "0", 10)
    const description = formData.get("description")?.toString()
    const images = formData.getAll("images") as File[]

    if (!name || isNaN(price) || isNaN(stock)) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    try {
        const updatedProduct = await prisma.product.update({
            where: { id: params.productId },
            data: {
                name,
                price,
                stock,
                description,
            },
        })

        if (images.length > 0) {
            await prisma.productImage.deleteMany({
                where: { productId: params.productId },
            })

            await Promise.all(
                images.map(async (file, idx) => {
                    const buffer = Buffer.from(await file.arrayBuffer())
                    const fileName = `${crypto.randomUUID()}-${file.name}`
                    const uploadPath = path.join(
                        process.cwd(),
                        "public/uploads",
                        fileName
                    )

                    await writeFile(uploadPath, buffer)

                    return prisma.productImage.create({
                        data: {
                            productId: updatedProduct.id,
                            imageUrl: `/uploads/${fileName}`,
                            order: idx,
                        },
                    })
                })
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        )
    }
}
