"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function ProductImageGallery({
    imageUrls = [],
}: {
    imageUrls: (string | null)[]
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const images = [...imageUrls]
    while (images.length < 6) images.push(null)

    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-4">
                {images.map((url, index) => (
                    <div
                        key={index}
                        className={`relative aspect-square border rounded-md overflow-hidden ${
                            url ? "cursor-pointer" : "cursor-default"
                        }`}
                        onClick={() => {
                            if (url) setPreviewUrl(url)
                        }}
                    >
                        {url ? (
                            <img
                                src={url}
                                alt={`Product Image ${index + 1}`}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-muted select-none">
                                <PlusIcon className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Dialog
                open={!!previewUrl}
                onOpenChange={() => setPreviewUrl(null)}
            >
                <DialogContent className="p-0 max-w-3xl bg-background border-none shadow-none">
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Full Preview"
                            className="w-full h-auto max-h-[90vh] object-contain rounded"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
