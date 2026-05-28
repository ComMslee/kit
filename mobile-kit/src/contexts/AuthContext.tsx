import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AUTH_KEY = '@kit_user'

export interface AuthUser {
  id: string
  name: string
  email: string
  provider: 'kakao' | 'naver' | 'google'
  avatar?: string
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (user: AuthUser) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 앱 시작 시 저장된 유저 불러오기
  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY)
      .then((json) => {
        if (json) setUser(JSON.parse(json))
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (userData: AuthUser) => {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
