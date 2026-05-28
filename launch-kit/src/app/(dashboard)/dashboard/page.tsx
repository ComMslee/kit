import { auth } from "@/auth"
import { StatCard } from "@/components/ui/card"
import { prisma } from "@/lib/db/prisma"
import { formatDate } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await auth()

  // 최근 가입 유저 (DB 미연결 시 빈 배열)
  let recentUsers: Array<{ id: string; name: string | null; email: string; createdAt: Date }> = []
  let totalUsers = 0

  try {
    ;[recentUsers, totalUsers] = await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.user.count(),
    ])
  } catch {
    // DB 미연결 — 기본값 유지
  }

  return (
    <div className="space-y-6">
      {/* 인사말 */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          안녕하세요, {session?.user?.name ?? "관리자"}님 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">오늘도 좋은 하루 되세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="전체 사용자"
          value={totalUsers.toLocaleString()}
          description="총 가입자 수"
          trend={{ value: 0, label: "전월 대비" }}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="오늘 방문자"
          value="0"
          description="24시간 기준"
          trend={{ value: 0, label: "어제 대비" }}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <StatCard
          title="이번달 매출"
          value="₩0"
          description="결제 완료 기준"
          trend={{ value: 0, label: "전월 대비" }}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="처리 대기"
          value="0"
          description="확인 필요 건수"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
      </div>

      {/* 최근 가입 현황 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">최근 가입 현황</h2>
        {recentUsers.length === 0 ? (
          <p className="text-sm text-gray-400">
            아직 가입한 사용자가 없습니다. OAuth 설정 후 로그인하면 여기에 표시됩니다.
          </p>
        ) : (
          <ul className="space-y-3">
            {recentUsers.map((u) => (
              <li key={u.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                  {u.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{u.name ?? "—"}</p>
                  <p className="truncate text-xs text-gray-400">{u.email}</p>
                </div>
                <span className="text-xs text-gray-400">{formatDate(u.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 빠른 메뉴 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">빠른 메뉴</h2>
        <p className="text-sm text-gray-500">
          이 영역은 프로젝트에 맞게 커스텀하세요.
        </p>
      </div>
    </div>
  )
}
