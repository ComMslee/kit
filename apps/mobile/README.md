# 📱 Mobile Kit

> React Native + Expo 기반 외주 앱 보일러플레이트  
> [`launch-kit`](../launch-kit) (웹)과 함께 사용하는 모바일 버전입니다.

---

## ⚡ 빠른 시작 (스크립트)

```bash
bash scripts/setup.sh
```

스크립트가 의존성 설치 → 환경변수 생성 → Expo 서버 실행까지 한 번에 안내합니다.

---

## 기술 스택

| 항목 | 버전 | 설명 |
|------|------|------|
| React Native | 0.79.x | 크로스플랫폼 앱 프레임워크 |
| Expo SDK | 53.x | 개발 도구 및 네이티브 API |
| TypeScript | 5.x | 타입 안전성 |
| React Navigation | 7.x | 화면 전환 (Stack + BottomTab) |

---

## 프로젝트 구조

```
mobile-kit/
├── App.tsx                    # 앱 진입점
├── src/
│   ├── constants/
│   │   └── colors.ts          # 색상 상수 (카카오/네이버/구글 등)
│   ├── navigation/
│   │   └── index.tsx          # Stack + BottomTab 네비게이터
│   └── screens/
│       ├── LoginScreen.tsx    # 소셜 로그인 화면
│       ├── HomeScreen.tsx     # 홈 (통계 카드, 빠른 메뉴)
│       └── ProfileScreen.tsx  # 프로필 & 설정
└── assets/                    # 아이콘, 스플래시 이미지
```

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 폰에서 바로 테스트 (Expo Go)

**① 앱 설치**
- iOS: App Store → "Expo Go" 검색 후 설치
- Android: Play Store → "Expo Go" 검색 후 설치

**② 개발 서버 시작**

```bash
npx expo start
```

**③ QR 코드 스캔**
- iOS: 기본 카메라 앱으로 QR 코드 스캔
- Android: Expo Go 앱 내에서 QR 코드 스캔

### 3. 시뮬레이터 실행

```bash
# iOS 시뮬레이터 (맥 + Xcode 필요)
npx expo start --ios

# Android 에뮬레이터 (Android Studio 필요)
npx expo start --android
```

---

## 화면 구성

### 로그인 화면
- 카카오 로그인 (노란색 `#FEE500`)
- 네이버 로그인 (초록색 `#03C75A`)
- 구글 로그인 (흰색, 테두리)

### 메인 탭 (로그인 후)
| 탭 | 설명 |
|----|------|
| 🏠 홈 | 통계 카드 4개 + 빠른 메뉴 |
| 👤 프로필 | 유저 정보 + 설정 + 로그아웃 |

---

## 실제 OAuth 연동 방법

현재 버튼은 `Alert`으로 대체됨. 실제 연동 시 아래 패키지 사용:

```bash
npm install react-native-app-auth
```

```typescript
// src/screens/LoginScreen.tsx 수정
import { authorize } from 'react-native-app-auth'

const handleKakaoLogin = async () => {
  const config = {
    issuer: 'https://kauth.kakao.com',
    clientId: process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID!,
    redirectUrl: 'com.yourapp://oauth',
    scopes: ['profile_nickname', 'account_email'],
  }
  const result = await authorize(config)
  // result.accessToken 사용
}
```

---

## 환경변수

`.env` 파일 생성:

```env
EXPO_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
EXPO_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
EXPO_PUBLIC_API_URL=https://your-api.com
```

> **주의:** `EXPO_PUBLIC_` 접두어가 있어야 클라이언트에서 접근 가능

---

## 웹(launch-kit)과 연동

```
[모바일 앱]  ←→  [Next.js API]  ←→  [PostgreSQL]
mobile-kit       launch-kit/api       (공유 DB)
```

1. `launch-kit`의 Next.js API Routes를 백엔드로 사용
2. 토큰 기반 인증 (JWT) 또는 NextAuth의 세션 공유
3. `EXPO_PUBLIC_API_URL`을 launch-kit 배포 URL로 설정

---

## 앱 빌드 & 배포

```bash
# EAS Build 설치
npm install -g eas-cli
eas login

# 빌드 설정 초기화
eas build:configure

# Android (.aab) 빌드
eas build --platform android

# iOS (.ipa) 빌드
eas build --platform ios

# 앱스토어 제출
eas submit
```

> Expo Application Services(EAS)를 사용하면 맥 없이도 iOS 빌드 가능

---

## 커스터마이징 체크리스트

새 프로젝트 시작 시:

- [ ] `app.json` → `name`, `slug`, `bundleIdentifier` 변경
- [ ] `assets/` → 앱 아이콘, 스플래시 이미지 교체
- [ ] `src/constants/colors.ts` → 브랜드 색상 변경
- [ ] `.env` → 실제 OAuth 키 입력
- [ ] `src/navigation/index.tsx` → `isLoggedIn` 실제 인증 상태로 교체
- [ ] `EXPO_PUBLIC_API_URL` → 실제 API URL 연결

---

## 관련 프로젝트

- **[launch-kit](../launch-kit)** — 웹 대시보드 (Next.js + NextAuth + Prisma)
