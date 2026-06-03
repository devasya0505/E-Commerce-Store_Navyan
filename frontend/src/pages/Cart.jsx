import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingState from "../components/LoadingState.jsx";
import { useCart } from "../context/CartContext.jsx";

const Cart = () => {
  const { cart, cartLoading, updateItem, removeItem } = useCart();

  if (cartLoading) {
    return <LoadingState label="Loading cart" />;
  }

  if (!cart.items.length) {
    return (
      <section className="empty-state">
        <h1>Your cart is empty</h1>
        <Link className="primary-button" to="/">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="split-layout">
      <div className="stack">
        <h1>Shopping Cart</h1>
        {cart.items.map((item) => (
          <article className="cart-row" key={item.product._id}>
            <img src={item.product.image} alt={item.product.name} />
            <div>
              <h3>{item.product.name}</h3>
              <p className="muted">Rs. {item.product.price.toLocaleString("en-IN")}</p>
            </div>
            <div className="quantity-control">
              <button
                className="icon-button"
                onClick={() => updateItem(item.product._id, Math.max(1, item.quantity - 1))}
                title="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span>{item.quantity}</span>
              <button
                className="icon-button"
                onClick={() => updateItem(item.product._id, item.quantity + 1)}
                title="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            <button className="icon-button danger" onClick={() => removeItem(item.product._id)} title="Remove item">
              <Trash2 size={18} />
            </button>
          </article>
        ))}
      </div>

      <aside className="summary-panel">
        <h2>Order Summary</h2>
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>Rs. {cart.subtotal.toLocaleString("en-IN")}</dd>
          </div>
          <div>
            <dt>Tax</dt>
            <dd>Rs. {cart.tax.toLocaleString("en-IN")}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>Rs. {cart.shippingFee.toLocaleString("en-IN")}</dd>
          </div>
          <div className="total-line">
            <dt>Total</dt>
            <dd>Rs. {cart.total.toLocaleString("en-IN")}</dd>
          </div>
        </dl>
        <Link className="primary-button full-width" to="/checkout">
          Checkout
        </Link>
      </aside>
    </section>
  );
};

export default Cart;

