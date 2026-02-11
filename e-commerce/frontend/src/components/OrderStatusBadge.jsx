const statusStyles = {
  pending: "bg-gray-200 text-gray-800",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-green-100 text-green-700",
  delivered: "bg-black text-white",
  cancelled: "bg-red-100 text-red-600"
}

const OrderStatusBadge = ({ status }) => {
  return (
    <span className={`px-3 py-1 rounded text-sm capitalize ${statusStyles[status]}`}>
      {status}
    </span>
  )
}

export default OrderStatusBadge
