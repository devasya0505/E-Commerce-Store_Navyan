import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import LoadingState from "../components/LoadingState.jsx";
import ProductCard from "../components/ProductCard.jsx";
import api from "../services/api.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category))],
    [products]
  );

  const visibleProducts = products.filter((product) => {
    const query = search.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <LoadingState label="Loading products" />;
  }

  return (
    <section className="stack">
      <div className="store-hero">
        <div>
          {/* <p className="eyebrow">Full stack MERN shopping platform</p> */}
          <h1>DevMart</h1>
          <p>
            Browse curated electronics, add products to your cart, and place a
            simulated order with a real checkout flow.
          </p>
        </div>
        <div className="hero-stats">
          <span>{products.length}</span>
          <small>Products live</small>
        </div>
      </div>

      <div className="toolbar">
        <label className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, brands, categories"
          />
        </label>
        <label className="select-box">
          <SlidersHorizontal size={18} />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="alert">{error}</p>}

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {visibleProducts.length === 0 && <p className="empty-state">No products match your filters.</p>}
    </section>
  );
};

export default Home;

