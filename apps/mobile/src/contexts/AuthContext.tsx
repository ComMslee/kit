import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiClient } from '../lib/apiClient'

const AUTH_KEY  = '@kit_user'
const GUEST_KEY = '@kit_guest'
const TOKEN_KEY = '@kit_token'

export interface AuthUser {
  id: string
  name: string
  email: string
  provider: 'kakao' | 'naver' | 'google'
  avatar?: string
}

interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface AuthContextValue {
  user: AuthUser | null
  isGuest: boolean
  isLoading: boolean
  accessToken: string | null
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
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // 앱 시작 시 저장된 상태 복원
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(AUTH_KEY),
      AsyncStorage.getItem(GUEST_KEY),
      AsyncStorage.getItem(TOKEN_KEY),
    ])
      .then(([userJson, guestJson, token]) => {
        if (userJson) setUser(JSON.parse(userJson))
        if (guestJson === '1') setIsGuest(true)
        if (token) setAccessToken(token)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (userData: AuthUser) => {
    // API 서버에서 JWT 발급 (실패해도 로컬 로그인은 유지)
    const res = await apiClient.post<TokenPair>('/auth/token', {
      provider: userData.provider,
      email: userData.email,
      name: userData.name,
      image: userData.avatar,
    })

    const token = res.success && res.data ? res.data.accessToken : null

    const entries: [string, string][] = [[AUTH_KEY, JSON.stringify(userData)]]
    if (token) entries.push([TOKEN_KEY, token])

    await AsyncStorage.multiSet(entries)
    await AsyncStorage.removeItem(GUEST_KEY)

    setIsGuest(false)
    setUser(userData)
    setAccessToken(token)
  }, [])

  const logout = useCallback(async () => {
    if (accessToken) {
      await apiClient.delete('/auth/logout', accessToken).catch(() => {})
    }
    await AsyncStorage.multiRemove([AUTH_KEY, GUEST_KEY, TOKEN_KEY])
    setUser(null)
    setIsGuest(false)
    setAccessToken(null)
  }, [accessToken])

  const enterGuestMode = useCallback(async () => {
    await AsyncStorage.setItem(GUEST_KEY, '1')
    setIsGuest(true)
  }, [])

  const exitGuestMode = useCallback(async () => {
    await AsyncStorage.removeItem(GUEST_KEY)
    setIsGuest(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isGuest, isLoading, accessToken, login, logout, enterGuestMode, exitGuestMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
