import axios from "axios";

const getPayload = (response) => response?.data?.data;

export const createOrderAPI = async (data) => {
  const res = await axios.post("/orders", data);
  return getPayload(res);
};

export const getOrdersAPI = async ({ page = 1, limit = 5, status } = {}) => {
  const res = await axios.get("/orders", {
    params: { page, limit, status },
  });

  return {
    orders: getPayload(res) || [],
    pagination: res?.data?.pagination,
  };
};

export const getOrderByIdAPI = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return getPayload(res);
};

export const cancelOrderAPI = async (id) => {
  const res = await api.delete(`/orders/${id}`);
  return getPayload(res);
};

export const getOrderStatsAPI = async () => {
  const res = await api.get("/orders/stats");
  return getPayload(res);
};
