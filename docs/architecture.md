# 아키텍처 — Kit 보일러플레이트

## 개발 단계 (Phase)

| Phase | 내용 | 커밋 |
|-------|------|------|
| 1 | Turborepo 모노레포 구조 전환 | `23feb67` |
| 2 | Hono API 서버 골격 + 인증 미들웨어 | `14a35fc` |
| 3 | 인증 라우트 (`/auth`) + JWT 발급 | `14a35fc` |
| 4 | 기능 라우트 (결제·디바이스·로그·검색) | `14a35fc` |
| 5 | Web(Next.js) · Mobile(Expo) → API 연동 | `14a35fc` |

---

## 전체 시스템 구조

```
┌──────────────────────────────────────────────────────────────────┐
│                        클라이언트 레이어                           │
│                                                                    │
│  ┌─────────────────────────┐   ┌──────────────────────────────┐  │
│  │   apps/web (Next.js 15) │   │  apps/mobile (Expo SDK 54)   │  │
│  │   포트 3000             │   │  포트 8081                    │  │
│  │                         │   │                              │  │
│  │  Server Components      │   │  AuthContext (JWT 저장)      │  │
│  │  Client Components      │   │  Stack Navigator             │  │
│  │  NextAuth v5 세션       │   │  apiClient.ts (Bearer 첨부)  │  │
│  └────────────┬────────────┘   └──────────────┬───────────────┘  │
└───────────────┼──────────────────────────────┼──────────────────┘
                │  HTTP                         │  EXPO_PUBLIC_API_URL
                └──────────────┬────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                    apps/api (Hono, 포트 4000)                      │
│                                                                    │
│  ┌────────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ /auth      │  │ /users   │  │ /stats   │  │ /payments     │  │
│  │ /devices   │  │ /logs    │  │ /search  │  │               │  │
│  └────────────┘  └──────────┘  └──────────┘  └───────────────┘  │
│                                                                    │
│  authMiddleware (JWT Bearer 검증)                                  │
│  CORS (web:3000, expo:8081)                                       │
└──────────────────────────────┬───────────────────────────────────┘
                               │  Prisma ORM
┌──────────────────────────────▼───────────────────────────────────┐
│                  데이터 레이어 (PostgreSQL)                         │
│                                                                    │
│  User · Account · Session · VerificationToken                     │
│  Order · Device · ClientLog                                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Phase 1 — 모노레포 구조

### 디렉터리 트리

```
kit/
├── apps/
│   ├── web/          # Next.js 15 (App Router, NextAuth v5)
│   ├── mobile/       # React Native + Expo SDK 54
│   └── api/          # Hono REST API 서버
├── packages/
│   ├── db/           # Prisma 스키마 + 클라이언트 (공유)
│   └── types/        # 공유 TypeScript 타입
├── docs/
├── scripts/
│   ├── docker-setup.sh
│   └── mobile-start.sh
├── turbo.json
└── package.json      # 루트 워크스페이스
```

### 패키지 의존 관계

```
apps/web    ──▶  @kit/db, @kit/types
apps/mobile ──▶  @kit/types
apps/api    ──▶  @kit/db, @kit/types
packages/db ──▶  @kit/types (내부 참조 없음)
```

### Turborepo 파이프라인

| task | 의존 | 설명 |
|------|------|------|
| `build` | `^build` | 하위 패키지 먼저 빌드 |
| `dev` | — | 병렬 개발 서버 |
| `lint` | — | 병렬 린트 |

---

## Phase 2 — Hono API 서버 골격

### 파일 구조

```
apps/api/src/
├── index.ts            # 서버 진입점 — 라우트 등록, CORS, 에러 핸들러
├── middleware/
│   └── auth.ts         # JWT Bearer 검증 미들웨어
├── lib/
│   ├── jwt.ts          # 토큰 서명/검증 (jose)
│   └── prisma.ts       # Prisma 클라이언트 싱글턴
├── routes/
│   ├── auth.ts
│   ├── users.ts
│   ├── stats.ts
│   ├── payments.ts
│   ├── devices.ts
│   ├── logs.ts
│   └── search.ts
└── services/
    ├── payment.ts      # 결제 로직 (현재 mock)
    └── search.ts       # 검색 로직 (현재 Prisma LIKE)
```

### 공통 설계 원칙

- 모든 응답은 `ApiResponse<T>` 래퍼 사용
  ```ts
  { success: true, data: T }
  { success: false, error: string }
  ```
- 인증 필요 라우트: `authMiddleware` 적용 → `c.get('user')` 로 `TokenPayload` 접근
- 비인증 라우트: `/auth/token`, `/auth/refresh`, `/logs`, `/health`

---

## Phase 3 — 인증 설계

### JWT 토큰 구조

| 토큰 | 유효기간 | 서명 키 환경변수 | 포함 정보 |
|------|---------|----------------|---------|
| Access Token | 15분 | `JWT_ACCESS_SECRET` | sub, email, name, provider |
| Refresh Token | 7일 | `JWT_REFRESH_SECRET` | sub only |

### 인증 흐름 (모바일 기준)

```
앱 → OAuth 로그인 (카카오/네이버/Google)
       │
       ▼
앱 → POST /auth/token { provider, email, name, image }
       │
       ▼  (API: User upsert → JWT 서명)
API → { accessToken, refreshToken, expiresIn }
       │
       ▼
앱 → AsyncStorage에 토큰 저장
       │
       ▼
이후 모든 요청: Authorization: Bearer <accessToken>
       │
       ▼  (만료 시)
앱 → POST /auth/refresh { refreshToken }
       │
       ▼
