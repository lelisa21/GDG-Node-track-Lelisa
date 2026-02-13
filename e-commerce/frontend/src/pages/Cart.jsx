import { useCart } from "../context/CartContext"
import CartItem from "../components/CartItem"
import { Link } from "react-router-dom"
import { FiShoppingBag } from "react-icons/fi"

const Cart = () => {
  const { cart, total, itemCount, clearCart } = useCart()

  const taxRate = 0.08
  const tax = total * taxRate
  const shipping = total > 100 ? 0 : 10
  const grandTotal = total + tax + shipping

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <FiShoppingBag size={48} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mt-2">
          Looks like you haven’t added anything yet.
        </p>
        <Link
          to="/products"
          className="mt-6 px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Shopping Cart ({itemCount})
          </h2>

          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear Cart
          </button>
        </div>

        {cart.map(item => (
          <CartItem key={item.product._id} item={item} />
        ))}
      </div>

      {/* Summary Panel */}
      <div className="border border-gray-200 rounded-xl p-6 h-fit shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Order Summary
        </h3>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          <div className="border-t pt-4 flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <Link
          to="/checkout"
          className="block mt-8 w-full text-center bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Proceed to Checkout
        </Link>

        <Link
          to="/products"
          className="block mt-4 text-center text-sm text-gray-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default Cart
