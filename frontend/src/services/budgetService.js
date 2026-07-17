import api from './api'

export const budgetService = {
  get: (month, year) => api.get('/budget', { params: { month, year } }).then((res) => res.data),
  create: (data) => api.post('/budget', data).then((res) => res.data),
  update: (data) => api.put('/budget', data).then((res) => res.data),
}
