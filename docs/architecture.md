# 아키텍처 상세

## 전체 레이어 구조

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              클라이언트 레이어                              │
│                                                                           │
│   🌐 웹 브라우저 (launch-kit)          📱 iOS / Android (mobile-kit)      │
│   ┌─────────────────────────┐          ┌──────────────────────────┐      │
│   │  Next.js App Router     │          │  React Native + Expo     │      │
│   │                         │          │                          │      │
│   │  ┌───────────────────┐  │          │  ┌────────────────────┐  │      │
│   │  │ Server Components │  │          │  │  Stack Navigator   │  │      │
│   │  │  - DB 직접 쿼리   │  │          │  │  ┌──────────────┐  │  │      │
│   │  │  - 인증 확인      │  │          │  │  │ LoginScreen  │  │  │      │
│   │  │  - SEO 메타데이터 │  │          │  │  │ 카카오/네이버 │  │  │      │
│   │  └───────────────────┘  │          │  │  │ 구글 OAuth   │  │  │      │
│   │  ┌───────────────────┐  │          │  │  └──────────────┘  │  │      │
│   │  │ Client Components │  │          │  │  ┌──────────────┐  │  │      │
│   │  │  - 인터랙션       │  │          │  │  │  BottomTab   │  │  │      │
│   │  │  - useState       │  │          │  │  │  Home│Profile│  │  │      │
│   │  │  - 폼 처리        │  │          │  │  └──────────────┘  │  │      │
│   │  └───────────────────┘  │          │  └────────────────────┘  │      │
│   │  Tailwind CSS           │          │  AuthContext (AsyncStorage)│     │
│   └─────────────────────────┘          └──────────────────────────┘      │
└──────────────────┬──────────────────────────────┬───────────────────────┘
                   │  HTTP/HTTPS                   │  EXPO_PUBLIC_API_URL
                   └─────────────────┬─────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                         백엔드 레이어 (launch-kit)                         │
│                                                                           │
│   Next.js API Routes  ·  src/app/api/                                    │
│   ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────┐   │
│   │  /api/auth      │  │  /api/users     │  │  /api/payments       │   │
│   │  NextAuth v5    │  │  CRUD           │  │  토스페이먼츠          │   │
│   │  세션·JWT 관리  │  │  프로필·설정    │  │  결제 승인·환불       │   │
│   └────────┬────────┘  └────────┬────────┘  └──────────┬───────────┘   │
│            │                    │                        │               │
│   ┌────────▼────────────────────▼──────┐      ┌─────────▼──────────┐   │
│   │          Prisma ORM                │      │   토스페이먼츠 API  │   │
│   │    src/lib/db/prisma.ts            │      │   (외부 서비스)     │   │
│   └────────────────────┬───────────────┘      └────────────────────┘   │
└────────────────────────┼────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────────────┐
│                           데이터 레이어                                    │
│                                                                           │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  PostgreSQL                                                       │  │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │  │
│   │  │  User    │  │ Account  │  │  Session │  │   (도메인 모델) │  │  │
│   │  │ id       │  │ provider │  │ token    │  │   프로젝트별   │  │  │
│   │  │ email    │  │ userId   │  │ expires  │  │   추가 예정    │  │  │
│   │  │ name     │  │ ...      │  │ ...      │  │                │  │  │
│   │  └──────────┘  └──────────┘  └──────────┘  └────────────────┘  │  │
│   └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

## 외부 서비스 연동

```
┌─────────────────────────────────────────────────────────────────────────┐
│   OAuth 인증                           결제                               │
│   ┌─────────────┐                     ┌─────────────────────┐           │
│   │ 🟡 카카오   │  ─── 인가코드 ───▶  │                     │           │
│   │ 🟢 네이버   │                     │  NextAuth v5        │           │
│   │ 🔵 Google   │  ◀── 사용자정보 ─── │  (세션 발급·관리)   │           │
│   └─────────────┘                     └─────────────────────┘           │
│                                                                           │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │  토스페이먼츠                                                    │    │
│   │  클라이언트 SDK (결제창) → /api/payments/confirm → 서버 검증    │    │
│   └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

## launch-kit 폴더 구조

```
launch-kit/src/
├── app/
│   ├── (auth)/              # 로그인 전 — 레이아웃 분리
│   │   └── login/page.tsx
│   ├── (dashboard)/         # 로그인 후 — 사이드바 레이아웃
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── users/route.ts
│       └── payments/
│           └── confirm/route.ts
├── components/
│   ├── ui/                  # Button, Input, Badge 등 원자 컴포넌트
│   ├── layout/              # Header, Sidebar, Footer
│   └── common/              # 공통 복합 컴포넌트
├── lib/
│   ├── auth/auth.ts         # NextAuth 설정 (providers, adapter)
│   ├── db/prisma.ts         # Prisma 클라이언트 싱글턴
│   └── utils/               # formatDate, cn 등 유틸
└── types/index.ts           # 도메인 타입 정의
```

## mobile-kit 폴더 구조

```
mobile-kit/
├── App.tsx                  # 진입점 — AuthProvider 감싸기
└── src/
    ├── contexts/
    │   └── AuthContext.tsx  # AsyncStorage 기반 인증 상태
    ├── navigation/
    │   └── index.tsx        # Stack(Login) ↔ BottomTab(Main) 전환
    ├── screens/
    │   ├── LoginScreen.tsx  # 소셜 로그인 (카카오/네이버/구글)
    │   ├── HomeScreen.tsx   # 통계 카드 + 빠른 메뉴
    │   └── ProfileScreen.tsx# 프로필 + 로그아웃
    └── constants/
        └── colors.ts        # 브랜드 색상 상수
```

## React 서버/클라이언트 컴포넌트 전략

| | Server Component | Client Component |
|---|---|---|
| 선언 | 기본값 | `"use client"` 파일 상단 |
| DB 직접 호출 | ✅ | ❌ |
| useState / useEffect | ❌ | ✅ |
| JS 번들 포함 | 제외 | 포함 |
| 사용 예시 | 페이지, 데이터 조회 | 폼, 버튼, 인터랙션 |

```tsx
// Server Component — DB 조회, 인증 확인
export default async function DashboardPage() {
  const data = await prisma.user.findMany()
  return <UserList data={data} />
}

// Client Component — 인터랙션
"use client"
export default function UserList({ data }) {
  const [filter, setFilter] = useState("")
  // ...
}
```

## 배포 구조

```
launch-kit  →  Vercel         (GitHub 자동 배포, 환경변수 관리)
mobile-kit  →  EAS Build  →  App Store / Play Store
```
