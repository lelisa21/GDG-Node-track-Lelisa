/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext } from "react";
import api from "../api/axios";

const OrderContext = createContext();

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "START":
      return { ...state, loading: true };

    case "SUCCESS":
      return { ...state, loading: false, orders: action.payload };

    case "ERROR":
      return { ...state, loading: false, error: action.payload };

    case "ADD_ORDER":
      return { ...state, orders: [action.payload, ...state.orders] };

    default:
      return state;
  }
};

export const OrderContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const placeOrder = async (cart) => {
    dispatch({ type: "START" });
    try {
      const { data } = await api.post("/orders", { items: cart });
      dispatch({ type: "ADD_ORDER", payload: data.data });
      return data.data;
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
      throw err;
    }
  };

  const fetchOrders = async () => {
    dispatch({ type: "START" });
    try {
      const { data } = await api.get("/orders");
      dispatch({ type: "SUCCESS", payload: data.data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  return (
    <OrderContext.Provider value={{ ...state, placeOrder, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context)
    throw new Error("useOrders must be inside OrderContextProvider");
  return context;
};
