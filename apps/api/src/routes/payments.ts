import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { authMiddleware, type AuthEnv } from '../middleware/auth'
import { prisma } from '../lib/prisma'
import { confirmPayment } from '../services/payment'

const payments = new Hono<AuthEnv>()

payments.use('/*', authMiddleware)

// POST /payments/confirm — 결제 승인
payments.post('/confirm', async (c) => {
  const { sub } = c.get('user')
  const body = await c.req.json<{
    orderId: string
    amount: number
    paymentKey: string
    provider?: string
  }>()

  if (!body.orderId || !body.amount || !body.paymentKey) {
    throw new HTTPException(400, { message: 'orderId, amount, paymentKey are required' })
  }

  const result = await confirmPayment({
    orderId: body.orderId,
    amount: body.amount,
    paymentKey: body.paymentKey,
    provider: body.provider ?? 'toss',
  })

  if (!result.success) {
    throw new HTTPException(402, { message: 'Payment failed' })
  }

  const order = await prisma.order.upsert({
    where: { id: body.orderId },
    update: { status: 'PAID', providerTxId: result.providerTxId },
    create: {
      id: body.orderId,
      userId: sub,
      amount: body.amount,
      provider: body.provider ?? 'toss',
      providerTxId: result.providerTxId,
      status: 'PAID',
    },
  })

  return c.json({ success: true, data: order })
})

// GET /payments/orders — 내 주문 목록
payments.get('/orders', async (c) => {
  const { sub } = c.get('user')

  const orders = await prisma.order.findMany({
    where: { userId: sub },
    orderBy: { createdAt: 'desc' },
  })

  return c.json({ success: true, data: orders })
})

export default payments
