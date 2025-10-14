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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true)
    } else {
      clearAuthToken()
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [])

  const login = (token) => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    clearAuthToken()
    setIsAuthenticated(false)
  }

  const value = {
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
