import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
           'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || 
                sessionStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Server sedang memuat, coba lagi...'
    }
    return Promise.reject(error)
  }
)

export default api
