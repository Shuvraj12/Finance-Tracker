import api from './api'

export const profileService = {
  update: (data) => api.put('/profile', data).then((res) => res.data),
  deleteAccount: (data) => api.delete('/profile', { data }).then((res) => res.data),
}
