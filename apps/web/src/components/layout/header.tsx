import { auth, signOut } from "@/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function Header() {
  const session = await auth()
  const isGuest = (await cookies()).get("guest_mode")?.value === "1"

  async function exitGuestMode() {
    "use server"
    ;(await cookies()).delete("guest_mode")
    redirect("/login")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
      {/* 페이지 타이틀 — 각 페이지에서 주입하거나 동적으로 설정 */}
      <div />

      {/* 유저 정보 */}
      {session?.user ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? ""}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">{session.user.name}</span>
          </div>

          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button
              type="submit"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition"
            >
              로그아웃
            </button>
          </form>
        </div>
      ) : isGuest ? (
        /* 게스트 모드 표시 */
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-amber-700 text-xs font-semibold">
              G
            </div>
            <span className="text-sm font-medium text-amber-700">게스트</span>
          </div>
          <form action={exitGuestMode}>
            <button
              type="submit"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition"
            >
              로그인하기
            </button>
          </form>
        </div>
      ) : null}
    </header>
  )
}
