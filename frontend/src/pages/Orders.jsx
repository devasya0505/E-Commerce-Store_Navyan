import { PackageCheck } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState.jsx";
import api from "../services/api.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get("/orders/mine");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <LoadingState label="Loading orders" />;
  }

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Customer account</p>
          <h1>My Orders</h1>
        </div>
      </div>
      {error && <p className="alert">{error}</p>}
      {!orders.length && <p className="empty-state">No orders placed yet.</p>}
      <div className="order-list">
        {orders.map((order) => (
          <article className="order-card" key={order._id}>
            <div className="order-card-header">
              <span>
                <PackageCheck size={18} /> Order #{order._id.slice(-6).toUpperCase()}
              </span>
              <strong>{order.status}</strong>
            </div>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.product}>
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} x Rs. {item.price.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
            <div className="order-card-footer">
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <strong>Rs. {order.total.toLocaleString("en-IN")}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Orders;

