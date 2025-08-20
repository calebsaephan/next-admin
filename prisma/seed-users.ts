import { PrismaClient } from "@/app/generated/prisma"
import { auth } from "@/lib/auth"

const prisma = new PrismaClient()

async function main() {
    const email = "admin@example.com"
    const plainPassword = "supersecretpassword"
    const name = "Caleb Saephan"

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        console.log("User already exists:", email)
        return
    }

    const newUser = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password: plainPassword,
        },
    })

    console.log("Created user:", newUser)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
