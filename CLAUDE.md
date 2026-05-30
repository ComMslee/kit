# CLAUDE.md — Kit 외주 보일러플레이트

외주 프로젝트를 빠르게 시작하기 위한 모노레포.  
웹(Next.js)과 모바일(React Native)이 동일한 Hono API 백엔드를 공유합니다.

---

## 폴더 구조

```
kit/
├── apps/
│   ├── web/                        # Next.js 15 웹 앱
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/         # 로그인 전 페이지 (URL에 (auth) 미포함)
│   │   │   │   │   └── login/      # → /login
│   │   │   │   ├── (dashboard)/    # 로그인 후 페이지 (URL에 (dashboard) 미포함)
│   │   │   │   │   ├── dashboard/  # → /dashboard
│   │   │   │   │   ├── users/      # → /users
│   │   │   │   │   ├── settings/   # → /settings
│   │   │   │   │   └── {feature}/  # 신규 페이지는 여기에 추가
│   │   │   │   └── api/            # Next.js API Routes (NextAuth 전용)
│   │   │   ├── components/
│   │   │   │   ├── layout/         # Sidebar, Header 등 레이아웃 컴포넌트
│   │   │   │   └── ui/             # Button, Card 등 기본 UI 컴포넌트
│   │   │   ├── lib/
│   │   │   │   ├── api-client.ts   # Hono API 호출 유틸 (서버 컴포넌트용)
│   │   │   │   ├── db/             # Prisma 클라이언트 (→ @kit/db 재export)
│   │   │   │   └── utils.ts        # 공통 유틸 함수
│   │   │   ├── hooks/              # 커스텀 React 훅
│   │   │   ├── types/              # 웹 전용 타입 (공유 타입은 @kit/types)
│   │   │   ├── auth.ts             # NextAuth 핸들러
│   │   │   └── auth.config.ts      # Edge 미들웨어 + 인증 설정
│   │   ├── public/                 # 정적 파일
│   │   ├── Dockerfile
│   │   └── .env.example
│   │
│   ├── mobile/                     # React Native + Expo SDK 54
│   │   ├── src/
│   │   │   ├── screens/            # 화면 컴포넌트 ({Feature}Screen.tsx)
│   │   │   ├── components/         # 재사용 컴포넌트
│   │   │   ├── navigation/
│   │   │   │   └── index.tsx       # Stack · Tab 네비게이터 정의
│   │   │   ├── contexts/
│   │   │   │   └── AuthContext.tsx # JWT + AsyncStorage 인증 상태
│   │   │   ├── lib/
│   │   │   │   └── apiClient.ts    # Bearer 토큰 자동 첨부 fetch 래퍼
│   │   │   └── constants/          # colors, spacing 등 디자인 토큰
│   │   ├── assets/                 # 아이콘, 스플래시 이미지
│   │   ├── app.json
│   │   └── .env.example
│   │
│   └── api/                        # Hono REST API (Node.js)
│       ├── src/
│       │   ├── routes/             # 라우터 파일 ({feature}.ts)
│       │   ├── services/           # 비즈니스 로직 ({feature}.ts)
│       │   ├── middleware/
│       │   │   └── auth.ts         # Bearer JWT 검증 미들웨어
│       │   ├── lib/
│       │   │   ├── jwt.ts          # access/refresh 토큰 서명·검증
│       │   │   └── prisma.ts       # Prisma 싱글턴
│       │   └── index.ts            # 앱 진입점 + 라우트 마운트
│       ├── Dockerfile
│       └── .env.example
│
├── packages/
│   ├── db/                         # 공유 Prisma 패키지 (@kit/db)
│   │   ├── prisma/
│   │   │   └── schema.prisma       # DB 스키마 (여기서만 수정)
│   │   └── src/
│   │       └── index.ts            # prisma 클라이언트 export
│   └── types/                      # 공유 TypeScript 타입 (@kit/types)
│       └── src/
│           └── index.ts            # 모든 공유 타입 정의
│
├── scripts/                        # 루트 공용 스크립트
│   ├── docker-setup.sh             # Docker 환경 초기화 (웹 + API + DB)
│   └── mobile-start.sh             # Expo 개발 서버 실행
│
├── docs/                           # 프로젝트 문서
│   ├── architecture.md
│   ├── api.md
│   ├── auth.md
│   ├── deployment.md
│   └── progress.md                 # Phase별 구현 현황
│
├── docker-compose.yml              # 3개 서비스: web(3000) · api(4000) · db(5432)
└── turbo.json                      # Turborepo 파이프라인
```

---

## 새 기능 추가 규칙

### 웹에 페이지 추가
1. `apps/web/src/app/(dashboard)/{feature}/page.tsx` 생성
2. `apps/web/src/components/layout/sidebar.tsx`의 `NAV_ITEMS`에 링크 추가
3. URL은 `/{feature}` (괄호 그룹명 포함 금지)

### 모바일에 스크린 추가
1. `apps/mobile/src/screens/{Feature}Screen.tsx` 생성
2. `apps/mobile/src/navigation/index.tsx`에 Tab 또는 Stack 스크린 등록

### API에 엔드포인트 추가
1. `apps/api/src/routes/{feature}.ts` 생성
2. `apps/api/src/index.ts`에 `app.route('/{feature}', ...)` 마운트
3. 비즈니스 로직이 복잡하면 `apps/api/src/services/{feature}.ts`로 분리

