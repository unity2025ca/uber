"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NotificationItem } from "@/components/notifications/notification-item"
import { useAuth } from "@/lib/auth-context"

export function NotificationCenter() {
  const { user, token } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  // Fetch notifications
  useEffect(() => {
    if (!token || !user) return

    // In a real app, you would fetch from your API
    // For demo purposes, we'll use mock data
    const mockNotifications = generateMockNotifications()
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [token, user])

  const generateMockNotifications = () => {
    const now = new Date()

    return [
      {
        id: "1",
        type: "ride_completed",
        title: "Ride Completed",
        message: "Your ride to Market Street has been completed. Rate your experience!",
        timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        read: false,
        data: {
          rideId: "ride-123",
        },
      },
      {
        id: "2",
        type: "driver_assigned",
        title: "Driver Assigned",
        message: "John Driver has been assigned to your ride. ETA: 5 minutes.",
        timestamp: new Date(now.getTime() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        read: false,
        data: {
          rideId: "ride-124",
          driverId: "driver-456",
        },
      },
      {
        id: "3",
        type: "payment_processed",
        title: "Payment Processed",
        message: "Your payment of $24.50 for the ride to Downtown has been processed.",
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
        data: {
          rideId: "ride-125",
          amount: 24.5,
        },
      },
      {
        id: "4",
        type: "promotion",
        title: "Weekend Discount",
        message: "Enjoy 15% off your rides this weekend with code WEEKEND15.",
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        read: true,
        data: {
          promoCode: "WEEKEND15",
          expiryDate: new Date(now.getTime() + 1000 * 60 * 60 * 72).toISOString(), // 3 days from now
        },
      },
      {
        id: "5",
        type: "account_update",
        title: "Profile Updated",
        message: "Your profile information has been successfully updated.",
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        read: true,
        data: {},
      },
    ]
  }

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      const updatedNotifications = notifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      setNotifications(updatedNotifications)
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }

    // Handle navigation based on notification type
    switch (notification.type) {
      case "ride_completed":
      case "payment_processed":
        // Navigate to trip details
        window.location.href = `/trips/${notification.data.rideId}`
        break
      case "driver_assigned":
        // Navigate to active ride
        window.location.href = `/ride/${notification.data.rideId}`
        break
      case "promotion":
        // Navigate to promotions page
        // window.location.href = "/promotions"
        break
      case "account_update":
        // Navigate to profile
        window.location.href = user.role === "driver" ? "/driver/profile" : "/profile"
        break
    }

    setOpen(false)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updatedNotifications)
    setUnreadCount(0)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center translate-x-1/4 -translate-y-1/4">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="p-0">
            <ScrollArea className="h-[300px]">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={() => handleNotificationClick(notification)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                  <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread" className="p-0">
            <ScrollArea className="h-[300px]">
              {notifications.filter((n) => !n.read).length > 0 ? (
                <div className="divide-y">
                  {notifications
                    .filter((notification) => !notification.read)
                    .map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClick={() => handleNotificationClick(notification)}
                      />
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                  <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No unread notifications</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
