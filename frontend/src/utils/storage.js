const TOKEN_KEY = 'finance_tracker_token'
const USER_KEY = 'finance_tracker_user'

// Centralizes localStorage access for the auth session so api.js (reads the
// token) and AuthContext (writes it) never risk drifting on the key names.
export const tokenStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: () => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
}
