# @kit/types — 공유 TypeScript 타입

`apps/web`, `apps/api`, `apps/mobile` 이 공통으로 사용하는 TypeScript 인터페이스 모음입니다.

## 타입 목록

### 인증

```ts
type Provider = 'kakao' | 'naver' | 'google'

interface AuthUser {
  id: string
  name: string
  email: string
  provider: Provider
  avatar?: string
}
```

### API 응답 래퍼

```ts
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

모든 API 응답은 이 형태로 반환됩니다.

### JWT 토큰

```ts
interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number  // seconds (access: 900)
}

interface TokenPayload {
  sub: string        // user id
  email: string
  name: string
  provider: Provider
  iat?: number
  exp?: number
}
```

### 도메인

```ts
interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  provider?: Provider
  role: 'ADMIN' | 'USER'
  createdAt: string
}

interface DashboardStats {
  totalUsers: number
  todayVisitors: number
  monthlyRevenue: number
  pendingItems: number
}
```

## 사용법

```ts
import type { ApiResponse, UserProfile, TokenPair } from '@kit/types'
```

새 도메인 타입은 `src/index.ts` 에 추가하세요.
