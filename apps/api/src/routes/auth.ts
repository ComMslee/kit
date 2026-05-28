import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { signTokens, verifyRefreshToken } from '../lib/jwt'
import { revokedTokens } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import type { Provider } from '@kit/types'

const auth = new Hono()

// POST /auth/token — provider OAuth 사용자 정보 → JWT 발급
// 클라이언트(web/mobile)가 OAuth 완료 후 사용자 정보를 전달하면 JWT를 반환
auth.post('/token', async (c) => {
  const body = await c.req.json<{
    provider: Provider
    email: string
    name: string
    image?: string
  }>()

  const { provider, email, name, image } = body

  if (!provider || !email) {
    throw new HTTPException(400, { message: 'provider and email are required' })
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, image },
    create: { email, name, image },
  })

  const tokens = await signTokens({
    sub: user.id,
    email: user.email,
    name: user.name ?? '',
    provider,
  })

  return c.json({ success: true, data: tokens })
})

// POST /auth/refresh — refresh token → 새 access token 발급
auth.post('/refresh', async (c) => {
  const body = await c.req.json<{ refreshToken: string }>()

  let sub: string
  try {
    ;({ sub } = await verifyRefreshToken(body.refreshToken))
  } catch {
    throw new HTTPException(401, { message: 'Invalid refresh token' })
  }

  const user = await prisma.user.findUnique({ where: { id: sub } })
  if (!user) throw new HTTPException(401, { message: 'User not found' })

  const account = await prisma.account.findFirst({ where: { userId: sub } })
  const provider = (account?.provider ?? 'google') as Provider

  const tokens = await signTokens({
    sub: user.id,
    email: user.email,
    name: user.name ?? '',
    provider,
  })

  return c.json({ success: true, data: tokens })
})

// DELETE /auth/logout — access token 무효화
auth.delete('/logout', async (c) => {
  const authorization = c.req.header('Authorization')
  if (authorization?.startsWith('Bearer ')) {
    revokedTokens.add(authorization.slice(7))
  }
  return c.json({ success: true, message: 'Logged out' })
})

export default auth
