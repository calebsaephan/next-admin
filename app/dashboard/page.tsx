import { requireAuth } from "@/lib/require-auth"

export default async function Page() {
    const session = await requireAuth()
    return (
        <div className="flex flex-col p-4">
            <h3>Dashboard</h3>
            <p>Welcome, {session.user.name ?? session.user.email}</p>
        </div>
    )
}
