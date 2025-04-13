"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader } from "@/components/map/loader"
import { Bell, Check, Trash2 } from "lucide-react"
import { NotificationItem } from "@/components/notifications/notification-item"
import { useToast } from "@/hooks/use-toast"

export default function NotificationsPage() {
  const router = useRouter()
  const { user, token, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Fetch notifications
  useEffect(() => {
    if (!token || authLoading) return

    // In a real app, you would fetch from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockNotifications = generateMockNotifications()
      setNotifications(mockNotifications)
      setIsLoading(false)
    }, 1000)
  }, [token, authLoading])

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
      {
        id: "6",
        type: "ride_cancelled",
        title: "Ride Cancelled",
        message: "Your ride to Airport has been cancelled. No charges have been applied.",
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
        read: true,
        data: {
          rideId: "ride-126",
        },
      },
      {
        id: "7",
        type: "driver_message",
        title: "Message from Driver",
        message: "I've arrived at the pickup location. I'm in a silver Toyota Camry.",
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
        read: true,
        data: {
          rideId: "ride-127",
          driverId: "driver-789",
        },
      },
    ]
  }

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      const updatedNotifications = notifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      setNotifications(updatedNotifications)
    }

    // Handle navigation based on notification type
    switch (notification.type) {
      case "ride_completed":
      case "payment_processed":
      case "ride_cancelled":
        // Navigate to trip details
        router.push(`/trips/${notification.data.rideId}`)
        break
      case "driver_assigned":
      case "driver_message":
        // Navigate to active ride
        router.push(`/ride/${notification.data.rideId}`)
        break
      case "promotion":
        // Navigate to promotions page
        // router.push("/promotions")
        toast({
          title: "Promo Code Copied",
          description: `${notification.data.promoCode} has been copied to clipboard`,
        })
        navigator.clipboard.writeText(notification.data.promoCode)
        break
      case "account_update":
        // Navigate to profile
        router.push(user.role === "driver" ? "/driver/profile" : "/profile")
        break
    }
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updatedNotifications)
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    toast({
      title: "Notifications",
      description: "All notifications cleared",
    })
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your ride activity</p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={!notifications.some((n) => !n.read)}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          <Button variant="outline" onClick={clearAllNotifications} disabled={notifications.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={!notification.read ? "border-primary/50 bg-primary/5" : ""}>
                  <CardContent className="p-0">
                    <NotificationItem
                      notification={notification}
                      onClick={() => handleNotificationClick(notification)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Bell className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You don't have any notifications yet. We'll notify you about ride updates, promotions, and more.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="unread">
          {notifications.filter((n) => !n.read).length > 0 ? (
            <div className="space-y-4">
              {notifications
                .filter((notification) => !notification.read)
                .map((notification) => (
                  <Card key={notification.id} className="border-primary/50 bg-primary/5">
                    <CardContent className="p-0">
                      <NotificationItem
                        notification={notification}
                        onClick={() => handleNotificationClick(notification)}
                      />
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Check className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You have no unread notifications. Check back later for updates.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="read">
          {notifications.filter((n) => n.read).length > 0 ? (
            <div className="space-y-4">
              {notifications
                .filter((notification) => notification.read)
                .map((notification) => (
                  <Card key={notification.id}>
                    <CardContent className="p-0">
                      <NotificationItem
                        notification={notification}
                        onClick={() => handleNotificationClick(notification)}
                      />
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Bell className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No read notifications</h3>
                <p className="text-muted-foreground text-center max-w-md">You don't have any read notifications yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
