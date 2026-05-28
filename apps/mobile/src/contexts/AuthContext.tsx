import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AUTH_KEY  = '@kit_user'
const GUEST_KEY = '@kit_guest'

export interface AuthUser {
  id: string
  name: string
  email: string
  provider: 'kakao' | 'naver' | 'google'
  avatar?: string
}

interface AuthContextValue {
  user: AuthUser | null
  isGuest: boolean
  isLoading: boolean
  login: (user: AuthUser) => Promise<void>
  logout: () => Promise<void>
  enterGuestMode: () => Promise<void>
  exitGuestMode: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 앱 시작 시 저장된 상태 복원
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(AUTH_KEY),
      AsyncStorage.getItem(GUEST_KEY),
    ])
      .then(([userJson, guestJson]) => {
        if (userJson) setUser(JSON.parse(userJson))
        if (guestJson === '1') setIsGuest(true)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (userData: AuthUser) => {
    await AsyncStorage.multiSet([[AUTH_KEY, JSON.stringify(userData)]])
    await AsyncStorage.removeItem(GUEST_KEY)
    setIsGuest(false)
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([AUTH_KEY, GUEST_KEY])
    setUser(null)
    setIsGuest(false)
  }, [])

  const enterGuestMode = useCallback(async () => {
    await AsyncStorage.setItem(GUEST_KEY, '1')
    setIsGuest(true)
  }, [])

  const exitGuestMode = useCallback(async () => {
    await AsyncStorage.removeItem(GUEST_KEY)
    setIsGuest(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isGuest, isLoading, login, logout, enterGuestMode, exitGuestMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
