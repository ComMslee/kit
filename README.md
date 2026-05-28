# Kit — 외주 보일러플레이트

웹·모바일·API 서버가 하나의 모노레포에 묶인 외주 프로젝트 스타터입니다.

## 구성

```
kit/  (Turborepo 모노레포)
├── apps/
│   ├── web/      # Next.js 15 · App Router · NextAuth v5
│   ├── mobile/   # React Native + Expo SDK 54
│   └── api/      # Hono REST API 서버 (포트 4000)
├── packages/
│   ├── db/       # Prisma 스키마 + 클라이언트 (공유)
│   └── types/    # 공유 TypeScript 타입
└── docs/         # 상세 문서
```

## 아키텍처

```
┌────────────────────┐   ┌────────────────────┐
│  🌐 Web (포트 3000) │   │  📱 iOS / Android  │
│  apps/web          │   │  apps/mobile       │
└─────────┬──────────┘   └─────────┬──────────┘
          │  INTERNAL_API_URL          │  EXPO_PUBLIC_API_URL
          └─────────────┬─────────────┘
                        │
          ┌─────────────▼─────────────┐
          │  Hono API (포트 4000)      │
          │  apps/api                 │
          └─────────────┬─────────────┘
                        │  Prisma ORM
          ┌─────────────▼─────────────┐
          │  PostgreSQL (포트 5432)    │
          └───────────────────────────┘
```

> 상세 아키텍처 → [docs/architecture.md](./docs/architecture.md)

## 빠른 시작

### Docker로 전체 실행 (권장)

```bash
# 1. 환경 변수 설정
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# 2. 전체 스택 실행 (PostgreSQL + API + Web)
./scripts/docker-setup.sh
```

컨테이너가 뜨면 http://localhost:3000 에서 확인.

### 로컬 직접 실행

```bash
# 의존성 설치
npm install

# DB 마이그레이션
npm run db:migrate

# 전체 개발 서버 (web + api 동시)
npm run dev
```

### 모바일 실행

```bash
./scripts/mobile-start.sh              # QR (Expo Go)
./scripts/mobile-start.sh --ios        # iOS 시뮬레이터
./scripts/mobile-start.sh --android   # Android 에뮬레이터
./scripts/mobile-start.sh --tunnel    # 다른 Wi-Fi 환경
```

## 컨테이너 목록

| 서비스 | 컨테이너명 | 포트 |
|--------|-----------|------|
| Next.js 웹 | `base-web` | 3000 |
| Hono API | `base-api` | 4000 |
| PostgreSQL | `base-db` | 5432 |

## 환경 변수

| 파일 | 대상 |
|------|------|
| `apps/web/.env` | NextAuth, OAuth 키, DB URL, API URL |
| `apps/api/.env` | JWT 시크릿, DB URL |
| `apps/mobile/.env` | API URL (`EXPO_PUBLIC_API_URL`) |

각 앱의 `.env.example` 참고.

## 인증 구조

| 모드 | 방식 | 유효기간 |
|------|------|---------|
| OAuth (카카오/네이버/Google) | NextAuth v5 세션 + JWT | 세션 기간 |
| 게스트 모드 | `guest_mode=1` HttpOnly 쿠키 | 24시간 |
| 모바일 | JWT (access 15분 + refresh 7일) | 토큰 기간 |

> OAuth 상세 → [docs/auth.md](./docs/auth.md)

## 문서

| 문서 | 내용 |
|------|------|
| [docs/architecture.md](./docs/architecture.md) | 레이어별 아키텍처 |
| [docs/auth.md](./docs/auth.md) | OAuth 흐름, NextAuth 설정, 모바일 인증 |
| [docs/api.md](./docs/api.md) | API 엔드포인트 스펙 |
| [docs/deployment.md](./docs/deployment.md) | Vercel · EAS 배포 가이드 |
| [TODO.md](./TODO.md) | 새 프로젝트 시작 전 체크리스트 |

## 새 외주 프로젝트 시작 체크리스트

1. `.env.example` → `.env` 복사 후 키 입력 (web, api, mobile 각각)
2. `packages/db/prisma/schema.prisma` 에 도메인 모델 추가 → `npm run db:migrate`
3. OAuth 콘솔에서 앱 등록 및 Redirect URI 설정
4. `apps/mobile/app.json` → `name`, `slug`, `bundleIdentifier` 변경

## 라이선스

MIT
