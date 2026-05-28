import type { NextAuthConfig } from "next-auth"
import Kakao from "next-auth/providers/kakao"
import Naver from "next-auth/providers/naver"
import Google from "next-auth/providers/google"

/**
 * Edge Runtime 호환 인증 설정 (Prisma 미포함)
 * middleware.ts 에서 사용 — DB 접근 없이 JWT만 검증
 */
export const authConfig: NextAuthConfig = {
  providers: [
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request
      const isLoggedIn = !!auth?.user
      const isGuest = request.cookies.get("guest_mode")?.value === "1"
      const PUBLIC_ROUTES = ["/", "/login"]
      const isPublic = PUBLIC_ROUTES.some(
        (r) => nextUrl.pathname === r || nextUrl.pathname.startsWith(r + "/")
      )

      if (!isLoggedIn && !isGuest && !isPublic) {
        // 비로그인·비게스트 → 로그인 페이지로 (callbackUrl 포함)
        return false
      }
      if (isLoggedIn && nextUrl.pathname === "/login") {
        // 이미 로그인 → 대시보드로
        return Response.redirect(new URL("/dashboard", nextUrl))
      }
      return true
    },
  },
}
