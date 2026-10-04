import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginStudent,
  loginAdmin,
} from "../services/auth.api";

const AuthContext = createContext(null);

const clearSession = () => {
  localStorage.removeItem("iem_token");
  localStorage.removeItem("iem_role");
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password, role) => {
    const response =
      role === "ADMIN"
        ? await loginAdmin({ email, password })
        : await loginStudent({ email, password });

    const { token, user } = response.data;

    // Never persist a session whose role doesn't match the portal being used
    // (e.g. an ADMIN account signing in through the student login form).
    if (user.role !== role) {
      throw new Error(
        role === "ADMIN" ? "Admin access required" : "Student access required"
      );
    }

    localStorage.setItem("iem_token", token);
    localStorage.setItem("iem_role", user.role);

    setUser(user);

    return user;
  };

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("iem_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Token rejected by the API at any point -> drop the session.
  useEffect(() => {
    window.addEventListener("iem:unauthorized", logout);
    return () => window.removeEventListener("iem:unauthorized", logout);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
