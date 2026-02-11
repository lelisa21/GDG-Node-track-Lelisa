import { useEffect, useState } from "react"
import { getOrderStatsAPI } from "../services/orderService"

const AdminOrderStats = () => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getOrderStatsAPI()
      setStats(data)
    }

    fetchStats()
  }, [])

  if (!stats) return <div className="p-12">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-xl font-semibold mb-8">Order Statistics</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="border p-6 rounded">
          <p>Total Orders</p>
          <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
        </div>

        <div className="border p-6 rounded">
          <p>Total Revenue</p>
          <h3 className="text-2xl font-bold">${stats.totalRevenue}</h3>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderStats
