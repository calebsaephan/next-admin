"use client"

import { DashboardRange } from "@/lib/analytics"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const RANGES: { label: string; value: DashboardRange }[] = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 90 Days", value: "90d" },
    { label: "All Time", value: "all" },
]

export function TimeFilter({
    onChange,
}: {
    onChange: (range: DashboardRange) => void
}) {
    const [selected, setSelected] = useState<DashboardRange>("7d")

    return (
        <div className="flex space-x-2">
            {RANGES.map((r) => (
                <Button
                    key={r.value}
                    variant={r.value === selected ? "default" : "outline"}
                    onClick={() => {
                        setSelected(r.value)
                        onChange(r.value)
                    }}
                >
                    {r.label}
                </Button>
            ))}
        </div>
    )
}
