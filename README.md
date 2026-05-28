# 🧰 Kit — 외주 보일러플레이트 모음

빠르게 외주 프로젝트를 시작하기 위한 보일러플레이트 모노레포입니다.

## 구성

| 폴더 | 기술 스택 | 설명 |
|------|-----------|------|
| [`launch-kit/`](./launch-kit) | Next.js 15 · Tailwind · Prisma · NextAuth | 웹 서비스 (대시보드 + API) |
| [`mobile-kit/`](./mobile-kit) | React Native · Expo SDK 54 · React Navigation | iOS/Android 앱 |

## 아키텍처

```
┌──────────────────────┐     ┌──────────────────────┐
│  🌐 Web Browser      │     │  📱 iOS / Android    │
│  launch-kit          │     │  mobile-kit           │
└──────────┬───────────┘     └──────────┬────────────┘
           │  HTTP/HTTPS                │  EXPO_PUBLIC_API_URL
           └──────────────┬─────────────┘
                          │
           ┌──────────────▼──────────────┐
           │  Next.js API Routes         │
           │  launch-kit/src/app/api/    │
           └──────────────┬──────────────┘
                          │  Prisma ORM
           ┌──────────────▼──────────────┐
           │  PostgreSQL                 │
           └─────────────────────────────┘
```

> 자세한 아키텍처 → [docs/architecture.md](./docs/architecture.md)

## ⚡ 빠른 시작

루트에서 한 번에 설정:

```bash
bash setup.sh
```

대화형으로 웹 / 앱 / 둘 다 선택해서 설정할 수 있습니다.

### 개별 실행

```bash
# 웹 (launch-kit)
cd launch-kit && bash scripts/setup.sh

# 앱 (mobile-kit)
cd mobile-kit && bash scripts/setup.sh
```

## 문서

| 문서 | 내용 |
|------|------|
| [docs/architecture.md](./docs/architecture.md) | 전체 아키텍처 상세 |
| [docs/auth.md](./docs/auth.md) | 인증 흐름 (OAuth · NextAuth · 모바일) |
| [docs/api.md](./docs/api.md) | API 라우트 레퍼런스 |
| [docs/deployment.md](./docs/deployment.md) | Vercel · EAS 배포 가이드 |
| [TODO.md](./TODO.md) | 진행 예정 작업 목록 |

## 라이선스

MIT
