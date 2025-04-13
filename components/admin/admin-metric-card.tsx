import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface AdminMetricCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: number
  trendLabel?: string
}

export function AdminMetricCard({ title, value, icon, trend = 0, trendLabel }: AdminMetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
        </div>
        {trend !== undefined && (
          <div className="flex items-center mt-4">
            {trend > 0 ? (
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{trend}%</span>
              </div>
            ) : trend < 0 ? (
              <div className="flex items-center text-red-600">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{Math.abs(trend)}%</span>
              </div>
            ) : (
              <div className="flex items-center text-muted-foreground">
                <span className="text-sm font-medium">0%</span>
              </div>
            )}
            {trendLabel && <span className="text-xs text-muted-foreground ml-1">{trendLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
