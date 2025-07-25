export const formatCurrencyNoUnitDisplay = (amount: number | string) => {
    const numberAmount = Number(amount)

    return new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(numberAmount)
}

export const formatCurrency = (amount: number | string) => {
    const numberAmount = Number(amount)

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(numberAmount)
}

export const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}
