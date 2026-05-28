# 인증 흐름 (Auth)

## 웹 — NextAuth v5 OAuth 흐름

```
사용자 → [로그인 버튼 클릭]
         │
         ▼
[NextAuth signIn('kakao' | 'naver' | 'google')]
         │
         ▼
[OAuth Provider 인가 서버] ──인가코드──▶ /api/auth/callback/{provider}
         │
         ▼
[NextAuth 콜백] → 액세스토큰 발급 → 사용자 정보 조회
         │
         ▼
[PrismaAdapter] → User + Account DB 저장 (없으면 생성)
         │
         ▼
[세션 발급] → 쿠키 저장 → 대시보드 리다이렉트
```

### NextAuth 설정 위치

```
launch-kit/src/lib/auth/auth.ts     # providers, adapter, callbacks
launch-kit/src/app/api/auth/[...nextauth]/route.ts
```

### 필요 환경변수

```env
NEXTAUTH_SECRET=...          # openssl rand -base64 32

KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
# Redirect URI: http://localhost:3000/api/auth/callback/kakao

NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
# Redirect URI: http://localhost:3000/api/auth/callback/naver

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
# Redirect URI: http://localhost:3000/api/auth/callback/google
```

### 세션 사용 (Server Component)

```tsx
import { auth } from '@/lib/auth/auth'

export default async function Page() {
  const session = await auth()
  if (!session) redirect('/login')
  return <div>{session.user.name}</div>
}
```

---

## 모바일 — AuthContext (AsyncStorage)

현재 구현: mock 딜레이 1초 → 실 기기에서는 `react-native-app-auth`로 교체 예정.

```
[로그인 버튼 클릭]
       │
       ▼
[handleLogin(provider)] → 로딩 스피너 표시
       │
       ▼ (실제: react-native-app-auth → OAuth 플로우)
[로그인 성공] → AuthContext.login(user)
       │
       ▼
[AsyncStorage.setItem('@kit_user', JSON.stringify(user))]
       │
       ▼
[AppNavigator] → user !== null 감지 → Main 탭 자동 전환
```

### AuthContext 사용

```tsx
import { useAuth } from '@/contexts/AuthContext'

function ProfileScreen() {
  const { user, logout } = useAuth()
  return <Text>{user?.name}</Text>
}
```

### 실제 OAuth 연동 (추후)

```bash
npm install react-native-app-auth
```

```tsx
import { authorize } from 'react-native-app-auth'

const handleKakaoLogin = async () => {
  const result = await authorize({
    issuer: 'https://kauth.kakao.com',
    clientId: process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID!,
    redirectUrl: 'com.yourapp://oauth',
    scopes: ['profile_nickname', 'account_email'],
  })
  // result.accessToken → launch-kit API로 전송 → 서버 검증 → JWT 발급
}
```

---

## OAuth 콘솔 설정 체크리스트

### 카카오 디벨로퍼스 (https://developers.kakao.com)
- [ ] 앱 생성 → REST API 키 발급
- [ ] 카카오 로그인 활성화
- [ ] Redirect URI 등록: `http://localhost:3000/api/auth/callback/kakao`
- [ ] 동의항목: 닉네임, 카카오계정(이메일)

### 네이버 디벨로퍼스 (https://developers.naver.com)
- [ ] 앱 등록 → Client ID/Secret 발급
- [ ] 서비스 URL: `http://localhost:3000`
- [ ] Callback URL: `http://localhost:3000/api/auth/callback/naver`

### Google Cloud Console (https://console.cloud.google.com)
- [ ] 새 프로젝트 → OAuth 2.0 클라이언트 ID 생성
- [ ] 승인된 리디렉션 URI: `http://localhost:3000/api/auth/callback/google`
