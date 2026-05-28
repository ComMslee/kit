import { prisma } from "@/lib/db/prisma"
import { formatDate } from "@/lib/utils"

export const metadata = { title: "사용자 관리 | Launch Kit" }

export default async function UsersPage() {
  // DB 연결 전이면 빈 배열로 graceful fallback
  let users: Array<{
    id: string
    name: string | null
    email: string
    image: string | null
    role: string
    createdAt: Date
  }> = []

  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    })
  } catch {
    // DB 미연결 상태 — 빈 목록으로 렌더링
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">사용자 관리</h1>
          <p className="mt-1 text-sm text-gray-500">총 {users.length}명의 사용자</p>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 text-4xl">👥</div>
            <p className="font-medium text-gray-700">아직 가입한 사용자가 없습니다</p>
            <p className="mt-1 text-sm text-gray-400">
              OAuth 로그인 후 사용자가 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  가입일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name ?? ""}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                          {user.name?.[0]?.toUpperCase() ?? "U"}
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{user.name ?? "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role === "ADMIN" ? "관리자" : "사용자"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
