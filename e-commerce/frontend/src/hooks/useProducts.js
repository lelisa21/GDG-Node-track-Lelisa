import { useState, useEffect, useCallback } from 'react'

const API_URL = 'http://localhost:4000/api'

export const useProducts = (filters = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters).toString()
      const response = await fetch(`${API_URL}/products?${params}`)
      const result = await response.json()
      setData(result.data?.products || result.products || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { data, loading, error, refetch: fetchProducts }
}
