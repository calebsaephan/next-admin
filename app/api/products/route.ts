import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()

        const name = formData.get("name")?.toString()
        const price = parseFloat(formData.get("price")?.toString() || "0")
        const stock = parseInt(formData.get("stock")?.toString() || "0", 10)
        const description = formData.get("description")?.toString()
        const images = formData.getAll("images") as File[]

        if (!name || isNaN(price) || isNaN(stock)) {
            return NextResponse.json(
                { error: "Invalid input" },
                { status: 400 }
            )
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                price,
                stock,
                description,
            },
        })

        if (images.length > 0) {
            // TODO: image upload
        }

        return NextResponse.json({ success: true, product: newProduct })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        )
    }
}
