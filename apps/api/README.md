# @kit/api — Hono REST API 서버

JWT 기반 인증과 공유 데이터 접근을 담당하는 API 서버입니다.  
웹(`apps/web`)과 모바일(`apps/mobile`)이 공통으로 사용합니다.

## 엔드포인트

### 인증 (`/auth`)

| 메서드 | 경로 | 인증 필요 | 설명 |
|--------|------|----------|------|
| POST | `/auth/token` | - | OAuth 사용자 정보 → JWT 발급 |
| POST | `/auth/refresh` | - | Refresh token → 새 Access token |
| DELETE | `/auth/logout` | Bearer | Access token 무효화 |

#### `POST /auth/token`

OAuth 완료 후 사용자 정보를 전달하면 JWT를 반환합니다. 존재하지 않는 유저는 자동 생성(upsert)합니다.

**Request**
```json
{
  "provider": "kakao",
  "email": "user@example.com",
  "name": "홍길동",
  "image": "https://..."
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 900
  }
}
```

#### `POST /auth/refresh`

**Request**
```json
{ "refreshToken": "eyJ..." }
```

**Response** — `POST /auth/token` 응답과 동일

#### `DELETE /auth/logout`

**Headers**: `Authorization: Bearer <accessToken>`

**Response**
```json
{ "success": true, "message": "Logged out" }
```

---

### 사용자 (`/users`) — 인증 필요

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/users/me` | 로그인 사용자 프로필 반환 |

**Response**
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "name": "홍길동",
    "email": "user@example.com",
    "image": "https://...",
    "role": "USER",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 통계 (`/stats`) — 인증 필요

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/stats` | 대시보드 통계 |

**Response**
```json
{
  "success": true,
  "data": {
    "totalUsers": 42,
    "todayVisitors": 7,
    "monthlyRevenue": 0,
    "pendingItems": 0
  }
}
```

> `monthlyRevenue`, `pendingItems` 는 도메인 모델 추가 후 실제 값으로 교체하세요.

---

### 헬스체크

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/health` | 서버 상태 확인 |

**Response**: `{ "ok": true }`

---

## 인증 방식

모든 보호 라우트는 `Authorization: Bearer <accessToken>` 헤더가 필요합니다.

- **Access token**: HS256, 유효기간 15분
- **Refresh token**: HS256, 유효기간 7일
- **로그아웃**: 메모리 Set으로 무효화 (프로덕션에서는 Redis 교체 권장)

## 환경 변수

`.env.example` 참고. 필수 항목:

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `JWT_ACCESS_SECRET` | Access token 서명 키 (`openssl rand -base64 32`) |
| `JWT_REFRESH_SECRET` | Refresh token 서명 키 (`openssl rand -base64 32`) |
| `PORT` | 서버 포트 (기본 4000) |
| `WEB_URL` | CORS 허용 웹 오리진 |

## 실행

```bash
# 개발 (hot reload)
npm run dev

# 빌드
npm run build

# 프로덕션
npm run start
```

Docker로 실행 시 루트의 `docker-compose.yml` 사용.
