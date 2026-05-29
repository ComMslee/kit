# 배포 가이드

Kit은 세 개의 앱을 독립적으로 배포합니다.

| 앱 | 플랫폼 | 비고 |
|----|--------|------|
| `apps/web` | Vercel | GitHub 자동 배포 |
| `apps/api` | Render / Railway / EC2 | Node.js 서버 |
| `apps/mobile` | EAS Build → App Store / Play Store | Expo 관리형 빌드 |

---

## apps/web — Vercel

### 1. 프로젝트 연결

1. [vercel.com](https://vercel.com) → Add New Project → GitHub 레포 `kit` 선택
2. **Root Directory**: `apps/web` (모노레포이므로 필수)
3. Framework Preset: Next.js (자동 감지)

### 2. 환경변수

Vercel 프로젝트 Settings → Environment Variables:

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=                    # openssl rand -base64 32
AUTH_URL=https://your-domain.vercel.app

KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

API_URL=https://api.your-domain.com   # Hono API 서버 URL
```

### 3. 프로덕션 OAuth Redirect URI 등록

각 OAuth 콘솔에 프로덕션 도메인 추가:
- `https://your-domain.vercel.app/api/auth/callback/kakao`
- `https://your-domain.vercel.app/api/auth/callback/naver`
- `https://your-domain.vercel.app/api/auth/callback/google`

### 4. DB 마이그레이션

```bash
DATABASE_URL="프로덕션 DB URL" npx prisma migrate deploy
```

---

## apps/api — Render (권장)

### 1. 서비스 생성

1. [render.com](https://render.com) → New Web Service → GitHub 레포 `kit`
2. Root Directory: `apps/api`
3. Build Command: `npm install && npm run build`
4. Start Command: `node dist/index.js`

### 2. 환경변수

```env
PORT=4000
DATABASE_URL=postgresql://...

JWT_ACCESS_SECRET=              # openssl rand -base64 32
JWT_REFRESH_SECRET=             # openssl rand -base64 32

WEB_URL=https://your-domain.vercel.app
```

### Railway 대안

```bash
# Railway CLI
railway login
railway init
railway up
```

### 3. 프로덕션 체크리스트

- [ ] `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` 랜덤 값으로 설정
- [ ] `WEB_URL` 실제 도메인으로 설정 (CORS)
- [ ] `DATABASE_URL` 프로덕션 DB 연결
- [ ] 토큰 블랙리스트를 in-memory Set → Redis로 교체

---

## apps/mobile — EAS Build

### 1. 사전 준비

```bash
npm install -g eas-cli
eas login
```

### 2. 프로젝트 식별자 변경 (`app.json`)

```json
{
  "expo": {
    "name": "내 앱 이름",
    "slug": "my-app-slug",
    "ios": { "bundleIdentifier": "com.company.myapp" },
    "android": { "package": "com.company.myapp" }
  }
}
```

### 3. 빌드 설정

```bash
cd apps/mobile
eas build:configure   # eas.json 생성
```

### 4. 프로덕션 환경변수 (`apps/mobile/.env.production`)

```env
EXPO_PUBLIC_API_URL=https://api.your-domain.com

EXPO_PUBLIC_KAKAO_CLIENT_ID=
EXPO_PUBLIC_NAVER_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
```

### 5. 빌드 및 제출

```bash
# 빌드
eas build --platform android
eas build --platform ios
eas build --platform all      # 동시 빌드

# 스토어 제출
eas submit --platform android
eas submit --platform ios
```

---

## 프로덕션 DB

권장 PostgreSQL 서비스:

| 서비스 | 특징 | 무료 플랜 |
|--------|------|-----------|
| [Supabase](https://supabase.com) | 오픈소스, 관리 UI | 500MB |
| [Neon](https://neon.tech) | 서버리스, Vercel 통합 | 0.5GB |
| [Railway](https://railway.app) | 단순 설정 | 500MB |

---

## 배포 전 체크리스트

### apps/web
- [ ] `AUTH_SECRET` 프로덕션 값으로 변경
- [ ] `AUTH_URL` 실제 도메인으로 설정
- [ ] `API_URL` Hono API 서버 URL 설정
- [ ] 프로덕션 DB 마이그레이션 완료
- [ ] OAuth Redirect URI 프로덕션 도메인 등록

### apps/api
- [ ] `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` 강력한 랜덤값
- [ ] `WEB_URL` CORS 허용 도메인 설정
- [ ] 토큰 블랙리스트 Redis 교체
- [ ] `services/payment.ts` 실 결제 연동

### apps/mobile
- [ ] `app.json` → `name`, `slug`, `bundleIdentifier` 변경
- [ ] `EXPO_PUBLIC_API_URL` 프로덕션 API URL
- [ ] 앱 아이콘 및 스플래시 이미지 교체
- [ ] iOS: Apple Developer 계정 + 프로비저닝 프로파일
- [ ] Android: 키스토어 생성 및 서명 설정
- [ ] `react-native-app-auth` 실 OAuth 연동
