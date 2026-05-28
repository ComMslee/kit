# TODO

> 외주 프로젝트 진행 전 완료해야 할 항목들입니다.

---

## 🔴 필수 (launch-kit)

### 인프라 & DB
- [ ] PostgreSQL 로컬 설치 및 `.env` DB_URL 연결
- [ ] `npx prisma migrate dev --name init` 최초 마이그레이션 실행
- [ ] `.env.example` 파일 작성 (키 값 제외, 변수명만)

### OAuth 콘솔 설정
- [ ] [카카오 디벨로퍼스](https://developers.kakao.com) → 앱 생성 → REST API 키 발급
  - Redirect URI: `http://localhost:3000/api/auth/callback/kakao`
- [ ] [네이버 디벨로퍼스](https://developers.naver.com) → 앱 등록 → Client ID/Secret 발급
  - Redirect URI: `http://localhost:3000/api/auth/callback/naver`
- [ ] [Google Cloud Console](https://console.cloud.google.com) → OAuth 2.0 클라이언트 생성
  - Redirect URI: `http://localhost:3000/api/auth/callback/google`
- [ ] `NEXTAUTH_SECRET` 생성: `openssl rand -base64 32`

---

## 🟡 권장 (launch-kit)

### 결제
- [ ] [토스페이먼츠 개발자센터](https://developers.tosspayments.com) → 테스트 키 발급
- [ ] `/api/payments/confirm` 라우트 구현 (서버 검증 로직)
- [ ] 결제 완료 후 DB 저장 연동

### 기능 확장
- [ ] 회원가입 시 추가 정보 수집 폼 (온보딩)
- [ ] 관리자 페이지 (`/admin`) 기본 틀
- [ ] 이메일 알림 (Resend 또는 Nodemailer)
- [ ] AWS S3 파일 업로드 (`@aws-sdk/client-s3`)

---

## 🔴 필수 (mobile-kit)

### 실기기 테스트
- [ ] iPhone/Android에 **Expo Go** 앱 설치
- [ ] `cd mobile-kit && npx expo start` → QR 스캔으로 확인
- [ ] 로그인 화면, 홈 탭, 프로필 탭 정상 렌더링 확인

### 인증 연동
- [ ] `react-native-app-auth` 설치
- [ ] `LoginScreen.tsx` Alert 플레이스홀더 → 실제 OAuth 로직 교체
- [ ] `src/navigation/index.tsx` `isLoggedIn` 하드코딩 → AsyncStorage/SecureStore 연동

---

## 🟡 권장 (mobile-kit)

### 웹 API 연동
- [ ] `.env` 에 `EXPO_PUBLIC_API_URL` 설정 (launch-kit 배포 URL)
- [ ] `src/lib/api.ts` 공통 fetch 클라이언트 작성 (토큰 헤더 자동 첨부)
- [ ] 홈 화면 통계 카드 → 실제 API 데이터로 교체

### 앱 아이덴티티
- [ ] `app.json` → `name`, `slug`, `bundleIdentifier` 프로젝트에 맞게 변경
- [ ] `assets/` → 앱 아이콘, 스플래시 이미지 교체
- [ ] `src/constants/colors.ts` → 브랜드 색상 반영

---

## 🟢 배포

### launch-kit
- [ ] [Vercel](https://vercel.com) 연결 → GitHub 레포 import
- [ ] Vercel 환경변수 설정 (DB URL, OAuth 키, NEXTAUTH_SECRET)
- [ ] 프로덕션 OAuth Redirect URI 등록 (각 콘솔에 도메인 추가)
- [ ] PostgreSQL 프로덕션 DB 연결 (Supabase / PlanetScale / Neon 등)

### mobile-kit
- [ ] `npm install -g eas-cli && eas login`
- [ ] `eas build:configure` (eas.json 생성)
- [ ] Android `.aab` 빌드: `eas build --platform android`
- [ ] iOS `.ipa` 빌드: `eas build --platform ios`
- [ ] 앱스토어 제출: `eas submit`
