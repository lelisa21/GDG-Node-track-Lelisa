import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart()
  
  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl mb-4">Your cart is empty</h2>
        <Link to="/products" className="text-blue-600 hover:underline">Browse Products</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <button onClick={clearCart} className="text-red-600 hover:text-red-800">Clear All</button>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.product._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-medium">{item.product.name}</h3>
                <p>{item.product.price} ETB × {item.quantity}</p>
              </div>
              <div className="flex items-center gap-4">
                <input type="number" min="1" value={item.quantity} onChange={e => updateQuantity(item.product._id, +e.target.value)} className="w-16 p-1 border rounded" />
                <button onClick={() => removeFromCart(item.product._id)} className="text-red-500">Remove</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>{total} ETB</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{total > 50000 ? 'FREE' : '2000 ETB'}</span></div>
            <div className="flex justify-between font-bold"><span>Total</span><span>{total + (total > 50000 ? 0 : 2000)} ETB</span></div>
          </div>
          <Link to="/checkout" className="block w-full bg-green-600 text-white text-center py-3 rounded hover:bg-green-700">Checkout</Link>
        </div>
      </div>
    </div>
  )
}
