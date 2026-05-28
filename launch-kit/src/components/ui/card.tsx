import { cn } from "@/lib/utils"

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn("rounded-2xl border border-gray-100 bg-white p-6 shadow-sm", className)}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={cn("mb-4 flex items-center justify-between", className)}>{children}</div>
}

export function CardTitle({ className, children }: CardProps) {
  return <h3 className={cn("text-base font-semibold text-gray-900", className)}>{children}</h3>
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn(className)}>{children}</div>
}

// 통계 카드 (대시보드에서 자주 쓰이는 패턴)
interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: { value: number; label: string }
  className?: string
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  const isPositive = trend && trend.value >= 0

  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
          {trend && (
            <p className={cn("mt-2 text-xs font-medium", isPositive ? "text-green-600" : "text-red-500")}>
              {isPositive ? "▲" : "▼"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
