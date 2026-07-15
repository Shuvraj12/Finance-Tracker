import axios from 'axios'

// Central Axios instance. The JWT request interceptor (attaches the auth
// token to every call) gets added here in Phase 2 once login exists.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
