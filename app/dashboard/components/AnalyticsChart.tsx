"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartLegend,
    ChartTooltipContent,
    ChartLegendContent,
} from "@/components/ui/chart"
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts"
import { TimeFilter } from "@/components/chart/TimeFilter"
import { formatCurrency } from "@/utils"

export default function AnalyticsChart() {
    const [range, setRange] = useState<"7d" | "30d" | "90d" | "all">("7d")
    const [metrics, setMetrics] = useState<any>(null)

    useEffect(() => {
        const loadMetrics = async () => {
            try {
                const res = await fetch(`/api/dashboard?range=${range}`)
                if (!res.ok) {
                    throw new Error(`Failed to fetch metrics: ${res.status}`)
                }
                const data = await res.json()
                setMetrics(data)
            } catch (err) {
                console.error("Dashboard fetch error:", err)
                setMetrics({ error: true }) // fallback state
            }
        }

        loadMetrics()
    }, [range])

    if (!metrics) return <div>Loading...</div>
    if (metrics.error) return <div>Error loading dashboard metrics.</div>

    const trendData = metrics.orders.map((o: any) => ({
        date: new Date(o.createdAt).toLocaleDateString(),
        revenue: Number(o.total),
    }))

    const chartConfig = {
        revenue: { label: "Revenue", color: "var(--chart-1)" },
    } satisfies unknown

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <TimeFilter onChange={setRange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    ["Total Revenue", formatCurrency(metrics.totalRevenue)],
                    ["Total Profit", formatCurrency(metrics.totalProfit)],
                    ["Items Sold", metrics.totalItemsSold],
                    ["Refunds", formatCurrency(metrics.totalRefunds)],
                    ["Cancelled Orders", metrics.totalCancelled],
                    ["Discounts", metrics.totalDiscounts],
                    ["Shipping", metrics.totalShipping],
                    ["Taxes", metrics.totalTax],
                ].map(([label, value]) => (
                    <Card key={label} className="gap-2">
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">
                                {label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-4xl font-bold">
                            {typeof value === "number"
                                ? value.toLocaleString()
                                : value}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={chartConfig}
                        className="min-h-32 max-h-96 min-w-full pr-8"
                    >
                        <LineChart data={trendData}>
                            <CartesianGrid />
                            <XAxis
                                dataKey="date"
                                tickLine={true}
                                axisLine={false}
                            />
                            <YAxis
                                dataKey="revenue"
                                tickFormatter={(value) => {
                                    if (value >= 1_000_000)
                                        return (
                                            (value / 1_000_000).toFixed(1) + "M"
                                        )
                                    if (value >= 1_000)
                                        return (value / 1_000).toFixed(1) + "K"
                                    return value.toLocaleString()
                                }}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Line dataKey="revenue" stroke="var(--chart-1)" />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
