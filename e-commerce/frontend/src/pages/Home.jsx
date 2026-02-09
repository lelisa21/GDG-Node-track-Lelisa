import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'

export default function Home() {
  const { data: products } = useProducts({ limit: 4 })
  
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl mb-8">
        <h1 className="text-3xl font-bold mb-3">Welcome to E-Shop</h1>
        <p className="mb-6">Best products at best prices</p>
        <Link to="/products" className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
          Shop Now
        </Link>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map(product => (
            <div key={product._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
              <h3 className="font-semibold truncate">{product.name}</h3>
              <p className="text-blue-600 font-bold">{product.price} ETB</p>
              <Link to="/products" className="text-sm text-gray-600 hover:text-blue-600">View All →</Link>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded">
          <h3 className="font-bold mb-1"> Free Shipping</h3>
          <p className="text-sm">On orders over 50,000 ETB</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded">
          <h3 className="font-bold mb-1"> Secure Payment</h3>
          <p className="text-sm">100% secure transactions</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded">
          <h3 className="font-bold mb-1"> Easy Returns</h3>
          <p className="text-sm">30-day return policy</p>
        </div>
      </div>
    </div>
  )
}
