import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hostlify-access-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    
    // If 401 and not already retrying, try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('hostlify-refresh-token')
        if (!refreshToken) throw new Error('No refresh token')
        
        const response = await axios.post(`${BASE_URL}/auth/refresh?refreshToken=${refreshToken}`)
        
        if (response.data.success) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data
          localStorage.setItem('hostlify-access-token', accessToken)
          localStorage.setItem('hostlify-refresh-token', newRefreshToken)
          
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        useAuthStore.getState().clearAuth()
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)
