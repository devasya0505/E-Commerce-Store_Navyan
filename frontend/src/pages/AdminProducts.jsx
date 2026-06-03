import { Pencil, PlusCircle, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState.jsx";
import api from "../services/api.js";

const initialProduct = {
  name: "",
  brand: "",
  category: "",
  description: "",
  price: "",
  stock: "",
  image: "",
  rating: 4,
  numReviews: 0,
  isFeatured: false
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const resetForm = () => {
    setForm(initialProduct);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      rating: Number(form.rating),
      numReviews: Number(form.numReviews)
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Product save failed");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
      rating: product.rating,
      numReviews: product.numReviews,
      isFeatured: product.isFeatured
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    await loadProducts();
  };

  if (loading) {
    return <LoadingState label="Loading products" />;
  }

  return (
    <section className="admin-layout">
      <form className="form-panel" onSubmit={handleSubmit}>
        <p className="eyebrow">{editingId ? "Update inventory" : "Create product"}</p>
        <h1>{editingId ? "Edit Product" : "Add Product"}</h1>
        {error && <p className="alert">{error}</p>}
        <div className="form-grid">
          <label>
            Name
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
          </label>
          <label>
            Brand
            <input value={form.brand} onChange={(event) => updateField("brand", event.target.value)} required />
          </label>
          <label>
            Category
            <input value={form.category} onChange={(event) => updateField("category", event.target.value)} required />
          </label>
          <label>
            Price
            <input type="number" value={form.price} onChange={(event) => updateField("price", event.target.value)} required />
          </label>
          <label>
            Stock
            <input type="number" value={form.stock} onChange={(event) => updateField("stock", event.target.value)} required />
          </label>
          <label>
            Image URL
            <input value={form.image} onChange={(event) => updateField("image", event.target.value)} required />
          </label>
        </div>
        <label>
          Description
          <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} required />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) => updateField("isFeatured", event.target.checked)}
          />
          Featured product
        </label>
        <div className="button-row">
          <button className="primary-button" type="submit">
            {editingId ? <Save size={18} /> : <PlusCircle size={18} />} {editingId ? "Save changes" : "Add product"}
          </button>
          {editingId && (
            <button className="secondary-button" type="button" onClick={resetForm}>
              <X size={18} /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="table-panel">
        <div className="section-heading">
          <h1>Products</h1>
        </div>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>Rs. {product.price.toLocaleString("en-IN")}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-button" onClick={() => handleEdit(product)} title="Edit product">
                        <Pencil size={16} />
                      </button>
                      <button className="icon-button danger" onClick={() => handleDelete(product._id)} title="Delete product">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminProducts;

