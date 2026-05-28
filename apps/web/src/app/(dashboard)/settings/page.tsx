import { auth } from "@/auth"

export const metadata = { title: "설정 | Launch Kit" }

export default async function SettingsPage() {
  const session = await auth()
  const user = session?.user

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">설정</h1>
        <p className="mt-1 text-sm text-gray-500">계정 및 서비스 설정을 관리합니다.</p>
      </div>

      {/* 프로필 카드 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">내 계정</h2>
        <div className="flex items-center gap-4">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? ""}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{user?.name ?? "—"}</p>
            <p className="text-sm text-gray-500">{user?.email ?? "—"}</p>
            <p className="mt-1 text-xs text-gray-400">소셜 로그인 계정은 프로필 수정이 각 플랫폼에서 이루어집니다.</p>
          </div>
        </div>
      </div>

      {/* 서비스 설정 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">서비스 설정</h2>
        <div className="space-y-4">
          <SettingRow
            label="이메일 알림"
            description="새 문의, 결제 등 주요 이벤트 알림을 이메일로 받습니다."
            defaultChecked
          />
          <SettingRow
            label="마케팅 수신"
            description="서비스 업데이트, 이벤트 정보를 받습니다."
            defaultChecked={false}
          />
        </div>
      </div>

      {/* 개발자 정보 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">개발 정보</h2>
        <dl className="space-y-3 text-sm">
          <InfoRow label="프레임워크" value="Next.js 15 (App Router)" />
          <InfoRow label="인증" value="NextAuth v5" />
          <InfoRow label="데이터베이스" value="PostgreSQL + Prisma ORM" />
          <InfoRow label="스타일링" value="Tailwind CSS v4" />
          <InfoRow label="버전" value="1.0.0" />
        </dl>
      </div>
    </div>
  )
}

function SettingRow({
  label,
  description,
  defaultChecked,
}: {
  label: string
  description: string
  defaultChecked: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
      {/* 실제 동작은 Client Component로 교체 필요 */}
      <div
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
          defaultChecked ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
            defaultChecked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  )
}
