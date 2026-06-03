import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../services/api.js";

const AuthContext = createContext(null);

const loadStoredAuth = () => {
  const raw = localStorage.getItem("shop_auth");
  return raw ? JSON.parse(raw) : { user: null, token: null };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(loadStoredAuth);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    setAuthToken(auth.token);
    localStorage.setItem("shop_auth", JSON.stringify(auth));
  }, [auth]);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuth(data);
      return data.user;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (payload) => {
    setAuthLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      setAuth(data);
      return data.user;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null });
  };

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAdmin: auth.user?.role === "admin",
      authLoading,
      login,
      register,
      logout
    }),
    [auth, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

