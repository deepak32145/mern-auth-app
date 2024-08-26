import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,
  isCheckingAuth: true,
  message: null,
  signUp: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({ user: response.data.user, isAuthenticated: true, loading: false });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Signing up",
        loading: false,
      });
    }
  },
  verifyEmail: async (code) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({ user: response.data.user, isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        loading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: error, isCheckingAuth: false, isAuthenticated: false });
    }
  },
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error logging in",
        loading: false,
      });
      throw error;
    }
  },
}));
