import api from './api'

export const reportService = {
  get: (period) => api.get('/reports', { params: { period } }).then((res) => res.data),
}
