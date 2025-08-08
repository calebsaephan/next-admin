"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DisplayLabel } from "@/components/custom/display-label"
import { Separator } from "@/components/ui/separator"
import ProductImageUploader from "./ProductImageUploader"

export default function ProductForm({ product }: { product: any }) {
    const router = useRouter()
    const isEdit = !!product

    const [name, setName] = useState(product?.name || "")
    const [price, setPrice] = useState(
        product?.price
            ? parseFloat(product.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })
            : ""
    )
    const [stock, setStock] = useState(product?.stock || 0)
    const [description, setDescription] = useState(product?.description || "")
    const [images, setImages] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const newImages = [...images, ...files].slice(0, 6)
        setImages(newImages)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("price", price.replace(/,/g, ""))
            formData.append("stock", stock.toString())
            formData.append("description", description)

            images.forEach((file) => formData.append("images", file))

            const endpoint = isEdit
                ? `/api/products/${product.id}`
                : "/api/products"

            const res = await fetch(endpoint, {
                method: isEdit ? "PUT" : "POST",
                body: formData,
            })

            if (!res.ok) throw new Error("Failed to save product")

            router.push("/inventory")
        } catch (err) {
            console.error(err)
            alert("Failed to save product. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-12 text-sm">
            <Card>
                <CardContent className="px-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <DisplayLabel>Name</DisplayLabel>
                            <Input
                                placeholder="Product name"
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <DisplayLabel>Price (USD)</DisplayLabel>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                                    $
                                </span>
                                <Input
                                    type="text"
                                    inputMode="decimal"
                                    className="pl-6 pt-[0.2rem]"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(
                                            e.currentTarget.value.replace(
                                                /[^0-9.,]/g,
                                                ""
                                            )
                                        )
                                    }
                                    onBlur={() => {
                                        const value = parseFloat(
                                            price.replace(/,/g, "")
                                        )
                                        if (!isNaN(value)) {
                                            setPrice(
                                                value.toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })
                                            )
                                        }
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <DisplayLabel>Stock Quantity</DisplayLabel>
                            <Input
                                type="number"
                                placeholder="0"
                                value={stock}
                                onChange={(e) =>
                                    setStock(parseInt(e.target.value, 10))
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <DisplayLabel>Description</DisplayLabel>
                        <Textarea
                            rows={4}
                            placeholder="Enter product description..."
                            value={description}
                            onChange={(e) =>
                                setDescription(e.currentTarget.value)
                            }
                        />
                    </div>

                    <Separator />

                    <div className="flex flex-col">
                        <DisplayLabel>Product Images</DisplayLabel>
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className="w-sm mx-auto">
                        <ProductImageUploader
                            imageUrls={product?.ProductImage?.map(
                                (img: any) => img.imageUrl
                            )}
                        />
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? isEdit
                                    ? "Saving..."
                                    : "Adding..."
                                : isEdit
                                ? "Save Changes"
                                : "Add Product"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
