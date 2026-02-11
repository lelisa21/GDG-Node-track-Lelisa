import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"
import CheckoutForm from "../components/CheckoutForm"
import OrderSummary from "../components/OrderSummary"
import { createOrderAPI } from "../services/orderService"
import { getSessionId } from "../utils/session"

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    navigate("/cart")
    return null
  }

  const handlePlaceOrder = async (customerData) => {
    try {
      const sessionId = getSessionId()

      const items = cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        priceAtPurchase: item.product.price
      }))

      const orderPayload = {
        sessionId,
        customer: {
          name: customerData.fullName,
          email: customerData.email,
          phone: customerData.phone || "",
          address: {
            country: "Ethiopia",
            city: customerData.city
          }
        },
        items,
        tax: subtotal * 0.1,
        shipping: subtotal > 100 ? 0 : 10
      }

      await createOrderAPI(orderPayload)

      clearCart()
      navigate("/orders")

    } catch (error) {
      console.error(error)
      alert("Order failed. Try again.")
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12">
      <CheckoutForm onSubmit={handlePlaceOrder} />
      <OrderSummary cart={cart} subtotal={subtotal} />
    </div>
  )
}

export default Checkout
