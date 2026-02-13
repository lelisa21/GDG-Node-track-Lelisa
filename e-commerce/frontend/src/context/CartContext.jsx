/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CartContext = createContext();

const initialState = {
  cart: [],
  itemsMap: {},
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return action.payload;

    case "ADD": {
      const { product, quantity } = action.payload;
      const { cart, itemsMap } = state;

      const existing = cart.find((i) => i.product._id === product._id);

      if (existing) {
        const updated = cart.map((item) =>
          item.product._id === product._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item,
        );

        return { cart: updated, itemsMap };
      }

      return {
        cart: [
          ...cart,
          { product, quantity: Math.min(quantity, product.stock) },
        ],
        itemsMap: { ...itemsMap, [product._id]: true },
      };
    }

    case "REMOVE": {
      const { productId } = action.payload;
      const updated = state.cart.filter((i) => i.product._id !== productId);

      const map = { ...state.itemsMap };
      delete map[productId];

      return { cart: updated, itemsMap: map };
    }

    case "UPDATE": {
      const { productId, quantity } = action.payload;

      const updated = state.cart.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      );

      return { ...state, cart: updated };
    }

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
};

export const CartContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) dispatch({ type: "INIT", payload: JSON.parse(stored) });
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({ type: "ADD", payload: { product, quantity } });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: "REMOVE", payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({ type: "UPDATE", payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const total = state.cart.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  const itemCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        subtotal: total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be inside CartContextProvider");
  return context;
};
