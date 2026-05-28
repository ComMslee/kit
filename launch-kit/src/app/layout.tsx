import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { AuthSessionProvider } from "@/components/providers/session-provider"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Launch Kit",
  description: "외주 프로젝트 보일러플레이트",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full font-[family-name:var(--font-geist)]">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  )
}
