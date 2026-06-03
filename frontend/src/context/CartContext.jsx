import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import api from "../services/api.js";

const emptyCart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  shippingFee: 0,
  total: 0
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!token) {
      setCart(emptyCart);
      return;
    }

    setCartLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?.id, token]);

  const addItem = async (productId, quantity = 1) => {
    const { data } = await api.post("/cart", { productId, quantity });
    setCart(data);
  };

  const updateItem = async (productId, quantity) => {
    const { data } = await api.put(`/cart/${productId}`, { quantity });
    setCart(data);
  };

  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data);
  };

  const clearCart = async () => {
    const { data } = await api.delete("/cart");
    setCart(data);
  };

  const value = useMemo(
    () => ({
      cart,
      cartLoading,
      fetchCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      resetCart: () => setCart(emptyCart)
    }),
    [cart, cartLoading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

