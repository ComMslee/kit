import type { ApiResponse } from "@kit/types"

const API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:4000"

async function apiFetch<T>(
  path: string,
  token?: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    // 서버 컴포넌트 — 요청마다 새로 가져옴 (캐시 안 씀)
    cache: "no-store",
  })

  if (!res.ok) {
    return { success: false, error: `HTTP ${res.status}` }
  }

  return res.json() as Promise<ApiResponse<T>>
}

export const apiClient = {
  get<T>(path: string, token?: string) {
    return apiFetch<T>(path, token)
  },
  post<T>(path: string, body: unknown, token?: string) {
    return apiFetch<T>(path, token, { method: "POST", body: JSON.stringify(body) })
  },
}
