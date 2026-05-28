const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

async function apiFetch<T>(
  path: string,
  token?: string | null,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers })
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` }
    return res.json() as Promise<ApiResponse<T>>
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

export const apiClient = {
  get<T>(path: string, token?: string | null) {
    return apiFetch<T>(path, token)
  },
  post<T>(path: string, body: unknown, token?: string | null) {
    return apiFetch<T>(path, token, { method: 'POST', body: JSON.stringify(body) })
  },
  delete<T>(path: string, token?: string | null) {
    return apiFetch<T>(path, token, { method: 'DELETE' })
  },
}
