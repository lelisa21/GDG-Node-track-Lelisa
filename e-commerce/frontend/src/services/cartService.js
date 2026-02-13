import api from "./api";

export const addToBackendCartAPI = async (productId, quantity = 1) => {
  const res = await api.post("/cart", { productId, quantity });
  return res?.data?.data;
};

export const clearBackendCartAPI = async () => {
  const res = await api.delete("/cart");
  return res?.data?.data;
};

export const syncCartToBackendAPI = async (cartItems) => {
  if (!Array.isArray(cartItems)) return;

  await clearBackendCartAPI();

  for (const item of cartItems) {
    await addToBackendCartAPI(item.product._id, item.quantity);
  }
};
