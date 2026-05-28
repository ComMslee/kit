// ── 인증 타입 ─────────────────────────────────────────────────
export type Provider = 'kakao' | 'naver' | 'google'

export interface AuthUser {
  id: string
  name: string
  email: string
  provider: Provider
  avatar?: string
}

// ── API 응답 공통 래퍼 ─────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ── 인증 토큰 ─────────────────────────────────────────────────
export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number  // seconds
}

export interface TokenPayload {
  sub: string        // user id
  email: string
  name: string
  provider: Provider
  iat?: number
  exp?: number
}

// ── 도메인 타입 ───────────────────────────────────────────────
export interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  provider?: Provider
  role: 'ADMIN' | 'USER'
  createdAt: string
}

export interface DashboardStats {
  totalUsers: number
  todayVisitors: number
  monthlyRevenue: number
  pendingItems: number
}
