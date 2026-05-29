# API 레퍼런스 — Hono API 서버

Base URL: `http://localhost:4000` (개발) / `https://api.your-domain.com` (프로덕션)

모든 응답은 아래 형태를 따릅니다.

```ts
// 성공
{ "success": true, "data": T }

// 실패
{ "success": false, "error": "메시지" }
```

---

## 헬스 체크

### `GET /health`

인증 불필요. 서버 상태 확인용.

**Response**
```json
{ "ok": true }
```

---

## 인증 — `/auth`

### `POST /auth/token`

OAuth 완료 후 사용자 정보를 전달하면 JWT를 발급합니다.  
Web의 NextAuth 콜백 또는 Mobile의 OAuth 완료 시점에 호출합니다.

**Request Body**
```json
{
  "provider": "kakao" | "naver" | "google",
  "email": "user@example.com",
  "name": "홍길동",
  "image": "https://..." // optional
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

**동작**: DB에 User upsert (없으면 생성, 있으면 name·image 업데이트) → JWT 서명

---

### `POST /auth/refresh`

만료된 access token을 refresh token으로 갱신합니다.

**Request Body**
```json
{ "refreshToken": "eyJ..." }
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

**에러**: `401` refresh token 만료 또는 유저 미존재

---

### `DELETE /auth/logout`

현재 access token을 즉시 무효화합니다.

**Header**: `Authorization: Bearer <accessToken>`

**Response**
```json
{ "success": true, "message": "Logged out" }
```

---

## 사용자 — `/users`

> 모든 엔드포인트에 `Authorization: Bearer <accessToken>` 필요

### `GET /users/me`

인증된 사용자의 프로필을 반환합니다.

**Response**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxx",
    "name": "홍길동",
    "email": "user@example.com",
    "image": "https://...",
    "role": "USER",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**에러**: `404` DB에 유저 미존재

---

## 통계 — `/stats`

> `Authorization: Bearer <accessToken>` 필요

### `GET /stats`

대시보드 통계를 반환합니다. 도메인 모델 추가 시 실제 값으로 교체합니다.

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

> `monthlyRevenue`, `pendingItems`는 현재 `0` 고정 — 결제·도메인 모델 연동 후 구현

---

## 결제 — `/payments`

> 모든 엔드포인트에 `Authorization: Bearer <accessToken>` 필요

### `POST /payments/confirm`

결제를 서버에서 검증하고 주문을 생성합니다.

**Request Body**
```json
{
  "orderId": "order_20260101_abc",
  "amount": 10000,
  "paymentKey": "토스페이먼츠_paymentKey",
  "provider": "toss" // optional, 기본값 "toss"
}
```

**Response (성공)**
```json
{
  "success": true,
  "data": {
    "id": "order_20260101_abc",
    "userId": "clxxxxx",
    "amount": 10000,
    "currency": "KRW",
    "status": "PAID",
    "provider": "toss",
    "providerTxId": "mock_1748567890",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**에러**: `400` 필수 필드 누락 / `402` 결제 승인 실패

> 현재 `services/payment.ts`는 mock 구현 (항상 성공)  
> 실 연동 시 `services/payment.ts`만 교체: 토스페이먼츠 `POST /v1/payments/confirm`

---

### `GET /payments/orders`

인증된 사용자의 주문 목록을 최신순으로 반환합니다.

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "order_20260101_abc",
      "amount": 10000,
      "status": "PAID",
      "provider": "toss",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

**OrderStatus 값**: `PENDING` | `PAID` | `FAILED` | `CANCELLED` | `REFUNDED`

---

## 디바이스 — `/devices`

> 모든 엔드포인트에 `Authorization: Bearer <accessToken>` 필요  
> 푸시 알림(FCM/APNs)을 위한 디바이스 토큰 관리

### `POST /devices`

디바이스 토큰을 등록합니다. 동일 token이면 upsert(소유자·플랫폼 갱신).

**Request Body**
```json
{
  "token": "FCM_또는_APNs_토큰",
  "platform": "IOS" | "ANDROID" | "WEB",
  "name": "홍길동의 iPhone" // optional
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "clxxxxx",
    "userId": "clxxxxx",
    "token": "FCM_...",
    "platform": "IOS",
    "name": "홍길동의 iPhone",
    "active": true
  }
}
```

**에러**: `400` token 또는 platform 누락

---

### `GET /devices`

인증된 사용자의 활성 디바이스 목록을 반환합니다.

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxxxx",
      "token": "FCM_...",
      "platform": "IOS",
      "name": "홍길동의 iPhone",
      "active": true,
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `DELETE /devices/:id`

디바이스를 비활성화합니다. 로그아웃 또는 앱 제거 시 호출합니다.

**Response**
```json
{ "success": true }
```

**에러**: `404` 본인 소유 디바이스가 아니거나 미존재

---

## 로그 — `/logs`

> 인증 불필요 — 비로그인 상태(앱 크래시, 로그인 전 에러)도 전송 가능

### `POST /logs`

클라이언트 로그 단건을 수신합니다.

**Request Body**
```json
{
  "level": "DEBUG" | "INFO" | "WARN" | "ERROR",
  "message": "에러 메시지",
  "context": { "screen": "HomeScreen", "action": "fetchData" }, // optional
  "platform": "ios", // optional
  "appVersion": "1.0.0", // optional
  "userId": "clxxxxx" // optional
}
```

**Response**
```json
{ "success": true }
```

**에러**: `400` level 누락 또는 잘못된 값 / message 누락

---

### `POST /logs/batch`

오프라인 복귀 시 쌓인 로그를 한 번에 전송합니다.

**Request Body**
```json
{
  "logs": [
    { "level": "ERROR", "message": "fetch failed", "platform": "android" },
    { "level": "INFO", "message": "app resumed" }
  ]
}
```

**Response**
```json
{ "success": true, "data": { "count": 2 } }
```

**에러**: `400` logs 배열 누락 또는 빈 배열

---

## 검색 — `/search`

> `Authorization: Bearer <accessToken>` 필요

### `GET /search?q={query}`

전체 검색. 현재는 유저 이름·이메일 LIKE 검색.

**Query Parameter**: `q` — 검색어 (빈 문자열이면 빈 배열 반환)

**Response**
```json
{
  "success": true,
  "data": [
    {
      "type": "user",
      "id": "clxxxxx",
      "label": "홍길동",
      "sub": "user@example.com"
    }
  ]
}
```

> `services/search.ts`만 교체하면 Algolia / Elasticsearch / Typesense 전환 가능  
> 도메인 모델 추가 시 `data` 배열에 다른 타입 결과 병합

---

## 공통 에러 코드

| 코드 | 의미 |
|------|------|
| `400` | 입력값 오류 (필수 필드 누락, 잘못된 형식) |
| `401` | 인증 실패 (토큰 없음·만료·취소됨) |
| `402` | 결제 실패 |
| `403` | 권한 없음 |
| `404` | 리소스 없음 |
| `500` | 서버 내부 오류 |

---

## 환경변수 (`apps/api/.env`)

```env
PORT=4000
DATABASE_URL=postgresql://user:pass@localhost:5432/kit

JWT_ACCESS_SECRET=your-access-secret-32chars
JWT_REFRESH_SECRET=your-refresh-secret-32chars

WEB_URL=http://localhost:3000
```
