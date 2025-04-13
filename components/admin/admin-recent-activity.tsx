import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Car, Ban, CheckCircle, MessageSquare } from "lucide-react"

interface Activity {
  id: string
  type: string
  user: {
    id: string
    name: string
    role?: string
  }
  driver?: {
    id: string
    name: string
  }
  amount?: number
  reason?: string
  subject?: string
  status?: string
  timestamp: string
}

interface AdminRecentActivityProps {
  activities: Activity[]
}

export function AdminRecentActivity({ activities }: AdminRecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registered":
        return <UserPlus className="h-5 w-5 text-green-500" />
      case "ride_completed":
        return <Car className="h-5 w-5 text-blue-500" />
      case "ride_cancelled":
        return <Ban className="h-5 w-5 text-red-500" />
      case "driver_approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "support_ticket":
        return <MessageSquare className="h-5 w-5 text-yellow-500" />
      default:
        return <Car className="h-5 w-5 text-gray-500" />
    }
  }

  const getActivityTitle = (activity: Activity) => {
    switch (activity.type) {
      case "user_registered":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> registered as a{" "}
            <Badge variant="outline">{activity.user.role}</Badge>
          </>
        )
      case "ride_completed":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> completed a ride with{" "}
            <span className="font-medium">{activity.driver?.name}</span> for{" "}
            <span className="font-medium">${activity.amount?.toFixed(2)}</span>
          </>
        )
      case "ride_cancelled":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> cancelled a ride
            {activity.reason && (
              <>
                {" "}
                - <span className="italic">"{activity.reason}"</span>
              </>
            )}
          </>
        )
      case "driver_approved":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> was approved as a driver
          </>
        )
      case "support_ticket":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> opened a support ticket:{" "}
            <span className="font-medium">{activity.subject}</span>{" "}
            <Badge
              variant="outline"
              className={
                activity.status === "open"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-green-50 text-green-700 border-green-200"
              }
            >
              {activity.status}
            </Badge>
          </>
        )
      default:
        return <span>Unknown activity</span>
    }
  }

  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="bg-muted p-2 rounded-full">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm">{getActivityTitle(activity)}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-4">No recent activity</p>
      )}
    </div>
  )
}
