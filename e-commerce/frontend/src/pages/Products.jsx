import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import LoadingSpinner from "../components/LoadingSpinner";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { addToBackendCartAPI } from "../services/cartService";

export default function Products() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "newest",
    minPrice: 0,
    maxPrice: 100000,
  });
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  // Fetch products
  const fetchProducts = async (reset = false, targetPage = page) => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:4000/api/products", {
        params: { ...filters, page: targetPage },
      });
      const newProducts = data.data.products;
      const backendCategories =
        data?.data?.filters?.categories || data?.data?.filters?.catagories || [];
      setCategories(backendCategories);
      if (reset) setProducts(newProducts);
      else setProducts((prev) => [...prev, ...newProducts]);
      setHasMore(Boolean(data?.pagination?.hasNext));
    } catch (err) {
      console.error("Products fetch failed:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setPage(1);
    fetchProducts(true, 1);
  }, [filters]);

  useEffect(() => {
    if (page === 1) return;
    fetchProducts();
  }, [page]);

  const lastProductRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) setPage((p) => p + 1);
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );
  console.log(products);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  const handleCategoryClick = (cat) => {
    setFilters({ ...filters, category: cat });
  };

  const handleSort = (e) => {
    setFilters({ ...filters, sort: e.target.value });
  };

  const handlePriceChange = (min, max) => {
    setFilters({ ...filters, minPrice: min, maxPrice: max });
  };

  const handleAddToCart = async (product) => {
    addToCart(product, 1);

    try {
      await addToBackendCartAPI(product._id, 1);
    } catch (err) {
      console.error("Backend cart sync failed:", err);
    }
  };

  const groupByCategory = () => {
    const map = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  };

  const categoryGroups = groupByCategory();
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="bg-[#F7F2EB] min-h-screen px-4 md:px-16 py-10 flex flex-col lg:flex-row gap-8">

      <aside className="lg:w-64 shrink-0">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 sticky top-20">
          <h2 className="font-bold text-xl mb-4">Filters</h2>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                    filters.category === cat
                      ? "bg-[#E9723D] text-white shadow"
                      : "bg-gray-200 hover:bg-[#E9723D]/20"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
              <button
                onClick={() => handleCategoryClick("")}
                className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 hover:bg-gray-300"
              >
                All
              </button>
            </div>
          </div>

 
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Price (ETB)</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) =>
                  handlePriceChange(Number(e.target.value), filters.maxPrice)
                }
                className="w-1/2 px-2 py-1 rounded border border-gray-300 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) =>
                  handlePriceChange(filters.minPrice, Number(e.target.value))
                }
                className="w-1/2 px-2 py-1 rounded border border-gray-300 focus:outline-none"
              />
            </div>
          </div>

 
          <div>
            <h3 className="font-semibold mb-2">Sort By</h3>
            <select
              value={filters.sort}
              onChange={handleSort}
              className="w-full px-2 py-1 rounded border border-gray-300 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="priceLow">Price: Low → High</option>
              <option value="priceHigh">Price: High → Low</option>
              <option value="topRated">Top Rated</option>
            </select>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col gap-12">
    
        <div className="text-center mb-10 lg:hidden">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
            Explore Premium Products For Free
          </h1>
          <p className="text-[#5C4A42] text-lg md:text-xl mb-6">
            Curated Ethiopian marketplace products just for you
          </p>
          <form
            onSubmit={handleSearch}
            className="flex justify-center max-w-md mx-auto"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E9723D]"
            />
            <button
              type="submit"
              className="bg-[#E9723D] text-white px-4 py-2 rounded-r-lg font-semibold hover:bg-[#d15c1f] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {products.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Trending</h2>
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {products.slice(0, 5).map((product, idx) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="shrink-0 w-64 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 relative"
                  ref={idx === products.length - 1 ? lastProductRef : null}
                >
                  <LazyLoadImage
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-2xl"
                    effect="blur"
                  />
                  <div className="absolute top-3 left-3 bg-white/80 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow">
                    <AiFillStar className="text-yellow-400" />
                    {product.rating || 0}
                  </div>
                  {product.stock <= 5 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow">
                      Only {product.stock} left
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-[#5C4A42] text-sm line-clamp-2 mt-1">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[#E9723D] font-bold">
                        {product.price} ETB
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="bg-[#E9723D] text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-[#d15c1f] transition-colors"
                      >
                        + Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Sections */}
        {Object.keys(categoryGroups).map((cat) => (
          <div key={cat}>
            <h2 className="text-3xl font-bold mb-6 capitalize">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {categoryGroups[cat].map((product, idx) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  ref={
                    idx === categoryGroups[cat].length - 1
                      ? lastProductRef
                      : null
                  }
                >
                  <div className="relative">
                    <LazyLoadImage
                      src={product.imageUrl || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      effect="blur"
                    />
                    <div className="absolute top-3 left-3 bg-white/80 text-xs px-2 py-1 rounded-full shadow flex items-center gap-1">
                      <AiFillStar className="text-yellow-400" />
                      {product.rating || 0}
                    </div>
                    {product.stock <= 5 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow">
                        Only {product.stock} left!
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-[#5C4A42] text-sm line-clamp-2 mt-1">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[#E9723D] font-bold">
                        {product.price} ETB
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="bg-[#E9723D] text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-[#d15c1f] transition-colors"
                      >
                        + Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-center py-10">Loading more products...</div>
        )}
        {!hasMore && (
          <div className="text-center py-10 text-gray-500">
            No more products.
          </div>
        )}
      </main>
    </div>
  );
}
