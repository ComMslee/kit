// =============================================
// 공통 타입 정의
// 외주 프로젝트마다 여기에 도메인 타입 추가
// =============================================

export type UserRole = 'ADMIN' | 'USER'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
