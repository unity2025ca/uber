import { Clock, DollarSign } from "lucide-react"

interface PriceEstimateProps {
  minPrice: number
  maxPrice: number
  estimatedTime: number
}

export function PriceEstimate({ minPrice, maxPrice, estimatedTime }: PriceEstimateProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center text-muted-foreground">
          <DollarSign className="h-4 w-4 mr-1" />
          <span className="text-sm">Price Estimate</span>
        </div>
        <div className="font-medium">
          ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">Estimated Arrival</span>
        </div>
        <div className="font-medium">{formatTime(estimatedTime)}</div>
      </div>
    </div>
  )
}

function formatTime(minutes: number): string {
  if (minutes < 1) {
    return "Less than a minute"
  }

  if (minutes === 1) {
    return "1 minute"
  }

  if (minutes < 60) {
    return `${minutes} minutes`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`
  }

  return `${hours} ${hours === 1 ? "hour" : "hours"} ${remainingMinutes} ${remainingMinutes === 1 ? "minute" : "minutes"}`
}
