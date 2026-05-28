/**
 * 데모 모드 배너
 * 백엔드 API / OAuth 연동 전까지 표시 — 실제 서버 연동 후 제거하세요.
 */
export function DemoBanner() {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
      <span className="mt-0.5 shrink-0">🔧</span>
      <p>
        <span className="font-semibold">데모 모드</span>
        {"  "}서버 미연동 상태입니다. 로그인·데이터는 임시 값입니다.
      </p>
    </div>
  )
}
