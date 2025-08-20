"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { GalleryVerticalEnd, Loader2 } from "lucide-react" // Using Loader2 icon for loading spinner

export default function Page() {
    const [email, setEmail] = useState("admin@example.com")
    const [password, setPassword] = useState("supersecretpassword")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const login = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true) // Start loading

        if (!email) {
            setError("Unknown email")
            setIsLoading(false)
            return
        }

        try {
            const res = await authClient.signIn.email({
                email,
                password,
                callbackURL: "/dashboard",
            })

            if (res.error) {
                setError(
                    res.error.message || res.error.statusText || "Login failed"
                )
                setIsLoading(false)
            }
        } catch {
            setError("Login failed")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
            <div className="text-center">
                <GalleryVerticalEnd className="mx-auto mb-4" />
                <h3>Acme Inc.</h3>
                <small>ProductFlow</small>
            </div>
            <form
                onSubmit={login}
                className="w-full max-w-md p-8 shadow-md rounded"
            >
                <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {error && <p className="text-red-600">{error}</p>}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin h-5 w-5" />
                                Signing in...
                            </div>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
