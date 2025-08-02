import * as React from "react"

import { cn } from "@/lib/utils"
import { formatCurrency, formatCurrencyNoUnitDisplay } from "@/utils"
import { DisplayCurrencyLabelProps } from "@/types"

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
            className={cn("uppercase font-medium font-sans", className)}
            {...props}
        />
    )
}

function DisplayCurrencyLabel({
    className,
    value,
    locale,
    currency,
    showUnits = true,
    ...props
}: DisplayCurrencyLabelProps) {
    return (
        <span
            className={cn(
                "uppercase font-medium font-sans text-right block",
                className
            )}
            {...props}
        >
            {showUnits
                ? formatCurrency(value, locale, currency)
                : formatCurrencyNoUnitDisplay(value)}
        </span>
    )
}

export { DisplayLabel, DisplayNumberLabel, DisplayCurrencyLabel }
