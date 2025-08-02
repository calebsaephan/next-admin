export const formatCurrencyNoUnitDisplay = (amount: number | string) => {
    const numberAmount = Number(amount)

    return new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(numberAmount)
}

export const formatCurrency = (
    amount: number | string,
    locale = "en-US",
    currency = "USD"
) => {
    const numberAmount = Number(amount)

    if (isNaN(numberAmount)) return ""

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(numberAmount)
}

export const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}