### 공유 타입 추가
- `packages/types/src/index.ts`에만 정의 (웹·모바일·API 모두 `@kit/types`로 import)

### DB 스키마 변경
- `packages/db/prisma/schema.prisma` 수정 후 루트에서 `npm run db:migrate`

---

## 핵심 컨벤션

### 언어 · 타입
- **TypeScript** 전용 (`.ts` / `.tsx`) — `any` 사용 금지
- 공유 타입: `packages/types/src/index.ts` (`@kit/types`)
- Prisma 모델 타입: `packages/db/src/index.ts` (`@kit/db`)

### apps/web (Next.js)
- **Server Component** 기본, 인터랙션 필요 시만 `"use client"`
- DB는 항상 Server Component 또는 API Route에서 접근 (클라이언트 직접 접근 금지)
- Prisma 클라이언트: `import { prisma } from '@/lib/db/prisma'`
- Hono API 호출: `import { apiClient } from '@/lib/api-client'`
- 경로 그룹: `(auth)` 로그인 전, `(dashboard)` 로그인 후

### apps/mobile (React Native)
- 인증 상태: `AuthContext` (AsyncStorage 기반) → `useAuth()` 훅
- 네비게이션: 로그인 상태에 따라 Stack 자동 전환 (수동 `navigate` 호출 금지)
- API 호출: `apiClient.get()` / `apiClient.post()` (Bearer 토큰 자동 첨부)
- 환경변수 접두어: `EXPO_PUBLIC_` 필수

### apps/api (Hono)
- 인증 필요 라우트: `authMiddleware` 적용 후 `c.get('user')`로 페이로드 접근
- 응답 형식: 항상 `ApiResponse<T>` 래퍼 (`{ success, data?, error? }`)
- Docker 내부 DB: `DATABASE_URL`은 `docker-compose.yml`이 `db:5432`로 덮어씀

### 커밋 메시지
```
feat: 기능 설명
fix: 버그 설명
chore: 설정/의존성 변경
docs: 문서 변경
```

---

## 개발 서버 실행

```bash
# 웹 + API + DB (Docker)
./scripts/docker-setup.sh

# 모바일 (Expo QR)
./scripts/mobile-start.sh              # QR 기본 모드
./scripts/mobile-start.sh --ios        # iOS 시뮬레이터
./scripts/mobile-start.sh --android    # Android 에뮬레이터
./scripts/mobile-start.sh --tunnel     # 다른 Wi-Fi 환경
```

> 모바일 QR 코드는 Mac 로컬 IP를 자동 포함 — 같은 Wi-Fi면 별도 설정 불필요.  
> 실서비스 배포 시 `EXPO_PUBLIC_API_URL`을 실제 도메인으로 변경 필수.

---

## Docker 컨테이너

| 서비스 | 컨테이너명 | 포트 | 비고 |
|--------|-----------|------|------|
| Next.js 웹 | `base-web` | 3000 | `INTERNAL_API_URL=http://api:4000` |
| Hono API | `base-api` | 4000 | `DATABASE_URL=...@db:5432/...` |
| PostgreSQL | `base-db` | 5432 | 볼륨: `postgres_data` |

> Docker 내부에서 web → api 통신은 `http://api:4000` (서비스명)을 사용.  
> `localhost:4000`은 컨테이너 밖(호스트)에서만 유효.

---

## 인증 구조

| 모드 | 방식 | 유효기간 |
|------|------|---------|
| OAuth (카카오/네이버/Google) | NextAuth v5 세션 | 세션 기간 |
| 게스트 모드 | `guest_mode=1` HttpOnly cookie | 24시간 |
| 모바일 JWT | access(15분) / refresh(7일) | AsyncStorage 저장 |

**게스트 모드 흐름:**  
`/login` → "게스트로 둘러보기" → Server Action이 쿠키 설정 → `/dashboard` 리다이렉트  
미들웨어(`auth.config.ts`)에서 `request.cookies`로 Edge Runtime 호환 방식으로 확인.

---

## 상세 문서

| 문서 | 내용 |
|------|------|
| [docs/architecture.md](docs/architecture.md) | 레이어별 아키텍처, 컴포넌트 구조 |
| [docs/auth.md](docs/auth.md) | OAuth 흐름, NextAuth 설정, 모바일 인증 |
| [docs/api.md](docs/api.md) | API 라우트 목록, 요청/응답 스펙 |
| [docs/deployment.md](docs/deployment.md) | Vercel(웹) · EAS Build(앱) 배포 절차 |
| [docs/progress.md](docs/progress.md) | Phase별 구현 현황 및 TODO |
| [docs/todo.md](docs/todo.md) | 새 외주 프로젝트 시작 체크리스트 |

---

## 새 외주 프로젝트 시작 체크리스트

1. `apps/web/.env.example` → `.env` 복사 후 키 입력
2. `apps/api/.env.example` → `.env` 복사 후 시크릿 교체
3. `packages/db/prisma/schema.prisma`에 도메인 모델 추가 → `npm run db:migrate`
4. OAuth 콘솔(카카오/네이버/Google)에서 앱 등록 및 Redirect URI 설정
5. `apps/mobile/.env`에 `EXPO_PUBLIC_*` 키 입력
6. `app.json` → `name`, `slug`, `bundleIdentifier` 프로젝트명으로 변경
