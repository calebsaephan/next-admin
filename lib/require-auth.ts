import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "./auth"

export async function requireAuth() {
    const rawHeaders = await headers()

    const session = await auth.api.getSession({
        headers: new Headers(rawHeaders),
    })

    if (!session) {
        redirect("/login")
    }

    return session
}
