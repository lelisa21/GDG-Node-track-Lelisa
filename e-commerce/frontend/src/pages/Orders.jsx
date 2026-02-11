import { useEffect, useState } from "react"
import { getOrdersAPI, cancelOrderAPI } from "../services/orderService"
import { getSessionId } from "../utils/session"
import { FiPackage } from "react-icons/fi"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const sessionId = getSessionId()
        const data = await getOrdersAPI(sessionId)
        setOrders(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleCancel = async (id) => {
    try {
      await cancelOrderAPI(id)

      setOrders(prev =>
        prev.map(order =>
          order._id === id
            ? { ...order, status: "cancelled" }
            : order
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-12">Loading...</div>

  if (orders.length === 0)
    return (
      <div className="p-12 text-center">
        <FiPackage size={40} className="mx-auto mb-4 text-gray-400" />
        No orders yet.
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <h2 className="text-2xl font-semibold">Your Orders</h2>

      {orders.map(order => (
        <div key={order._id} className="border border-gray-200 p-6 rounded-lg">
          <div className="flex justify-between mb-4">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>
              <p className="text-sm text-gray-500">
                {order.formattedDate}
              </p>
            </div>

            <span className="capitalize bg-gray-100 px-3 py-1 rounded text-sm">
              {order.status}
            </span>
          </div>

          {order.items.map(item => (
            <div
              key={item.product._id}
              className="flex justify-between text-sm mb-2"
            >
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>
                ${(item.priceAtPurchase * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>

          {order.status === "pending" && (
            <button
              onClick={() => handleCancel(order._id)}
              className="mt-4 text-red-600 text-sm"
            >
              Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default Orders
