import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState.jsx";
import api from "../services/api.js";

const orderStatuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
const paymentStatuses = ["Pending", "Paid", "Failed"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const { data } = await api.get("/orders/admin/all");
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrder = async (id, patch) => {
    await api.put(`/orders/${id}`, patch);
    await loadOrders();
  };

  if (loading) {
    return <LoadingState label="Loading orders" />;
  }

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin order operations</p>
          <h1>Orders</h1>
        </div>
        <button className="secondary-button" onClick={loadOrders}>
          <RefreshCw size={18} /> Refresh
        </button>
      </div>
      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Order Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-6).toUpperCase()}</td>
                <td>{order.user?.name || "Customer"}</td>
                <td>Rs. {order.total.toLocaleString("en-IN")}</td>
                <td>
                  <select value={order.status} onChange={(event) => updateOrder(order._id, { status: event.target.value })}>
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={order.payment.status}
                    onChange={(event) => updateOrder(order._id, { paymentStatus: event.target.value })}
                  >
                    {paymentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminOrders;

