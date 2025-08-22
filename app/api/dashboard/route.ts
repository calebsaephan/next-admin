import { getDashboardMetrics } from "@/lib/analytics"
import { NextRequest, NextResponse } from "next/server"
import { DashboardRange } from "@/lib/analytics"

export async function GET(req: NextRequest) {
    const range =
        (req.nextUrl.searchParams.get("range") as DashboardRange) || "7d"

    try {
        const data = await getDashboardMetrics(range)
        return NextResponse.json(data)
    } catch (error) {
        console.error("Dashboard API error:", error)
        return NextResponse.json(
            { error: "Failed to load metrics" },
            { status: 500 }
        )
    }
}
