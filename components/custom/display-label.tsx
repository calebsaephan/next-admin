import * as React from "react"

import { cn } from "@/lib/utils"

function DisplayLabel({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "uppercase text-xs mb-2.5 font-bold font-sans text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}

function DisplayNumberLabel({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "uppercase tracking-wide font-medium font-mono",
                className
            )}
            {...props}
        />
    )
}

export { DisplayLabel, DisplayNumberLabel }
