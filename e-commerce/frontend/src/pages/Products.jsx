import { useState, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'

export default function Products() {
  const [filters, setFilters] = useState({ page: 1, limit: 12 })
  const { data: products, loading } = useProducts(filters)
  const [search, setSearch] = useState('')
  
  const filteredProducts = useMemo(() => {
    if (!search) return products
    const query = search.toLowerCase()
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    )
  }, [products, search])
  
  const categories = useMemo(() => 
    [...new Set(products.map(p => p.category))], [products]
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 p-2 border rounded" />
        <select onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} className="p-2 border rounded">
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      
      {loading ? <div className="text-center py-8">Loading...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
