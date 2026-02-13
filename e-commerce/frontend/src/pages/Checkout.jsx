import { useEffect, useState } from "react"
import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"
import CheckoutForm from "../components/CheckoutForm"
import OrderSummary from "../components/OrderSummary"
import { createOrderAPI } from "../services/orderService"
import { syncCartToBackendAPI } from "../services/cartService"

const Checkout = () => {
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    if (cart.length === 0) navigate("/cart")
  }, [cart.length, navigate])

  if (cart.length === 0) return null

  const handlePlaceOrder = async (customerData) => {
    setSubmitError("")

    try {
      await syncCartToBackendAPI(cart)

      await createOrderAPI({
        customer: {
          name: customerData.fullName,
          email: customerData.email,
          phone: customerData.phone || "",
          address: {
            country: "Ethiopia",
            city: customerData.city
          }
        }
      })

      clearCart()
      navigate("/orders")
    } catch (error) {
      console.error(error)
      const message = error?.response?.data?.message || "Order failed. Try again."
      setSubmitError(message)
    }
  }

  return (
    <div className="mx-auto max-w-6xl rounded-3xl border border-[#E5DED6] bg-[#F7F2EB] px-6 py-12 md:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-[#5C4A42]">Final Step</p>
        <h1 className="mt-2 font-serif text-4xl text-[#2E1F18]">Checkout</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <CheckoutForm onSubmit={handlePlaceOrder} submitError={submitError} />
        <OrderSummary subtotal={total} />
      </div>
    </div>
  )
}

export default Checkout
