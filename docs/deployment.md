# 배포 가이드

## launch-kit — Vercel

### 1. GitHub 레포 연결

1. [vercel.com](https://vercel.com) 로그인
2. "Add New Project" → GitHub 레포 `kit` 선택
3. Root Directory: `launch-kit` 설정 (모노레포이므로 필수)

### 2. 환경변수 설정

Vercel 프로젝트 Settings → Environment Variables에 추가:

```
DATABASE_URL          postgresql://...
NEXTAUTH_SECRET       (openssl rand -base64 32 결과)
NEXTAUTH_URL          https://your-domain.vercel.app

KAKAO_CLIENT_ID
KAKAO_CLIENT_SECRET
NAVER_CLIENT_ID
NAVER_CLIENT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

TOSS_SECRET_KEY       (토스페이먼츠 시크릿 키)
```

### 3. 프로덕션 OAuth Redirect URI 등록

각 OAuth 콘솔에 프로덕션 도메인 추가:
- `https://your-domain.vercel.app/api/auth/callback/kakao`
- `https://your-domain.vercel.app/api/auth/callback/naver`
- `https://your-domain.vercel.app/api/auth/callback/google`

### 4. 프로덕션 DB 연결

권장 PostgreSQL 서비스:

| 서비스 | 특징 | 무료 플랜 |
|--------|------|-----------|
| [Supabase](https://supabase.com) | 오픈소스, 관리 UI 제공 | 500MB |
| [Neon](https://neon.tech) | 서버리스, Vercel 통합 | 0.5GB |
| [PlanetScale](https://planetscale.com) | MySQL 기반, 브랜치 지원 | 5GB |

DB 연결 후 마이그레이션:
```bash
DATABASE_URL="프로덕션 DB URL" npx prisma migrate deploy
```

---

## mobile-kit — EAS Build

### 1. EAS CLI 설치 및 로그인

```bash
npm install -g eas-cli
eas login
```

### 2. 빌드 설정 초기화

```bash
cd mobile-kit
eas build:configure   # eas.json 생성
```

### 3. 프로덕션 환경변수 설정

`mobile-kit/.env.production`:
```env
EXPO_PUBLIC_API_URL=https://your-domain.vercel.app
EXPO_PUBLIC_KAKAO_CLIENT_ID=...
EXPO_PUBLIC_NAVER_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_CLIENT_ID=...
```

### 4. 빌드

```bash
# Android (.aab)
eas build --platform android

# iOS (.ipa) — Apple Developer 계정 필요
eas build --platform ios

# 동시 빌드
eas build --platform all
```

### 5. 앱스토어 제출

```bash
# Google Play Store
eas submit --platform android

# Apple App Store
eas submit --platform ios
```

---

## 배포 전 체크리스트

### launch-kit
- [ ] `NEXTAUTH_SECRET` 프로덕션 값으로 변경
- [ ] `NEXTAUTH_URL` 실제 도메인으로 설정
- [ ] 프로덕션 DB 마이그레이션 완료
- [ ] OAuth Redirect URI 프로덕션 도메인 등록
- [ ] 토스페이먼츠 프로덕션 키로 변경

### mobile-kit
- [ ] `app.json` → `name`, `slug`, `bundleIdentifier` 확인
- [ ] `EXPO_PUBLIC_API_URL` 프로덕션 URL로 변경
- [ ] 앱 아이콘 및 스플래시 이미지 교체
- [ ] iOS: Apple Developer 계정 + 프로비저닝 프로파일
- [ ] Android: 키스토어 생성 및 서명 설정
