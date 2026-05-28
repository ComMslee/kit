# API 라우트 레퍼런스

Base URL: `http://localhost:3000/api` (개발) / `https://your-domain.com/api` (프로덕션)

---

## 인증 — `/api/auth`

NextAuth v5가 자동으로 처리합니다.

| 엔드포인트 | 설명 |
|-----------|------|
| `GET /api/auth/signin` | 로그인 페이지 리다이렉트 |
| `GET /api/auth/callback/{provider}` | OAuth 콜백 처리 |
| `GET /api/auth/signout` | 로그아웃 |
| `GET /api/auth/session` | 현재 세션 조회 |

---

## 사용자 — `/api/users`

### `GET /api/users`

사용자 목록 조회 (관리자 전용)

**Response**
```json
{
  "users": [
    {
      "id": "cuid...",
      "name": "홍길동",
      "email": "user@example.com",
      "role": "USER",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

### `GET /api/users/me`

현재 로그인 사용자 정보

**Response**
```json
{
  "id": "cuid...",
  "name": "홍길동",
  "email": "user@example.com",
  "image": "https://...",
  "role": "USER"
}
```

---

## 결제 — `/api/payments`

### `POST /api/payments/confirm`

토스페이먼츠 결제 서버 검증

**Request Body**
```json
{
  "paymentKey": "토스페이먼츠 paymentKey",
  "orderId": "주문 ID",
  "amount": 10000
}
```

**Response (성공)**
```json
{
  "success": true,
  "payment": {
    "orderId": "order_xxx",
    "amount": 10000,
    "status": "DONE"
  }
}
```

**Response (실패)**
```json
{
  "success": false,
  "message": "결제 금액 불일치"
}
```

---

## 모바일에서 API 호출

`mobile-kit/src/lib/api.ts` (작성 예정):

```typescript
const BASE_URL = process.env.EXPO_PUBLIC_API_URL

export async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,  // JWT 연동 후 추가
      ...options?.headers,
    },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
```

---

## 에러 코드

| 코드 | 의미 |
|------|------|
| `401` | 인증 필요 (세션 없음) |
| `403` | 권한 없음 (ADMIN 전용 리소스) |
| `404` | 리소스 없음 |
| `422` | 입력값 검증 실패 |
| `500` | 서버 내부 오류 |
