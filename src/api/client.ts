import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'

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

    // Never intercept auth endpoints — 401 there means wrong credentials, not expired session
    const isAuthEndpoint = originalRequest?.url?.startsWith('/auth/')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
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

    // Show toast for non-401 errors (401 retry path handled above)
    const status = error.response?.status
    const isAuthEndpointError = originalRequest?.url?.startsWith('/auth/')

    if (!isAuthEndpointError && status) {
      const show = useToastStore.getState().show
      if (status === 400 || status === 409) {
        const msg = error.response?.data?.message ?? 'Request failed'
        show('error', 'Error', msg)
      } else if (status === 401) {
        show('error', 'Session expired', 'Please login again')
      } else if (status === 403) {
        show('error', 'Access denied', 'You do not have permission to perform this action')
      } else if (status >= 500) {
        show('error', 'Server error', 'Something went wrong on our end. Please try again.')
      }
    }

    return Promise.reject(error)
  }
)
