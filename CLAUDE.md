# CLAUDE.md — Kit 외주 보일러플레이트

외주 프로젝트를 빠르게 시작하기 위한 모노레포.  
웹(Next.js)과 모바일(React Native)이 동일한 백엔드를 공유합니다.

## 구성

```
kit/
├── apps/
│   ├── web/      # Next.js 15 웹 앱 (App Router · NextAuth v5)
│   ├── mobile/   # React Native + Expo SDK 54 앱
│   └── api/      # Hono REST API 서버 (Phase 2 예정)
├── packages/
│   ├── db/       # Prisma 스키마 + 클라이언트 (공유)
│   └── types/    # 공유 TypeScript 타입
└── docs/         # 상세 문서
```

## 상세 문서

| 문서 | 내용 |
|------|------|
| [docs/architecture.md](docs/architecture.md) | 레이어별 아키텍처, 컴포넌트 구조 |
| [docs/auth.md](docs/auth.md) | OAuth 흐름, NextAuth 설정, 모바일 인증 |
| [docs/api.md](docs/api.md) | API 라우트 목록, 요청/응답 스펙 |
| [docs/deployment.md](docs/deployment.md) | Vercel(웹) · EAS Build(앱) 배포 절차 |

## 핵심 컨벤션

### 언어 · 타입
- **TypeScript** 전용 (`.ts` / `.tsx`) — `any` 사용 금지
- 공유 타입: `packages/types/src/index.ts` (`@kit/types`)
- Prisma 모델 타입: `packages/db/src/index.ts` (`@kit/db`)

### apps/web (Next.js)
- **Server Component** 기본, 인터랙션 필요 시만 `"use client"`
- DB는 항상 Server Component 또는 API Route에서 접근 (클라이언트 직접 접근 금지)
- Prisma 클라이언트: `import { prisma } from '@/lib/db/prisma'` → `@kit/db` 재export
- 경로 그룹: `(auth)` 로그인 전, `(dashboard)` 로그인 후

### apps/mobile (React Native)
- 인증 상태: `AuthContext` (AsyncStorage 기반) → `useAuth()` 훅
- 네비게이션: 로그인 상태에 따라 Stack 자동 전환 (수동 `navigate` 호출 금지)
- 환경변수 접두어: `EXPO_PUBLIC_` 필수

### packages/db
- Prisma 스키마: `packages/db/prisma/schema.prisma`
- 마이그레이션: 루트에서 `npm run db:migrate`
- 직접 실행: `cd packages/db && npx prisma studio`

### 커밋 메시지
```
feat: 기능 설명
fix: 버그 설명
chore: 설정/의존성 변경
docs: 문서 변경
```

## 개발 서버 실행

```bash
# 웹 + DB (Docker)
./scripts/docker-setup.sh

# 모바일 (Expo QR)
./scripts/mobile-start.sh              # QR 기본 모드
./scripts/mobile-start.sh --ios        # iOS 시뮬레이터
./scripts/mobile-start.sh --android    # Android 에뮬레이터
./scripts/mobile-start.sh --tunnel     # 다른 Wi-Fi 환경
```

> 모바일 QR 코드는 Mac 로컬 IP를 자동 포함 — 같은 Wi-Fi면 별도 설정 불필요.  
> 실서비스 배포 시 `EXPO_PUBLIC_API_URL`을 실제 도메인으로 변경 필수.

## Docker 컨테이너

| 서비스 | 컨테이너명 | 포트 |
|--------|-----------|------|
| Next.js 웹 | `base-web` | 3000 |
| PostgreSQL | `base-db` | 5432 |

## 인증 구조

| 모드 | 방식 | 유효기간 |
|------|------|---------|
| OAuth (카카오/네이버/Google) | NextAuth v5 세션 | 세션 기간 |
| 게스트 모드 | `guest_mode=1` HttpOnly cookie | 24시간 |

**게스트 모드 흐름:**  
`/login` → "게스트로 둘러보기" → Server Action이 쿠키 설정 → `/dashboard` 리다이렉트  
미들웨어(`auth.config.ts`)에서 `request.cookies`로 Edge Runtime 호환 방식으로 확인.

## 새 외주 프로젝트 시작 체크리스트

1. `apps/web/.env.example` → `.env` 복사 후 키 입력
2. `packages/db/prisma/schema.prisma` 에 도메인 모델 추가 → `npm run db:migrate`
3. OAuth 콘솔(카카오/네이버/Google)에서 앱 등록 및 Redirect URI 설정
4. `apps/mobile/.env` 에 `EXPO_PUBLIC_*` 키 입력
5. `app.json` → `name`, `slug`, `bundleIdentifier` 프로젝트명으로 변경
