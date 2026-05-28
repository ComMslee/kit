import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

/**
 * Edge Runtime 호환 미들웨어
 * auth.config.ts (Prisma 미포함) 를 사용하여 JWT 쿠키만 검증
 */
export const { auth: middleware } = NextAuth(authConfig)

export default middleware

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
