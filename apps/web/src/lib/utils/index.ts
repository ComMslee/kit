import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind 클래스 병합 유틸
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 날짜 포맷 (한국 기준)
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

// 금액 포맷 (원화)
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

// API 응답 헬퍼
export function apiSuccess<T>(data: T, message?: string) {
  return { success: true, data, message }
}

export function apiError(error: string, status = 400) {
  return { success: false, error, status }
}
