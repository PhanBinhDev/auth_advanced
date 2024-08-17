import { create } from 'zustand'
import axios from 'axios'
const API_URL =
  import.meta.env.NODE === 'development'
    ? 'http://localhost:5000/api/v1/auth'
    : '/api/v1/auth'
axios.defaults.withCredentials = true
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  signup: async ({ name, email, password }) => {
    set({ isLoading: true, error: null })

    try {
      const res = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name
      })

      set({ user: res.data.user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({
        error: error.response.data.message || 'Error signing up',
        isLoading: false
      })
      throw error
    }
  },
  verifyEmail: async (token) => {
    set({ isLoading: true, error: null })
    try {
      const res = await axios.put(`${API_URL}/verify-email`, {
        token
      })
      set({ user: res.data.user, isAuthenticated: true, isLoading: false })
      return res.data
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Error verifying email',
        isLoading: false
      })
      throw error
    }
  },
  checkAuth: async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    set({ isCheckingAuth: true, error: null })

    try {
      const res = await axios.get(`${API_URL}/check-auth`)
      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingAuth: false
      })
    } catch (error) {
      set({
        error: null,
        isLoading: false,
        isCheckingAuth: false
      })
      throw error
    }
  },
  login: async ({ email, password }) => {
    set({ isLoading: true, error: null })

    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password
      })
      set({ user: res.data.user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({
        error: error.response.data.message || 'Error logging in',
        isLoading: false
      })
      throw error
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null })

    try {
      await axios.delete(`${API_URL}/logout`)
      set({ user: null, isAuthenticated: false, isLoading: false, error: null })
    } catch (error) {
      set({
        error: 'Error logging out',
        isLoading: false
      })
      throw error
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null })

    try {
      const response = await axios.put(`${API_URL}/forgot-password`, {
        email
      })
      set({ messages: response.data.message, isLoading: false, error: null })
    } catch (error) {
      set({
        error:
          error.response.data.message || 'Error sending password reset email',
        isLoading: false
      })
      throw error
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null })

    try {
      const response = await axios.put(`${API_URL}/reset-password/${token}`, {
        newPassword: password
      })
      set({ message: response.data.message, isLoading: false })
    } catch (error) {
      set({
        error: error.response.data.message || 'Error resetting password',
        isLoading: false
      })
      throw error
    }
  }
}))
