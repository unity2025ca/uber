"use client"

import { formatDistanceToNow } from "date-fns"
import { Car, CreditCard, Bell, User } from "lucide-react"

interface NotificationItemProps {
  notification: {
    id: string
    type: string
    title: string
    message: string
    timestamp: string
    read: boolean
    data: any
  }
  onClick: () => void
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "ride_completed":
      case "driver_assigned":
        return <Car className="h-5 w-5" />
      case "payment_processed":
        return <CreditCard className="h-5 w-5" />
      case "promotion":
        return <Bell className="h-5 w-5" />
      case "account_update":
        return <User className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <div
      className={`flex items-start p-4 hover:bg-muted cursor-pointer ${!notification.read ? "bg-primary/5" : ""}`}
      onClick={onClick}
    >
      <div className={`rounded-full p-2 mr-3 ${!notification.read ? "bg-primary/10" : "bg-muted"}`}>{getIcon()}</div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <p className={`text-sm font-medium ${!notification.read ? "text-primary" : ""}`}>{notification.title}</p>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
      </div>
    </div>
  )
}
