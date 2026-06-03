import { Boxes, ClipboardList, IndianRupee, PackagePlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../components/LoadingState.jsx";
import api from "../services/api.js";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          api.get("/products"),
          api.get("/orders/admin/all")
        ]);
        setProducts(productsResponse.data);
        setOrders(ordersResponse.data);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const revenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders]
  );

  if (loading) {
    return <LoadingState label="Loading admin dashboard" />;
  }

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin control center</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <Boxes size={24} />
          <span>{products.length}</span>
          <p>Products</p>
        </article>
        <article className="metric-card">
          <ClipboardList size={24} />
          <span>{orders.length}</span>
          <p>Orders</p>
        </article>
        <article className="metric-card">
          <IndianRupee size={24} />
          <span>Rs. {revenue.toLocaleString("en-IN")}</span>
          <p>Total sales</p>
        </article>
      </div>

      <div className="admin-actions">
        <Link className="primary-button" to="/admin/products">
          <PackagePlus size={18} /> Manage products
        </Link>
        <Link className="secondary-button" to="/admin/orders">
          <ClipboardList size={18} /> Manage orders
        </Link>
      </div>
    </section>
  );
};

export default AdminDashboard;

