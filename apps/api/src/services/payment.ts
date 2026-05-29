// 결제 서비스 — mock 구현
// 실제 연동 시 이 파일만 교체: 토스페이먼츠 / 아임포트

export interface PaymentConfirmInput {
  orderId: string
  amount: number
  paymentKey: string
  provider: string
}

export interface PaymentResult {
  success: boolean
  providerTxId: string
  amount: number
}

export async function confirmPayment(input: PaymentConfirmInput): Promise<PaymentResult> {
  // TODO: 토스페이먼츠 연동 시 → POST https://api.tosspayments.com/v1/payments/confirm
  console.log('[payment:mock] confirm', input)
  return {
    success: true,
    providerTxId: `mock_${Date.now()}`,
    amount: input.amount,
  }
}
