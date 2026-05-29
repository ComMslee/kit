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

// ── 결제 ─────────────────────────────────────────────────────
export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED'

export interface Order {
  id: string
  userId: string
  amount: number
  currency: string
  status: OrderStatus
  provider: string
  providerTxId: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

// ── 디바이스 ──────────────────────────────────────────────────
export type Platform = 'IOS' | 'ANDROID' | 'WEB'

export interface Device {
  id: string
  userId: string
  token: string
  platform: Platform
  name: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

// ── 클라이언트 로그 ───────────────────────────────────────────
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

export interface ClientLogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  platform?: string
  appVersion?: string
  userId?: string
}

// ── 검색 ─────────────────────────────────────────────────────
export interface SearchResult {
  type: string
  id: string
  label: string
  sub: string
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
