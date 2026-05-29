# 개발 현황

> 최종 업데이트: 2026-05-30

---

## Phase 별 완료 현황

### Phase 1 — 모노레포 기반 (`23feb67`)

- [x] Turborepo 도입, `apps/` · `packages/` 분리
- [x] `@kit/db` 패키지: Prisma 스키마 + 클라이언트
- [x] `@kit/types` 패키지: 공유 TypeScript 타입
- [x] Docker Compose: Next.js(`3000`) + PostgreSQL(`5432`)
- [x] 개발 스크립트: `docker-setup.sh`, `mobile-start.sh`

---

### Phase 2 — Hono API 서버 골격 (`14a35fc`)

- [x] `apps/api` 생성 (Hono + `@hono/node-server`, 포트 4000)
- [x] 전역 CORS (web:3000, expo:8081)
- [x] 전역 에러 핸들러 → `ApiResponse<T>` 래퍼 통일
- [x] `GET /health` 헬스 체크
- [x] `lib/prisma.ts` 싱글턴
- [x] `lib/jwt.ts` — access(15분) / refresh(7일) 토큰 서명·검증 (`jose`)

---

### Phase 3 — 인증 라우트 (`14a35fc`)

- [x] `POST /auth/token` — OAuth 사용자 정보 → JWT 발급 + User upsert
- [x] `POST /auth/refresh` — refresh token → 새 토큰 발급
- [x] `DELETE /auth/logout` — access token 무효화
- [x] `middleware/auth.ts` — Bearer 검증, `c.set('user', payload)` 주입

---

### Phase 4 — 기능 라우트 (`14a35fc`)

- [x] `GET /users/me` — 인증 사용자 프로필
- [x] `GET /stats` — 대시보드 통계 (totalUsers, todayVisitors)
- [x] `POST /payments/confirm` — 결제 승인 + Order upsert
- [x] `GET /payments/orders` — 내 주문 목록
- [x] `POST /devices` — 디바이스 토큰 등록 (upsert)
- [x] `GET /devices` — 활성 디바이스 목록
- [x] `DELETE /devices/:id` — 디바이스 비활성화
- [x] `POST /logs` — 클라이언트 로그 단건 수신 (인증 불필요)
- [x] `POST /logs/batch` — 로그 배치 수신
- [x] `GET /search?q=` — 유저 이름·이메일 검색

---

### Phase 5 — Web · Mobile 연동 (`14a35fc`)

**apps/web**
- [x] App Router 경로 그룹: `(auth)`, `(dashboard)`
- [x] NextAuth v5: 카카오·네이버·Google OAuth
- [x] 게스트 모드: HttpOnly cookie `guest_mode=1` (24h)
- [x] Edge 미들웨어: 세션·게스트 쿠키 동시 확인
- [x] `api-client.ts` — Hono API 호출 유틸
- [x] DemoBanner 컴포넌트
- [x] 페이지: `/login`, `/dashboard`, `/users`, `/settings`

**apps/mobile**
- [x] `AuthContext` — JWT AsyncStorage 저장·갱신·삭제
- [x] Stack 네비게이터 — `user` 상태 기반 자동 전환
- [x] `apiClient.ts` — Bearer 토큰 자동 첨부 fetch 래퍼
- [x] DemoBanner 컴포넌트
- [x] 스크린: `LoginScreen`, `HomeScreen`, `ProfileScreen`

---

## 미완료 항목 (TODO)

| 우선순위 | 항목 | 위치 | 설명 |
|---------|------|------|------|
| 높음 | Redis 토큰 블랙리스트 | `middleware/auth.ts` | 현재 in-memory Set — 재시작 시 초기화 |
| 높음 | `DATABASE_URL` 환경변수 | `packages/db/prisma/schema.prisma` | datasource url 미설정 |
| 중간 | 토스페이먼츠 실 연동 | `services/payment.ts` | mock → 실 API 교체 |
| 중간 | 토큰 자동 갱신 | `apps/mobile/src/lib/apiClient.ts` | 401 시 refresh 재시도 |
| 중간 | 실 OAuth 연동 (모바일) | `apps/mobile/src/screens/LoginScreen.tsx` | `react-native-app-auth` 연동 |
| 낮음 | 검색 고도화 | `services/search.ts` | Algolia / Typesense 전환 |
| 낮음 | `monthlyRevenue`, `pendingItems` | `routes/stats.ts` | 도메인 모델 추가 후 실제 값 반환 |
| 낮음 | `app.json` 식별자 변경 | `apps/mobile/app.json` | 신규 프로젝트 시작 시 name·slug·bundleIdentifier |
| 낮음 | 도메인 모델 확장 | `packages/db/prisma/schema.prisma` | 프로젝트별 비즈니스 모델 추가 |

---

## 관련 문서

| 문서 | 내용 |
|------|------|
| [architecture.md](architecture.md) | Phase별 구조, 파일 트리, 설계 결정 |
| [api.md](api.md) | 전체 API 엔드포인트 스펙 |
| [auth.md](auth.md) | OAuth 흐름, JWT, 게스트 모드 |
| [deployment.md](deployment.md) | Vercel · Render · EAS Build 배포 절차 |
