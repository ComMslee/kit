import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import { authConfig } from "./auth.config"

/**
 * Node.js 전용 전체 인증 설정 (PrismaAdapter 포함)
 * API Routes, Server Components 에서 사용
 * middleware.ts 에서는 직접 import 금지 (Edge Runtime 비호환)
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // Edge middleware에서 DB 없이 JWT 검증 가능
  },
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
})
