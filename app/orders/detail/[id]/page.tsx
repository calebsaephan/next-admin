import prisma from "@/lib/prisma"
import { OrderWithFullDetails } from "@/types"

export default async function Page({ params }: { params: { id: string } }) {
    const { id: orderId } = params
    if (!orderId) {
        throw new Error("Order ID is required")
    }
    const data = await prisma.order.findUnique({
        include: {
            user: true,
            payments: true,
            shipments: true,
            lineItems: true,
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
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">
                Order #{order.orderNumber} Details
            </h1>
            <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-medium mb-4">
                    Customer Information
                </h2>
                <p>
                    <strong>Name:</strong> {order.user.name}
                </p>
                <p>
                    <strong>Email:</strong> {order.user.email}
                </p>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                <p>
                    <strong>Status:</strong> {order.status}
                </p>
                <p>
                    <strong>Total:</strong> ${order.total.toString()}
                </p>
                <p>
                    <strong>Subtotal:</strong> ${order.subtotal.toString()}
                </p>
                <p>
                    <strong>Tax:</strong> ${order.tax.toString()}
                </p>
                <p>
                    <strong>Discount:</strong> ${order.discount.toString()}
                </p>
                <p>
                    <strong>Shipping:</strong> ${order.shipping.toString()}
                </p>
                <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(order.updatedAt).toLocaleDateString()}
                </p>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-medium mb-4">
                    Payment Information
                </h2>
                {order.payments.length > 0 ? (
                    order.payments.map((payment, index) => (
                        <div key={index} className="mb-4">
                            <p>
                                <strong>Payment Status:</strong>{" "}
                                {payment.status}
                            </p>
                            <p>
                                <strong>Amount:</strong> $
                                {payment.amount.toString()} {payment.currency}
                            </p>
                            <p>
                                <strong>Payment Intent ID:</strong>{" "}
                                {payment.paymentIntentId}
                            </p>
                            <p>
                                <strong>Paid At:</strong>{" "}
                                {payment.paidAt
                                    ? new Date(
                                          payment.paidAt
                                      ).toLocaleDateString()
                                    : "Not Paid"}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No payment information available.</p>
                )}
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-medium mb-4">
                    Shipment Information
                </h2>
                {order.shipments.length > 0 ? (
                    order.shipments.map((shipment, index) => (
                        <div key={index} className="mb-4">
                            <p>
                                <strong>Tracking Number:</strong>{" "}
                                {shipment.trackingNumber}
                            </p>
                            <p>
                                <strong>Carrier:</strong> {shipment.carrier}
                            </p>
                            <p>
                                <strong>Status:</strong> {shipment.status}
                            </p>
                            <p>
                                <strong>Shipped At:</strong>{" "}
                                {new Date(
                                    shipment.shippedAt
                                ).toLocaleDateString()}
                            </p>
                            {shipment.trackingUrl && (
                                <p>
                                    <a
                                        href={shipment.trackingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500"
                                    >
                                        Track Shipment
                                    </a>
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No shipment information available.</p>
                )}
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-medium mb-4">Line Items</h2>
                {order.lineItems.length > 0 ? (
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Product</th>
                                <th className="px-4 py-2 text-left">
                                    Quantity
                                </th>
                                <th className="px-4 py-2 text-left">Price</th>
                                <th className="px-4 py-2 text-left">
                                    Discount
                                </th>
                                <th className="px-4 py-2 text-left">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.lineItems.map((lineItem) => (
                                <tr key={lineItem.id}>
                                    <td className="px-4 py-2">
                                        Prdocut Name
                                        {lineItem.product?.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {lineItem.quantity}
                                    </td>
                                    <td className="px-4 py-2">
                                        ${lineItem.price.toString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        ${lineItem.discount.toString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        $
                                        {(
                                            parseFloat(
                                                lineItem.price.toString()
                                            ) *
                                                lineItem.quantity -
                                            parseFloat(
                                                lineItem.discount.toString()
                                            )
                                        ).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No line items available.</p>
                )}
            </div>
        </div>
    )
}
