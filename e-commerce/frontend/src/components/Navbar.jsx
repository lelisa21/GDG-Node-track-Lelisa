import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState , useEffect} from 'react'
export default function Navbar() {
  const { itemCount } = useCart()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          E-Shop
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <Link to="/cart" className="hover:text-blue-600 relative">
            Cart {itemCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{itemCount}</span>}
          </Link>
          <Link to="/orders" className="hover:text-blue-600">Orders</Link>
          
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2">
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}
