import { createContext, useReducer, useContext } from "react"

export const ProductContext = createContext()

const initialState = {
  products: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    category: "",
    sort: "newest"
  }
}

const reducer = (state, action) => {
  switch (action.type) {

    case "FETCH_START":
      return { ...state, loading: true }

    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload }

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload }

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } }

    default:
      return state
  }
}

export const ProductContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ProductContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error("useProductContext must be inside ProductContextProvider")
  return context
}
