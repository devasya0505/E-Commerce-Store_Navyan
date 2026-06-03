import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import api from "../services/api.js";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India"
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/orders", {
        shippingAddress: address,
        paymentMethod
      });
      await fetchCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <section className="split-layout">
      <form className="form-panel wide" onSubmit={handleSubmit}>
        <p className="eyebrow">Secure simulated checkout</p>
        <h1>Checkout</h1>
        {error && <p className="alert">{error}</p>}
        <div className="form-grid">
          {Object.entries(address).map(([key, value]) => (
            <label key={key}>
              {key.replace(/([A-Z])/g, " $1")}
              <input
                value={value}
                onChange={(event) => setAddress({ ...address, [key]: event.target.value })}
                required
              />
            </label>
          ))}
        </div>
        <label>
          Payment method
          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
            <option value="CARD">Card payment</option>
            <option value="UPI">UPI</option>
            <option value="WALLET">Wallet</option>
            <option value="COD">Cash on delivery</option>
          </select>
        </label>
        <button className="primary-button" type="submit" disabled={!cart.items.length}>
          <CreditCard size={18} /> Place order
        </button>
      </form>

      <aside className="summary-panel">
        <h2>Payment Summary</h2>
        <dl>
          <div>
            <dt>Items</dt>
            <dd>{cart.itemCount}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>Rs. {cart.total.toLocaleString("en-IN")}</dd>
          </div>
        </dl>
        <p className="hint">Payments are simulated for this internship project.</p>
      </aside>
    </section>
  );
};

export default Checkout;

