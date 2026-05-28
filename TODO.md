# TODO — 새 외주 프로젝트 시작 체크리스트

> 보일러플레이트를 복사한 뒤, 실제 프로젝트에 맞게 설정해야 할 항목들입니다.

---

## 🔴 필수

### 환경 변수 설정

- [ ] `apps/web/.env.example` → `apps/web/.env` 복사 후 값 입력
- [ ] `apps/api/.env.example` → `apps/api/.env` 복사 후 JWT 시크릿 생성
  ```bash
  openssl rand -base64 32  # JWT_ACCESS_SECRET
  openssl rand -base64 32  # JWT_REFRESH_SECRET
  ```
- [ ] `apps/mobile/.env.example` → `apps/mobile/.env` 복사 후 API URL 입력

### DB 초기화

- [ ] `npm run db:migrate` 로 최초 마이그레이션 실행
- [ ] (도메인 모델 확정 후) `packages/db/prisma/schema.prisma` 수정 → 재마이그레이션

### OAuth 콘솔 설정

- [ ] [카카오 디벨로퍼스](https://developers.kakao.com) → 앱 생성 → REST API 키 발급
  - Redirect URI: `http://localhost:3000/api/auth/callback/kakao`
- [ ] [네이버 디벨로퍼스](https://developers.naver.com) → 앱 등록 → Client ID/Secret 발급
  - Redirect URI: `http://localhost:3000/api/auth/callback/naver`
- [ ] [Google Cloud Console](https://console.cloud.google.com) → OAuth 2.0 클라이언트 생성
  - Redirect URI: `http://localhost:3000/api/auth/callback/google`

### 앱 아이덴티티

- [ ] `apps/mobile/app.json` → `name`, `slug`, `bundleIdentifier` 프로젝트명으로 변경
- [ ] `apps/mobile/assets/` → 앱 아이콘, 스플래시 이미지 교체

---

## 🟡 권장

### 기능 확장

- [ ] 회원가입 시 추가 정보 수집 폼 (온보딩)
- [ ] 관리자 페이지 (`/admin`) 기본 틀
- [ ] 이메일 알림 (Resend 또는 Nodemailer)
- [ ] AWS S3 파일 업로드 (`@aws-sdk/client-s3`)
- [ ] 결제 연동 (토스페이먼츠 테스트 키 → `/api/payments/confirm`)

### 인프라

- [ ] Redis 연동 (API 서버 로그아웃 토큰 무효화, 현재는 메모리 Set)
- [ ] `apps/api/src/routes/stats.ts` — `monthlyRevenue`, `pendingItems` 실제 쿼리로 교체
- [ ] 프로덕션 OAuth Redirect URI 등록 (각 콘솔에 배포 도메인 추가)

---

## 🟢 배포

### 웹 (`apps/web`)

- [ ] [Vercel](https://vercel.com) 연결 → GitHub 레포 import
- [ ] Vercel 환경변수 설정 (DB URL, OAuth 키, NEXTAUTH_SECRET, INTERNAL_API_URL)
- [ ] PostgreSQL 프로덕션 DB 연결 (Supabase / Neon / PlanetScale)

### API (`apps/api`)

- [ ] Railway / Fly.io / EC2 등에 컨테이너 배포
- [ ] 프로덕션 JWT 시크릿 교체
- [ ] 로그아웃 토큰 저장소 Redis로 교체

### 모바일 (`apps/mobile`)

- [ ] `npm install -g eas-cli && eas login`
- [ ] `eas build:configure` (eas.json 생성)
- [ ] Android `.aab` 빌드: `eas build --platform android`
- [ ] iOS `.ipa` 빌드: `eas build --platform ios`
- [ ] 앱스토어 제출: `eas submit`
- [ ] `EXPO_PUBLIC_API_URL` 프로덕션 도메인으로 변경
