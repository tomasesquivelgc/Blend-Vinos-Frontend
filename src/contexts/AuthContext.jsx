import { createContext, useContext, useEffect, useState } from 'react'
import { getAuthToken, isTokenExpired, clearAuthToken } from '../lib/api.js'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)          // <-- store the user info
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    const storedUser = JSON.parse(localStorage.getItem('user'))

    if (token && !isTokenExpired(token) && storedUser) {
      setUser(storedUser)
      setIsAuthenticated(true)
    } else {
      clearAuthToken()
      localStorage.removeItem('user')
      setUser(null)
      setIsAuthenticated(false)
    }

    setIsLoading(false)
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    clearAuthToken()
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,                   // <-- now available everywhere
    isAuthenticated,
    isLoading,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
