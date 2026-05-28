# 🚀 launch-kit

> 외주 의뢰가 들어오면 바로 시작할 수 있는 Next.js 보일러플레이트

## 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| ORM | Prisma + PostgreSQL |
| Auth | NextAuth v5 (카카오/네이버/Google) |
| 결제 | 토스페이먼츠 |

---

## ⚡ 빠른 시작 (스크립트)

```bash
bash scripts/setup.sh
```

스크립트가 의존성 설치 → 환경변수 설정 → DB 마이그레이션 → 서버 실행까지 한 번에 안내합니다.

---

## 수동 시작

```bash
# 1. 환경변수 설정
cp .env.example .env
# .env 파일 열어서 값 채우기

# 2. 의존성 설치
npm install

# 3. DB 마이그레이션
npx prisma generate
npx prisma migrate dev --name init

# 4. 개발 서버 실행
npm run dev        # http://localhost:3000
```

---

## 아키텍처

```
┌─────────────────────────────────────────────┐
│              Next.js App Router              │
│                                              │
│  ┌─────────────────┐  ┌──────────────────┐  │
│  │ Server Component │  │ Client Component │  │
│  │ - DB 직접 쿼리  │  │ - useState       │  │
│  │ - auth() 세션   │  │ - 폼 처리        │  │
│  │ - SEO 메타      │  │ - 인터랙션       │  │
│  └────────┬────────┘  └──────────────────┘  │
│           │                                  │
│  ┌────────▼─────────────────────────────┐   │
│  │  API Routes (src/app/api/)           │   │
│  │  /auth  /users  /payments            │   │
│  └────────┬─────────────────────────────┘   │
└───────────┼─────────────────────────────────┘
            │ Prisma ORM
┌───────────▼─────────────┐
│  PostgreSQL              │
│  User · Account · Session│
└─────────────────────────┘
```

> 전체 아키텍처 → [../docs/architecture.md](../docs/architecture.md)

---

## 폴더 구조

```
src/
├── app/
│   ├── (auth)/          # 로그인 전 레이아웃
│   │   └── login/
│   ├── (dashboard)/     # 로그인 후 레이아웃
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── settings/
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── users/
│       └── payments/confirm/
├── components/
│   ├── ui/              # Button, Input, Badge
│   ├── layout/          # Header, Sidebar, Footer
│   └── common/          # 공통 복합 컴포넌트
├── lib/
│   ├── auth/auth.ts     # NextAuth 설정
│   ├── db/prisma.ts     # Prisma 클라이언트
│   └── utils/           # formatDate, cn
└── types/index.ts
```

---

## 환경변수

`.env.example` 참고 — `cp .env.example .env` 후 값 입력:

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `KAKAO_CLIENT_ID/SECRET` | 카카오 디벨로퍼스 |
| `NAVER_CLIENT_ID/SECRET` | 네이버 디벨로퍼스 |
| `GOOGLE_CLIENT_ID/SECRET` | Google Cloud Console |

> OAuth 콘솔 설정 상세 → [../docs/auth.md](../docs/auth.md)

---

## 외주 프로젝트 체크리스트

새 프로젝트 시작 시:
- [ ] `.env.example` → `.env` 복사 후 값 채우기
- [ ] `prisma/schema.prisma` 에 도메인 모델 추가
- [ ] `src/types/index.ts` 에 도메인 타입 추가
- [ ] 필요한 OAuth 프로바이더만 활성화
- [ ] 결제 필요 시 토스페이먼츠 키 설정
