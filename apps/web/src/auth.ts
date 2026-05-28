import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import { authConfig } from "./auth.config"
import type { Provider } from "@kit/types"

const API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:4000"

async function fetchApiToken(user: {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}, provider: Provider): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const res = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        email: user.email ?? "",
        name: user.name ?? "",
        image: user.image ?? undefined,
      }),
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.success ? json.data : null
  } catch {
    return null
  }
}

// 실제 OAuth 연동 전 사용하는 Mock 유저 (모바일과 동일)
const MOCK_USERS: Record<string, { id: string; name: string; email: string; image: null }> = {
  kakao:  { id: "kakao_001",  name: "카카오 사용자", email: "user@kakao.com",  image: null },
  naver:  { id: "naver_001",  name: "네이버 사용자", email: "user@naver.com",  image: null },
  google: { id: "google_001", name: "Google 사용자", email: "user@gmail.com",  image: null },
}

/**
 * Node.js 전용 전체 인증 설정 (PrismaAdapter 포함)
 * API Routes, Server Components 에서 사용
 * middleware.ts 에서는 직접 import 금지 (Edge Runtime 비호환)
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "mock",
      name: "Mock",
      credentials: { provider: { label: "Provider" } },
      authorize(credentials) {
        const provider = credentials?.provider as string
        return MOCK_USERS[provider] ?? null
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // Edge middleware에서 DB 없이 JWT 검증 가능
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        const provider = (account?.provider ?? "google") as Provider
        const tokens = await fetchApiToken(user, provider)
        if (tokens) {
          token.accessToken = tokens.accessToken
          token.refreshToken = tokens.refreshToken
        }
      }
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      if (token.accessToken) session.accessToken = token.accessToken
      return session
    },
  },
})
