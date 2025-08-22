"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export default function Page() {
    const { data: session, isPending, refetch } = authClient.useSession()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name ?? "")
            setEmail(session.user.email ?? "")
            setImage(session.user.image ?? "")
        }
    }, [session])

    const handleUpdate = async () => {
        setLoading(true)
        setMessage("")

        try {
            await authClient.updateUser({ name, image })
            setMessage("Profile updated successfully")

            refetch?.()
        } catch (err) {
            console.error("Update failed:", err)
            setMessage("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    if (isPending) return <div>Loading...</div>
    if (!session?.user) return <div>Please sign in to view settings.</div>

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Account Details</h1>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Name
                    </label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Profile Image URL
                    </label>
                    <Input
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        disabled
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        disabled
                    />
                </div>

                <Button onClick={handleUpdate} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>

                {message && <div className="text-sm mt-2">{message}</div>}
            </div>
        </div>
    )
}
