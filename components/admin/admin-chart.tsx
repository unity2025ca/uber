"use client"

import { useEffect, useState } from "react"

interface AdminChartProps {
  type: "revenue" | "rides" | "users"
}

export function AdminChart({ type }: AdminChartProps) {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // Here we're generating mock data
    const generateMockData = () => {
      const days = 30
      const labels = Array.from({ length: days }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (days - 1) + i)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      })

      let data
      if (type === "revenue") {
        data = Array.from({ length: days }, () => Math.floor(Math.random() * 1000) + 500)
      } else if (type === "rides") {
        data = Array.from({ length: days }, () => Math.floor(Math.random() * 100) + 50)
      } else {
        // users
        data = Array.from({ length: days }, (_, i) => {
          // Cumulative user growth
          return 1000 + Math.floor(Math.random() * 10) * i
        })
      }

      return { labels, data }
    }

    setChartData(generateMockData())
  }, [type])

  if (!chartData) {
    return <div className="h-64 flex items-center justify-center">Loading chart data...</div>
  }

  // In a real app, you would use a charting library like Chart.js, Recharts, or D3.js
  // For this example, we'll create a simple bar chart with CSS
  return (
    <div className="h-64">
      <div className="flex h-full items-end space-x-1">
        {chartData.data.map((value: number, index: number) => {
          const maxValue = Math.max(...chartData.data)
          const height = (value / maxValue) * 100
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-full rounded-t-sm ${
                  type === "revenue" ? "bg-blue-500" : type === "rides" ? "bg-green-500" : "bg-purple-500"
                }`}
                style={{ height: `${height}%` }}
              ></div>
              {index % 5 === 0 && (
                <div className="text-xs text-muted-foreground mt-1 rotate-45 origin-left">
                  {chartData.labels[index]}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-6 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {type === "revenue" ? "Total: $28,456.78" : type === "rides" ? "Total: 5,672 rides" : "Total: 1,248 users"}
        </div>
        <div className="text-sm text-green-600">
          {type === "revenue"
            ? "↑ 15.2% from last month"
            : type === "rides"
              ? "↑ 8.7% from last month"
              : "↑ 12.3% from last month"}
        </div>
      </div>
    </div>
  )
}
