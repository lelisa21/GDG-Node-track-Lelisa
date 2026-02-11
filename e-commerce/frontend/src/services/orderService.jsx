import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true
})

export const createOrderAPI = async (data) => {
  const res = await API.post("/orders", data)
  return res.data
}

export const getOrdersAPI = async ({ sessionId, page = 1, limit = 5 }) => {
  const res = await API.get("/orders", {
    params: { sessionId, page, limit }
  })
  return res.data
}

export const getOrderByIdAPI = async (id) => {
  const res = await API.get(`/orders/${id}`)
  return res.data
}

export const cancelOrderAPI = async (id) => {
  const res = await API.delete(`/orders/${id}`)
  return res.data
}

export const getOrderStatsAPI = async () => {
  const res = await API.get("/orders/stats")
  return res.data
}
