import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUser, saveSession, clearSession } from "../utils/auth";
import authApi from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getToken();
      if (savedToken) {
        try {
          const res = await authApi.getMe();
          if (res.user) {
            setUser(res.user);
            saveSession(savedToken, res.user);
          }
        } catch (err) {
          console.error("Auth verification failed:", err);
          clearSession();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const getDashboardPath = (role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      case "student":
      default:
        return "/student/dashboard";
    }
  };

  const loginUser = async (credentials) => {
    const data = await authApi.login(credentials);
    setToken(data.token);
    setUser(data.user);
    saveSession(data.token, data.user);
    const redirectPath = getDashboardPath(data.user.role);
    navigate(redirectPath);
    return data;
  };

  const signupUser = async (formData) => {
    const data = await authApi.signup(formData);
    setToken(data.token);
    setUser(data.user);
    saveSession(data.token, data.user);
    const redirectPath = getDashboardPath(data.user.role);
    navigate(redirectPath);
    return data;
  };

  const logoutUser = () => {
    clearSession();
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  const updateProfile = async (updatedData) => {
    const res = await authApi.updateProfile(updatedData);
    if (res.user) {
      setUser(res.user);
      saveSession(token, res.user);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: Boolean(token && user),
        loading,
        loginUser,
        signupUser,
        logoutUser,
        updateProfile,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
