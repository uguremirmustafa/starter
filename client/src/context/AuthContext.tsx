import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  /** true while the initial /auth/me fetch is in flight */
  loading: boolean
}

interface AuthContextValue extends AuthState {
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    return { user: null, accessToken, loading: !!accessToken }
  })

  // Rehydrate user from the stored token on first mount
  useEffect(() => {
    const token = state.accessToken
    if (!token) return

    fetch('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json: { data: User }) => {
        setState((prev) => ({ ...prev, user: json.data, loading: false }))
      })
      .catch(() => {
        // Token is invalid / expired — clear storage
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        setState({ user: null, accessToken: null, loading: false })
      })
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback((accessToken: string, refreshToken: string, user: User) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    setState({ user, accessToken, loading: false })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setState({ user: null, accessToken: null, loading: false })
  }, [])

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, isAuthenticated: !!state.accessToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
