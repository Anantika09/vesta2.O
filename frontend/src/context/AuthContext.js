// 📁 src/context/AuthContext.js

import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Load user if token exists
  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data) setUser(data);
        })
        .catch(() => logout());
    }
  }, [token]);

  // 🔐 LOGIN
  const login = async (email, password) => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Save token
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // 📝 REGISTER
  const register = async (firstName, lastName, email, password) => {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ firstName, lastName, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
