import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
      <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} className="w-full h-40 object-cover rounded mb-3" loading="lazy" />
      <h3 className="font-semibold truncate">{product.name}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm truncate mb-2">{product.description}</p>
      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-bold">{product.price} ETB</span>
        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{product.category}</span>
      </div>
      <button onClick={() => addToCart(product)} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Add to Cart
      </button>
    </div>
  )
}
