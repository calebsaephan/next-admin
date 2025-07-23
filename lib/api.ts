export function handleError(error: unknown): Response {
    if (error instanceof Error) {
        console.error("Error occurred:", error.message)
        return new Response(
            JSON.stringify({
                message: "An error occurred while processing your request.",
                error: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        )
    }

    console.error("Unknown error:", error)
    return new Response(
        JSON.stringify({
            message: "An unknown error occurred.",
            error: "Unknown error",
        }),
        {
            status: 500,
            headers: { "Content-Type": "application/json" },
        }
    )
}
