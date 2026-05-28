import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DemoBanner } from "@/components/ui/demo-banner"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const isGuest = (await cookies()).get("guest_mode")?.value === "1"

  if (!session && !isGuest) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        {/* 데모 모드 배너 */}
        <div className="px-6 pt-4">
          <DemoBanner />
        </div>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
