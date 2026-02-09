import { useState, useEffect } from 'react'

export default function Orders() {
  const [orders, setOrders] = useState([])
  
  useEffect(() => {
    // Mock orders
    setOrders([
      { id: 1, date: '2024-01-15', total: 54000, status: 'Delivered' },
      { id: 2, date: '2024-01-10', total: 32000, status: 'Processing' }
    ])
  }, [])
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <div className="flex justify-between">
                <span>Order #{order.id}</span>
                <span className="font-bold">{order.total} ETB</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>{order.date}</span>
                <span className={order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
