import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getOrderByIdAPI } from "../services/orderService"
import OrderStatusBadge from "../components/OrderStatusBadge"
import OrderProgress from "../components/OrderProgress"

const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderByIdAPI(id)
        setOrder(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) return <div className="p-12">Loading...</div>
  if (!order) return <div className="p-12">Order not found.</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{order.orderNumber}</h2>
        <OrderStatusBadge status={order.status} />
      </div>

      <p className="text-sm text-gray-500 mt-2">{order.formattedDate}</p>

      <OrderProgress status={order.status} />

      <div className="mt-8 space-y-3">
        {order.items.map(item => (
          <div key={item.product._id} className="flex justify-between">
            <span>
              {item.product.name} x {item.quantity}
            </span>
            <span>
              ${(item.priceAtPurchase * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t mt-6 pt-4 flex justify-between font-semibold">
        <span>Total</span>
        <span>${order.total.toFixed(2)}</span>
      </div>
    </div>
  )
}

export default OrderDetails
