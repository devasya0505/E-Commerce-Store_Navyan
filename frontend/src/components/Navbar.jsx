import { LayoutDashboard, LogOut, Package, ShoppingBag, ShoppingCart, UserCircle } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cart, resetCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    resetCart();
    navigate("/");
  };

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <ShoppingBag size={24} />
        <span>DevMart</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Products</NavLink>
        {user && <NavLink to="/orders">My Orders</NavLink>}
        {isAdmin && (
          <>
            <NavLink to="/admin">
              <LayoutDashboard size={16} /> Admin
            </NavLink>
            <NavLink to="/admin/products">
              <Package size={16} /> Products
            </NavLink>
          </>
        )}
      </nav>

      <div className="nav-actions">
        <NavLink to="/cart" className="cart-link" title="Cart">
          <ShoppingCart size={20} />
          <span>{cart.itemCount || 0}</span>
        </NavLink>
        {user ? (
          <button className="text-button" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        ) : (
          <NavLink className="text-button" to="/login">
            <UserCircle size={18} /> Login
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;

