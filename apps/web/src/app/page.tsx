import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function RootPage() {
  const session = await auth()

  // 로그인 상태면 대시보드로, 아니면 로그인 페이지로
  if (session) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}
