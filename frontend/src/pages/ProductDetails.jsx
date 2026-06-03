import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingState from "../components/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../services/api.js";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    await addItem(product._id, quantity);
    navigate("/cart");
  };

  if (loading) {
    return <LoadingState label="Loading product" />;
  }

  if (error) {
    return <p className="alert">{error}</p>;
  }

  return (
    <section className="details-layout">
      <div className="details-media">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="details-copy">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} /> Back to products
        </Link>
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="muted">{product.brand}</p>
        <div className="rating-row">
          <Star size={18} fill="currentColor" />
          <span>{product.rating} rating</span>
          <span>{product.numReviews} reviews</span>
        </div>
        <p>{product.description}</p>
        <strong className="price-large">Rs. {product.price.toLocaleString("en-IN")}</strong>
        <div className="purchase-row">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
          <button className="primary-button" onClick={handleAdd} disabled={product.stock === 0}>
            <ShoppingCart size={18} /> Add to cart
          </button>
        </div>
        <p className="muted">{product.stock} units available</p>
      </div>
    </section>
  );
};

export default ProductDetails;

