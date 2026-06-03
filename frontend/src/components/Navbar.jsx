import { LayoutDashboard, LogOut, Moon, Package, ShoppingBag, ShoppingCart, Sun, UserCircle } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cart, resetCart } = useCart();
  const { showNotification } = useNotification();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    resetCart();
    showNotification("Logged out successfully. Have a nice day!", "success");
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
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
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

