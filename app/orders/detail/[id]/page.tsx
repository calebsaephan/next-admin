import {
    DisplayLabel,
    DisplayNumberLabel,
    DisplayCurrencyLabel,
} from "@/components/custom/display-label"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import prisma from "@/lib/prisma"
import { OrderWithFullDetails } from "@/types"
import { capitalize, formatCurrencyNoUnitDisplay } from "@/utils"
import { getStatusBadgeVariant } from "@/utils/orders"
import { MoveLeft } from "lucide-react"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id: orderId } = await params
    if (!orderId) {
        throw new Error("Order ID is required")
    }
    const data = await prisma.order.findUnique({
        include: {
            customer: true,
            payments: true,
            shipments: true,
            lineItems: {
                include: {
                    product: true,
                },
            },
        },
        where: {
            id: orderId,
        },
    })

    if (!data) {
        throw new Error("Order not found")
    }
    const order: OrderWithFullDetails = await JSON.parse(JSON.stringify(data))

    return (
        <div className="w-full md:max-w-xl lg:max-w-5xl md:mx-auto p-6 text-sm">
            <div className="mb-4">
                <a href="/orders">
                    <Button
                        variant={"discreetLink"}
                        className="px-0 has-[>svg]:px-0"
                    >
                        <MoveLeft />
                        Back to Orders
                    </Button>
                </a>
            </div>
            <h2 className="mb-6 items-center flex">
                Order Details
                <code className="ml-4 px-4 text-lg border font-sans">
                    #{order.orderNumber}
                </code>
            </h2>
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-6">
                    <div>
                        <h5 className="mb-2">Customer</h5>
                        <Card>
                            <CardContent>
                                <div className="grid grid-cols-3">
                                    <div className="flex flex-col">
                                        <DisplayLabel>Name</DisplayLabel>
                                        <span>{order.customer.name}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <DisplayLabel>Email</DisplayLabel>
                                        <span>{order.customer.email}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <h5 className="mb-2">Order Summary</h5>
                        <Card>
                            <CardContent className="flex flex-col gap-6">
                                <div className="grid grid-cols-3">
                                    <div className="flex flex-col">
                                        <DisplayLabel>Status</DisplayLabel>
                                        <span>
                                            <Badge
                                                variant={getStatusBadgeVariant(
                                                    order.status
                                                )}
                                            >
                                                {capitalize(order.status)}
                                            </Badge>
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <DisplayLabel>Created At</DisplayLabel>
                                        <span>
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <DisplayLabel>
                                            Last Updated
                                        </DisplayLabel>
                                        <span>
                                            {new Date(
                                                order.updatedAt
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col max-w-xs gap-1 mt-2 mr-auto text-sm text-right [&>div]:items-baseline [&>div>span]:mb-0">
                                    <div className="grid grid-cols-2 gap-x-12">
                                        <DisplayLabel>Subtotal</DisplayLabel>
                                        <DisplayCurrencyLabel
                                            value={order.subtotal.toString()}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-12">
                                        <DisplayLabel>Tax</DisplayLabel>
                                        <DisplayCurrencyLabel
                                            value={order.tax.toString()}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-12">
                                        <DisplayLabel>Discount</DisplayLabel>
                                        <DisplayCurrencyLabel
                                            value={order.discount.toString()}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-12">
                                        <DisplayLabel>Shipping</DisplayLabel>
                                        <DisplayCurrencyLabel
                                            value={order.shipping.toString()}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-12">
                                        <DisplayLabel>Total</DisplayLabel>
                                        <DisplayCurrencyLabel
                                            value={order.total.toString()}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div>
                    <h5 className="mb-2">Line Items</h5>
                    <div className="rounded overflow-hidden border shadow">
                        {order.lineItems.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="text-right">
                                            Price
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Discount
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Subtotal
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.lineItems.map((lineItem) => {
                                        const price = Number(lineItem.price)
                                        const discount = Number(
                                            lineItem.discount
                                        )
                                        const subtotal =
                                            price * lineItem.quantity - discount

                                        return (
                                            <TableRow key={lineItem.id}>
                                                <TableCell>
                                                    {lineItem.product?.name}
                                                </TableCell>
                                                <TableCell>
                                                    {lineItem.quantity}
                                                </TableCell>
                                                <TableCell>
                                                    <DisplayCurrencyLabel
                                                        value={price}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <DisplayCurrencyLabel
                                                        value={discount}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <DisplayCurrencyLabel
                                                        value={subtotal}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        ) : (
                            <p>No line items available.</p>
                        )}
                    </div>
                </div>

                <div>
                    <h5 className="mb-2">Payments</h5>
                    <Accordion
                        type="multiple"
                        className="w-full bg-card shadow px-6 border rounded"
                    >
                        {order.payments.length > 0 ? (
                            order.payments.map((payment, index) => (
                                <AccordionItem
                                    key={index}
                                    value={index.toString()}
                                >
                                    <AccordionTrigger>
                                        <span>Payment Id</span> {payment.id}
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 text-balance">
                                        <Separator></Separator>
                                        <div className="flex flex-col my-4 gap-2">
                                            <div className="grid grid-cols-2">
                                                <DisplayLabel>
                                                    Payment Status
                                                </DisplayLabel>
                                                <span>{payment.status}</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <DisplayLabel>
                                                    Amount
                                                </DisplayLabel>
                                                <DisplayNumberLabel>
                                                    {formatCurrencyNoUnitDisplay(
                                                        payment.amount.toString()
                                                    )}
                                                    <span className="uppercase">
                                                        {" " + payment.currency}
                                                    </span>
                                                </DisplayNumberLabel>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <DisplayLabel>
                                                    Payment Intent ID
                                                </DisplayLabel>
                                                <code className="-ml-1.5">
                                                    {payment.paymentIntentId}
                                                </code>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <DisplayLabel>
                                                    Paid At
                                                </DisplayLabel>
                                                <span>
                                                    {payment.paidAt
                                                        ? new Date(
                                                              payment.paidAt
                                                          ).toLocaleString()
                                                        : "Not Paid"}
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        ) : (
                            <p>No payment information available.</p>
                        )}
                    </Accordion>
                </div>

                <div>
                    <h5 className="mb-2">Shipments</h5>
                    <Accordion
                        type="multiple"
                        className="w-full bg-card shadow px-6 border rounded"
                    >
                        {order.shipments.length > 0 ? (
                            order.shipments.map((shipment, index) => (
                                <AccordionItem
                                    key={index}
                                    value={index.toString()}
                                >
                                    <AccordionTrigger>
                                        <span>Tracking Number</span>
                                        {shipment.trackingNumber}
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 text-balance">
                                        <Separator></Separator>
                                        <div className="grid grid-cols-3 gap-y-8 gap-x-2">
                                            <div className="flex flex-col">
                                                <DisplayLabel>
                                                    Carrier
                                                </DisplayLabel>
                                                <span>{shipment.carrier}</span>
                                            </div>

                                            <div className="flex flex-col">
                                                <DisplayLabel>
                                                    Status
                                                </DisplayLabel>
                                                <span>{shipment.status}</span>
                                            </div>

                                            <div className="flex flex-col">
                                                <DisplayLabel>
                                                    Shipped At
                                                </DisplayLabel>
                                                <span>
                                                    {new Date(
                                                        shipment.shippedAt
                                                    ).toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex flex-col">
                                                <DisplayLabel>
                                                    Tracking Number
                                                </DisplayLabel>
                                                <span>
                                                    {shipment.trackingNumber}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            {shipment.trackingUrl && (
                                                <a
                                                    href={shipment.trackingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500"
                                                >
                                                    <Button>
                                                        Track Shipment
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        ) : (
                            <p>No shipment information available.</p>
                        )}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}
