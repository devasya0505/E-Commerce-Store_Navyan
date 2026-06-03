import { ShoppingCart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    await addItem(product._id, 1);
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="product-card-body">
        <p className="eyebrow">{product.category}</p>
        <Link to={`/products/${product._id}`} className="product-title">
          {product.name}
        </Link>
        <p className="muted">{product.brand}</p>
        <div className="product-meta">
          <span className="rating">
            <Star size={16} fill="currentColor" /> {product.rating}
          </span>
          <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
        </div>
        <div className="product-card-footer">
          <strong>Rs. {product.price.toLocaleString("en-IN")}</strong>
          <button className="icon-button" onClick={handleAdd} disabled={product.stock === 0} title="Add to cart">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

