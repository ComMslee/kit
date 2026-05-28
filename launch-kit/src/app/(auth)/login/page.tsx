import { signIn } from "@/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DemoBanner } from "@/components/ui/demo-banner"

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  async function enterGuestMode() {
    "use server"
    ;(await cookies()).set("guest_mode", "1", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24시간
      path: "/",
    })
    redirect("/dashboard")
  }

  return (
    <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-lg">
      {/* 데모 모드 배너 */}
      <DemoBanner />

      {/* 로고 영역 */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
        <p className="mt-2 text-sm text-gray-500">소셜 계정으로 간편하게 시작하세요</p>
      </div>

      {/* 소셜 로그인 버튼 */}
      <div className="space-y-3">
        {/* 카카오 */}
        <form
          action={async () => {
            "use server"
            const params = await searchParams
            await signIn("mock", { provider: "kakao", redirectTo: params.callbackUrl ?? "/dashboard" })
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#FEE500] px-4 py-3 text-sm font-semibold text-[#191919] transition hover:brightness-95"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 2C5.58 2 2 4.918 2 8.5c0 2.278 1.392 4.276 3.5 5.454L4.7 17.1a.3.3 0 0 0 .448.316L9.1 14.96c.297.024.596.04.9.04 4.418 0 8-2.918 8-6.5S14.418 2 10 2z"
                fill="#191919"
              />
            </svg>
            카카오로 로그인
          </button>
        </form>

        {/* 네이버 */}
        <form
          action={async () => {
            "use server"
            const params = await searchParams
            await signIn("mock", { provider: "naver", redirectTo: params.callbackUrl ?? "/dashboard" })
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#03C75A] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-95"
          >
            <span className="font-extrabold leading-none">N</span>
            네이버로 로그인
          </button>
        </form>

        {/* 구글 */}
        <form
          action={async () => {
            "use server"
            const params = await searchParams
            await signIn("mock", { provider: "google", redirectTo: params.callbackUrl ?? "/dashboard" })
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Google로 로그인
          </button>
        </form>
      </div>

      {/* 구분선 */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">또는</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* 게스트 모드 */}
      <form action={enterGuestMode}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          게스트로 둘러보기
        </button>
      </form>
      <p className="text-center text-xs text-gray-400">게스트 모드는 24시간 유효합니다</p>
    </div>
  )
}
