import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getOrdersAPI, cancelOrderAPI } from "../services/orderService"
import { FiPackage } from "react-icons/fi"
import OrderStatusBadge from "../components/OrderStatusBadge"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancelingId, setCancelingId] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const filterOptions = ["all", "pending", "processing", "shipped", "delivered", "cancelled"]

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError("")

      try {
        const { orders: fetchedOrders, pagination: pageMeta } = await getOrdersAPI({
          page,
          limit: 6,
          status: statusFilter === "all" ? undefined : statusFilter
        })

        setOrders(fetchedOrders)
        setPagination(pageMeta || null)
      } catch (err) {
        console.error(err)
        const message = err?.response?.data?.message || "Failed to load your orders."
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [page, statusFilter])

  const handleFilterChange = (nextStatus) => {
    setStatusFilter(nextStatus)
    setPage(1)
  }

  const handleCancel = async (id) => {
    setCancelingId(id)
    setError("")

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
      const message = err?.response?.data?.message || "Failed to cancel this order."
      setError(message)
    } finally {
      setCancelingId("")
    }
  }

  if (loading) return <div className="p-12">Loading your orders...</div>

  if (orders.length === 0)
    return (
      <div className="p-12 text-center space-y-3">
        <FiPackage size={40} className="mx-auto mb-4 text-gray-400" />
        <p>No orders found{statusFilter !== "all" ? ` for status "${statusFilter}"` : ""}.</p>
        {statusFilter !== "all" && (
          <button
            type="button"
            onClick={() => handleFilterChange("all")}
            className="text-sm text-[#E9723D] underline"
          >
            Clear filter
          </button>
        )}
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Your Orders</h2>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => handleFilterChange(option)}
              className={`rounded-full px-3 py-1 text-sm capitalize transition ${
                statusFilter === option
                  ? "bg-[#2E1F18] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {orders.map(order => (
        <div key={order._id} className="border border-gray-200 p-6 rounded-lg">
          <div className="flex justify-between mb-4">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>
              <p className="text-sm text-gray-500">
                {order.formattedDate}
              </p>
            </div>

            <OrderStatusBadge status={order.status} />
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

          <div className="mt-4 flex items-center gap-4">
            <Link
              to={`/orders/${order._id}`}
              className="text-sm text-[#2E1F18] underline"
            >
              View details
            </Link>

            {order.status === "pending" && (
              <button
                onClick={() => handleCancel(order._id)}
                disabled={cancelingId === order._id}
                className="text-sm text-red-600 disabled:opacity-60"
              >
                {cancelingId === order._id ? "Cancelling..." : "Cancel order"}
              </button>
            )}
          </div>
        </div>
      ))}

      {pagination && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages || 1}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrev}
              className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage(prev => prev + 1)}
              disabled={!pagination.hasNext}
              className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
