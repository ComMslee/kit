import { SignJWT, jwtVerify } from 'jose'
import type { TokenPayload, TokenPair } from '@kit/types'

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-in-production'
)
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-change-in-production'
)

export async function signTokens(
  payload: Omit<TokenPayload, 'iat' | 'exp'>
): Promise<TokenPair> {
  const accessToken = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(ACCESS_SECRET)

  const refreshToken = await new SignJWT({ sub: payload.sub })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(REFRESH_SECRET)

  return { accessToken, refreshToken, expiresIn: 15 * 60 }
}

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, ACCESS_SECRET)
  return payload as unknown as TokenPayload
}

export async function verifyRefreshToken(token: string): Promise<{ sub: string }> {
  const { payload } = await jwtVerify(token, REFRESH_SECRET)
  return { sub: payload.sub as string }
}
