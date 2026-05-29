# 인증 설계 (Auth)

Kit은 플랫폼별로 다른 인증 방식을 사용하지만, **Hono API 서버에서 JWT를 통일 발급**하는 구조입니다.

---

## 전체 인증 구조

```
┌───────────────────────────────────────────────────────────────────┐
│  apps/web                          apps/mobile                    │
│                                                                   │
│  NextAuth v5 세션 관리              JWT (AsyncStorage 저장)        │
│  ─ 서버 사이드 세션                 ─ access 15분 / refresh 7일    │
│  ─ DB Adapter (Account·Session)    ─ 만료 시 자동 갱신             │
└──────────────┬────────────────────────────────┬──────────────────┘
               │                                │
               ▼                                ▼
        POST /auth/token               POST /auth/token
          (NextAuth 콜백)                (OAuth 완료 후)
               │                                │
               └──────────────┬─────────────────┘
                              ▼
                    apps/api — JWT 발급
                    User upsert (DB)
                    ─ accessToken  (15분, HS256)
                    ─ refreshToken (7일,  HS256)
```

---

## Web — NextAuth v5

### 지원 Provider

| Provider | 환경변수 prefix | Redirect URI |
|----------|----------------|-------------|
| 카카오 | `KAKAO_` | `/api/auth/callback/kakao` |
| 네이버 | `NAVER_` | `/api/auth/callback/naver` |
| Google | `GOOGLE_` | `/api/auth/callback/google` |

### OAuth 흐름

```
사용자 → [로그인 버튼] → signIn('kakao' | 'naver' | 'google')
              │
              ▼
OAuth Provider 인가 서버
              │ 인가코드
              ▼
/api/auth/callback/{provider}  (NextAuth 자동 처리)
              │
              ▼
NextAuth 콜백 → 액세스토큰 교환 → 사용자 정보 조회
              │
              ▼
PrismaAdapter → User + Account DB upsert
              │
              ▼
세션 쿠키 발급 → /dashboard 리다이렉트
```

### 세션 사용

```tsx
// Server Component
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()
  if (!session) redirect('/login')
  return <div>{session.user?.name}</div>
}
```

```tsx
// Client Component
import { useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()
  return <span>{session?.user?.name}</span>
}
```

### 미들웨어 (`auth.config.ts`)

Edge Runtime 호환 방식으로 쿠키를 검사합니다.

```ts
// 게스트 모드: guest_mode=1 쿠키 확인
// 세션: NextAuth 세션 토큰 확인
// 미보호 경로: /login, /api/auth/**
```

### 게스트 모드

데모·테스트용으로 로그인 없이 대시보드 접근을 허용합니다.

```
/login → "게스트로 둘러보기" 클릭
              │  Server Action
              ▼
Set-Cookie: guest_mode=1; HttpOnly; Path=/; Max-Age=86400
              │
              ▼
/dashboard 리다이렉트
```

- 쿠키 유효기간: **24시간**
- 미들웨어에서 `request.cookies.get('guest_mode')?.value === '1'` 확인
- DemoBanner 컴포넌트로 게스트 상태 안내

### 필요 환경변수 (`apps/web/.env`)

```env
AUTH_SECRET=...              # openssl rand -base64 32
AUTH_URL=http://localhost:3000

KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...

NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Hono API URL (선택: web→api 직접 호출 시)
API_URL=http://localhost:4000
```

---

## Mobile — JWT + AsyncStorage

### 인증 상태 관리 (`AuthContext`)

```tsx
interface AuthContextValue {
  user: AuthUser | null
  tokens: TokenPair | null
  login: (user: AuthUser, tokens: TokenPair) => Promise<void>
  logout: () => Promise<void>
}
```

- `login`: AsyncStorage에 user + tokens 저장 → 네비게이터 자동 전환
- `logout`: AsyncStorage 삭제 + `DELETE /auth/logout` 호출 → 로그인 스택으로 전환

### 인증 흐름

```
[로그인 버튼] → OAuth 라이브러리 호출
                    │ (현재: mock delay 1초)
                    │ (실제: react-native-app-auth)
                    ▼
              OAuth 성공 → 사용자 정보 획득
                    │
                    ▼
              POST /auth/token { provider, email, name }
                    │
                    ▼
              { accessToken, refreshToken } 수신
                    │
                    ▼
              AsyncStorage 저장 → AuthContext 업데이트
                    │
                    ▼
              Stack Navigator → Main 탭으로 자동 전환
```

### API 호출 (`apiClient.ts`)

모든 요청에 Bearer 토큰을 자동 첨부합니다.

```ts
// 사용 예시
const data = await apiClient.get('/users/me')
const order = await apiClient.post('/payments/confirm', { orderId, amount, paymentKey })
```

- 401 응답 시 `/auth/refresh` 자동 호출 → 토큰 갱신 후 재시도 (추후 구현)

### 네비게이션 전략

```
AppNavigator
├── user === null  → AuthStack (LoginScreen)
└── user !== null  → MainStack (Home, Profile)
```

수동 `navigate()` 호출 없이 `user` 상태 변화만으로 전환.

### 실제 OAuth 연동 (추후 작업)

```bash
npm install react-native-app-auth
```

```ts
import { authorize } from 'react-native-app-auth'

const result = await authorize({
  issuer: 'https://kauth.kakao.com',
  clientId: process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID!,
  redirectUrl: 'com.yourapp://oauth',
  scopes: ['profile_nickname', 'account_email'],
})
// result.accessToken → POST /auth/token
```

### 필요 환경변수 (`apps/mobile/.env`)

```env
EXPO_PUBLIC_API_URL=http://localhost:4000

EXPO_PUBLIC_KAKAO_CLIENT_ID=...
EXPO_PUBLIC_NAVER_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_CLIENT_ID=...
```

---

## OAuth 콘솔 설정

### 카카오 디벨로퍼스

- [ ] 앱 생성 → REST API 키 발급
- [ ] 카카오 로그인 활성화
- [ ] Redirect URI: `http://localhost:3000/api/auth/callback/kakao`
- [ ] 동의항목: 닉네임, 카카오계정(이메일)

### 네이버 디벨로퍼스

- [ ] 앱 등록 → Client ID/Secret 발급
- [ ] 서비스 URL: `http://localhost:3000`
- [ ] Callback URL: `http://localhost:3000/api/auth/callback/naver`

### Google Cloud Console

- [ ] OAuth 2.0 클라이언트 ID 생성
- [ ] 승인된 리디렉션 URI: `http://localhost:3000/api/auth/callback/google`

---

## 보안 주의사항

| 항목 | 현재 상태 | 프로덕션 교체 필요 |
|------|----------|-----------------|
| 토큰 블랙리스트 | in-memory `Set` (재시작 시 초기화) | Redis |
| JWT 시크릿 | `.env` 기본값 dev 문자열 | 랜덤 32자 이상 |
| HTTPS | localhost HTTP | 프로덕션 필수 |
| 토큰 자동 갱신 | 미구현 | 401 시 refresh 재시도 로직 |
