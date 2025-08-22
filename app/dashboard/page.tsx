import { requireAuth } from "@/lib/require-auth"
import AnalyticsChart from "./components/AnalyticsChart"

export default async function Page() {
    const session = await requireAuth()
    return (
        <div className="flex flex-col p-4">
            <AnalyticsChart></AnalyticsChart>
        </div>
    )
}
