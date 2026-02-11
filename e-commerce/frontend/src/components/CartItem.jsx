import { useCart } from "../context/CartContext"
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi"

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart()
  const { product, quantity } = item

  const handleIncrease = () => {
    if (quantity < product.stock) {
      updateQuantity(product._id, quantity + 1)
    }
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product._id, quantity - 1)
    }
  }

  const handleInputChange = (e) => {
    let value = Number(e.target.value)
    if (value < 1) value = 1
    if (value > product.stock) value = product.stock
    updateQuantity(product._id, value)
  }

  const subtotal = product.price * quantity

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-200 py-6">
      <div className="flex items-center gap-6 w-full md:w-auto">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-lg"
        />

        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {product.stock} in stock
          </p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrease}
          className="p-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          <FiMinus />
        </button>

        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          className="w-16 text-center border border-gray-300 rounded p-1"
        />

        <button
          onClick={handleIncrease}
          className="p-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          <FiPlus />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="font-semibold text-gray-800">
          ${subtotal.toFixed(2)}
        </p>

        <button
          onClick={() => removeFromCart(product._id)}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 mt-2"
        >
          <FiTrash2 />
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem
