import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, total, clearCart } = useCart()
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Simulate order creation
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Order placed successfully!')
    clearCart()
    navigate('/orders')
  }
  
  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="text-blue-600">Shop Now</button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full p-3 border rounded" />
        <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full p-3 border rounded" />
        <textarea placeholder="Shipping Address" required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full p-3 border rounded" rows="3" />
        <div className="text-center text-xl font-bold mb-4">Total: {total + (total > 50000 ? 0 : 2000)} ETB</div>
        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700">Place Order</button>
      </form>
    </div>
  )
}