API → 새 { accessToken, refreshToken }
```

### 토큰 취소 (로그아웃)

- `DELETE /auth/logout` 호출 시 access token을 in-memory `Set`에 추가
- `authMiddleware`에서 매 요청마다 Set 조회 후 거부
- **프로덕션 교체 필요**: in-memory → Redis (서버 재시작 시 초기화 문제)

---

## Phase 4 — 기능 라우트

### 결제 (`/payments`)

```
클라이언트 → 결제 SDK 호출 (토스페이먼츠 위젯)
                │
                ▼
클라이언트 → POST /payments/confirm { orderId, amount, paymentKey }
                │
                ▼  services/payment.ts
API → 결제 PG 서버 검증 (현재 mock, 추후 토스페이먼츠 API)
                │
                ▼
API → DB Order upsert (status: PAID)
                │
                ▼
클라이언트 ← Order 객체 반환
```

### 디바이스 토큰 (`/devices`)

- 푸시 알림(FCM/APNs)을 위한 디바이스 토큰 관리
- upsert 방식: 동일 token이면 소유자·플랫폼 업데이트
- 로그아웃/앱 제거 시 `DELETE /devices/:id` → `active: false`

### 클라이언트 로그 (`/logs`)

- **인증 불필요** — 앱 크래시·로그인 전 에러도 수집
- 단건(`POST /logs`) + 배치(`POST /logs/batch`)
- 오프라인 복귀 시 쌓인 로그를 배치로 한 번에 전송하는 패턴 지원

### 검색 (`/search`)

- `GET /search?q=` → 유저 이름·이메일 LIKE (대소문자 무시)
- `services/search.ts`만 교체하면 Algolia/Elasticsearch 등으로 전환 가능
- 도메인 모델 추가 시 동일 파일 내 results 배열에 병합

---

## Phase 5 — Web · Mobile 연동

### apps/web 구조

```
apps/web/src/
├── app/
│   ├── (auth)/              # 로그인 전 레이아웃
│   │   └── login/page.tsx   # 카카오·네이버·Google 로그인 버튼
│   ├── (dashboard)/         # 로그인 후 레이아웃 (사이드바)
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   └── settings/page.tsx
│   └── layout.tsx
├── components/
│   ├── layout/              # Header, Sidebar
│   ├── providers/           # SessionProvider
│   └── ui/                  # Button, Card, Input, DemoBanner
├── lib/
│   ├── api-client.ts        # Hono API 호출 유틸
│   └── db/prisma.ts         # @kit/db re-export
├── auth.ts                  # NextAuth v5 설정
├── auth.config.ts           # Edge 미들웨어용 설정
└── proxy.ts                 # API 프록시
```

### apps/mobile 구조

```
apps/mobile/
├── App.tsx                  # AuthProvider 래핑, StatusBar
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx  # JWT 저장·갱신·삭제 (AsyncStorage)
│   ├── navigation/
│   │   └── index.tsx        # 인증 상태에 따라 Stack 자동 전환
│   ├── screens/
│   │   ├── LoginScreen.tsx  # OAuth 버튼
│   │   ├── HomeScreen.tsx   # 메인 화면
│   │   └── ProfileScreen.tsx
│   ├── components/
│   │   └── DemoBanner.tsx   # 데모 모드 안내 배너
│   ├── lib/
│   │   └── apiClient.ts     # Bearer 토큰 자동 첨부 fetch 래퍼
│   └── constants/
│       └── colors.ts
```

### 게스트 모드 (Web)

```
/login → "게스트로 둘러보기" 클릭
              │
              ▼  Server Action
API → Set-Cookie: guest_mode=1; HttpOnly; Max-Age=86400
              │
              ▼
미들웨어(auth.config.ts) → request.cookies 확인 → /dashboard 진입 허용
```

---

## 공유 타입 (`packages/types/src/index.ts`)

| 카테고리 | 타입 |
|---------|------|
| 인증 | `Provider`, `AuthUser`, `TokenPair`, `TokenPayload` |
| API | `ApiResponse<T>` |
| 결제 | `Order`, `OrderStatus` |
| 디바이스 | `Device`, `Platform` |
| 로그 | `ClientLogEntry`, `LogLevel` |
| 검색 | `SearchResult` |
| UI | `UserProfile`, `DashboardStats` |

---

## DB 모델 (`packages/db/prisma/schema.prisma`)

| 모델 | 목적 | 주요 필드 |
|------|------|---------|
| `User` | 서비스 사용자 | id(cuid), email(unique), role(ADMIN\|USER) |
| `Account` | OAuth 계정 연결 | provider, providerAccountId |
| `Session` | NextAuth 세션 | sessionToken, expires |
| `VerificationToken` | 이메일 인증 | identifier, token |
| `Order` | 결제 주문 | amount, currency, status, providerTxId |
| `Device` | 푸시 토큰 | token(unique), platform, active |
| `ClientLog` | 클라이언트 로그 | level, message, context(Json) |

---

## React 서버/클라이언트 컴포넌트 전략 (Web)

| 구분 | Server Component | Client Component |
|------|-----------------|-----------------|
| 기본값 | ✅ | `"use client"` 명시 |
| DB 직접 쿼리 | ✅ | ❌ (API 경유) |
| useState / useEffect | ❌ | ✅ |
| JS 번들 포함 | 제외 | 포함 |
| 용도 | 페이지, 데이터 조회, 레이아웃 | 폼, 버튼, 인터랙션 |

---

## 배포 구조

```
apps/web    → Vercel (GitHub 자동 배포)
apps/api    → Render / Railway / EC2 등 Node 호스팅
apps/mobile → EAS Build → App Store / Play Store
```
