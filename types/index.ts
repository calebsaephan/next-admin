import { Order, Payment, User } from "@/app/generated/prisma"

export type OrderWithUserPayment = Order & { user: User; payment: Payment }
