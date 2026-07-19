import { createContext, useCallback, useState } from 'react'
import { authService } from '../services/authService'
import { profileService } from '../services/profileService'
import { tokenStorage } from '../utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStorage.getUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const persistSession = useCallback((response) => {
    const { token, id, name, email } = response
    tokenStorage.setToken(token)
    const nextUser = { id, name, email }
    tokenStorage.setUser(nextUser)
    setUser(nextUser)
  }, [])

  const register = useCallback(
    async (data) => {
      setLoading(true)
      setError(null)
      try {
        const response = await authService.register(data)
        persistSession(response)
        return response
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  const login = useCallback(
    async (data) => {
      setLoading(true)
      setError(null)
      try {
        const response = await authService.login(data)
        persistSession(response)
        return response
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid email or password')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    // Stateless JWT has no server-side session to invalidate, so logout is
    // purely a client-side action: drop the token and route back to /login.
    tokenStorage.clearToken()
    tokenStorage.clearUser()
    setUser(null)
  }, [])

  // Deliberately thin - no loading/error state of their own, unlike
  // login/register above. Profile.jsx manages its own submitting/error
  // state around these calls, the same way Transactions and Budget manage
  // their own state around their service calls, rather than every screen
  // sharing one global loading/error flag.
  const updateProfile = useCallback(
    async (data) => {
      const response = await profileService.update(data)
      persistSession(response)
      return response
    },
    [persistSession],
  )

  const deleteAccount = useCallback(
    async (data) => {
      await profileService.deleteAccount(data)
      logout()
    },
    [logout],
  )

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
