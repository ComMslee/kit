# Kit 확장성 개선 계획

> 목표: 일반 서비스 데모 보일러플레이트로 — web/mobile이 공통 API를 바라보는 구조

## 최종 목표 구조

```
kit/  (Turborepo 모노레포)
├── apps/
│   ├── web/          ← launch-kit (Next.js)
│   ├── mobile/       ← mobile-kit (Expo)
│   └── api/          ← 신규: Hono REST API 서버
├── packages/
│   ├── types/        ← 공유 TypeScript 타입 (User, AuthToken 등)
│   └── db/           ← Prisma 스키마 + 클라이언트 (공유)
├── docker-compose.yml
└── turbo.json
```

---

## Phase 1: 모노레포 구조 세팅 ✅

- [x] 루트 `package.json` 워크스페이스 설정 (npm workspaces)
- [x] `turbo.json` 기본 파이프라인 설정 (build, dev, lint)
- [x] `launch-kit` → `apps/web` 이동
- [x] `mobile-kit` → `apps/mobile` 이동
- [x] `packages/types` 생성 (공유 인터페이스: User, AuthUser, ApiResponse 등)
- [x] `packages/db` 생성 (Prisma 스키마 + 클라이언트 export)
- [x] `apps/web`의 Prisma 의존성 → `packages/db` 참조로 전환
- [x] `docker-compose.yml` 경로 업데이트 (모노레포 루트를 빌드 컨텍스트로)
- [x] `apps/web/Dockerfile` 모노레포 대응 (debian slim, OpenSSL, workspace install)
- [x] `.dockerignore` 추가 (node_modules 플랫폼 바이너리 충돌 방지)
- [x] 루트 `scripts/` 경로 업데이트
- [x] `CLAUDE.md` 구조 설명 업데이트

---

## Phase 2: API 서버 (`apps/api`) 구축

- [ ] `apps/api` Hono 프로젝트 초기화 (Node.js 런타임)
- [ ] 기본 디렉토리 구조 설정
  ```
  apps/api/src/
    index.ts          ← 서버 진입점
    routes/
      auth.ts         ← /auth/token, /auth/refresh, /auth/logout
      users.ts        ← /users/me
      stats.ts        ← /stats (대시보드용)
    middleware/
      auth.ts         ← JWT 검증 미들웨어
    lib/
      jwt.ts          ← 토큰 발급/검증
      prisma.ts       ← db 패키지 re-export
  ```
- [ ] JWT 인증 엔드포인트 구현
  - `POST /auth/token` — provider + mockToken → JWT 발급
  - `POST /auth/refresh` — refresh token → 새 access token
  - `DELETE /auth/logout` — 토큰 무효화
- [ ] 보호 라우트 구현
  - `GET /users/me` — 내 프로필 반환
  - `GET /stats` — 대시보드 통계 (현재 mock)
- [ ] CORS 설정 (web + mobile 도메인 허용)
- [ ] `Dockerfile` 작성 (API 서버용)
- [ ] `docker-compose.yml`에 `api` 서비스 추가 (포트 4000)

---

## Phase 3: Web 연동 (`apps/web`)

- [ ] 대시보드 통계 → API 서버 호출로 교체 (`GET /stats`)
- [ ] NextAuth 세션에서 JWT access token 포함하도록 callback 수정
- [ ] `src/lib/api-client.ts` 작성 (서버 컴포넌트용 fetch 래퍼)
- [ ] DemoBanner → 실제 API 연결 후 조건부 표시로 개선 (옵션)

---

## Phase 4: Mobile 연동 (`apps/mobile`)

- [ ] `src/lib/apiClient.ts` 작성 (Axios or fetch 래퍼, Bearer 헤더 자동 첨부)
- [ ] `AuthContext` — 로그인 시 API 서버에서 JWT 발급받아 SecureStore 저장
- [ ] 홈 화면 통계 카드 → `GET /stats` 실제 데이터로 교체
- [ ] 프로필 → `GET /users/me` 실제 데이터로 교체
- [ ] `.env.example` 추가 (`EXPO_PUBLIC_API_URL`)

---

## Phase 5: 문서화 및 정리

- [ ] 루트 `README.md` 전면 개편 (모노레포 구조, 실행 방법)
- [ ] `apps/api/README.md` API 엔드포인트 문서
- [ ] `packages/types/README.md` 타입 정의 설명
- [ ] `.env.example` 파일 전체 정리 (web, api, mobile 각각)
- [ ] `TODO.md` OAuth 실 연동 항목 현행화
- [ ] `temp_plan.md` 삭제 (모든 TODO 완료 시)

---

## 작업 순서 (의존성 고려)

```
Phase 1 (구조) → Phase 2 (API 서버) → Phase 3+4 (클라이언트 연동) → Phase 5 (문서)
```

Phase 3와 4는 병렬 진행 가능.

---

## 결정 사항

| 항목 | 결정 | 이유 |
|------|------|------|
| 패키지 매니저 | npm workspaces | 현재 npm 사용 중, 전환 비용 최소화 |
| API 프레임워크 | Hono | 경량, TypeScript-first, Edge 대응 가능 |
| 인증 방식 | JWT (access 15m + refresh 7d) | 모바일/웹 통일, 플랫폼 무관 |
| API 포트 | 4000 | 3000(web)과 충돌 방지 |
| Turborepo | 도입 | 빌드 캐시 + 태스크 오케스트레이션 |

---

## 진행 상황

- [x] Phase 1 ✅
- [ ] Phase 2
- [ ] Phase 3
- [ ] Phase 4
- [ ] Phase 5
