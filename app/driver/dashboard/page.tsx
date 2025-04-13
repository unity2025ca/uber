"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useSocket } from "@/lib/socket"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/map/loader"
import { Car, DollarSign, Star, Clock, Calendar, Navigation } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DriverDashboardPage() {
  const router = useRouter()
  const { user, token, isLoading: authLoading } = useAuth()
  const { socket, isConnected } = useSocket(token)
  const { toast } = useToast()
  const [isOnline, setIsOnline] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [pendingRides, setPendingRides] = useState([])
  const [activeRide, setActiveRide] = useState(null)
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
  })
  const [stats, setStats] = useState({
    totalRides: 0,
    acceptanceRate: 0,
    averageRating: 4.8,
  })

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "driver")) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Listen for ride requests
  useEffect(() => {
    if (!socket) return

    socket.on("rideRequest", (ride) => {
      toast({
        title: "New Ride Request",
        description: `Pickup at ${ride.pickupLocation.address}`,
      })

      // Add to pending rides
      setPendingRides((prev) => [ride, ...prev])
    })

    return () => {
      socket.off("rideRequest")
    }
  }, [socket, toast])

  // Simulate fetching driver's earnings and stats
  useEffect(() => {
    if (!token || authLoading) return

    // This would be an API call in a real app
    setEarnings({
      today: 120.5,
      week: 650.75,
      month: 2450.25,
    })

    setStats({
      totalRides: 142,
      acceptanceRate: 95,
      averageRating: 4.8,
    })

    // Simulate an active ride for demonstration
    setActiveRide({
      id: "ride123",
      status: "in_progress",
      passenger: {
        name: "Jane Passenger",
        rating: 4.9,
      },
      pickupLocation: {
        address: "123 Main St, San Francisco, CA",
        latitude: 37.7749,
        longitude: -122.4194,
      },
      dropoffLocation: {
        address: "456 Market St, San Francisco, CA",
        latitude: 37.7911,
        longitude: -122.3973,
      },
      fare: 28.5,
      createdAt: new Date().toISOString(),
    })
  }, [token, authLoading])

  const handleToggleOnline = async () => {
    setIsUpdating(true)

    try {
      // In a real app, you would update the driver's status via API
      const newStatus = !isOnline

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setIsOnline(newStatus)

      toast({
        title: newStatus ? "You're Online" : "You're Offline",
        description: newStatus ? "You can now receive ride requests" : "You will not receive new ride requests",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update your status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAcceptRide = async (ride) => {
    try {
      // In a real app, you would accept the ride via API
      // and socket.io would be used to notify the passenger

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove from pending rides
      setPendingRides((prev) => prev.filter((r) => r.id !== ride.id))

      // Set as active ride
      setActiveRide({
        ...ride,
        status: "accepted",
      })

      toast({
        title: "Ride Accepted",
        description: "Navigate to pickup location",
      })

      // Navigate to ride details page
      router.push(`/ride/${ride.id}`)
    } catch (error) {
      console.error("Error accepting ride:", error)
      toast({
        title: "Error",
        description: "Failed to accept ride. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeclineRide = async (ride) => {
    try {
      // In a real app, you would decline the ride via API

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove from pending rides
      setPendingRides((prev) => prev.filter((r) => r.id !== ride.id))

      toast({
        title: "Ride Declined",
        description: "The ride request has been declined",
      })
    } catch (error) {
      console.error("Error declining ride:", error)
      toast({
        title: "Error",
        description: "Failed to decline ride. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    )
  }

  if (!user || user.role !== "driver") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Driver Dashboard</h1>
          <p className="text-muted-foreground">Manage your rides and earnings</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch checked={isOnline} onCheckedChange={handleToggleOnline} disabled={isUpdating} />
            <span className="font-medium">{isOnline ? "Online" : "Offline"}</span>
          </div>

          <Button variant="outline" onClick={() => router.push("/driver/profile")}>
            Profile
          </Button>
        </div>
      </div>

      {/* Active Ride Section */}
      {activeRide && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Current Ride</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {activeRide.status === "accepted" ? "En Route to Pickup" : "In Progress"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeRide.passenger.name}`} />
                <AvatarFallback>{activeRide.passenger.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <p className="font-medium">{activeRide.passenger.name}</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{activeRide.passenger.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex flex-col items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div className="flex-grow space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Pickup</p>
                  <p className="text-sm">{activeRide.pickupLocation.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dropoff</p>
                  <p className="text-sm">{activeRide.dropoffLocation.address}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Fare:</span>
              </div>
              <span className="text-sm font-medium">${activeRide.fare.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push(`/ride/${activeRide.id}`)}>
              <Navigation className="mr-2 h-4 w-4" />
              Navigate to {activeRide.status === "accepted" ? "Pickup" : "Dropoff"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Pending Rides */}
      {pendingRides.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>New ride requests for you to accept or decline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRides.map((ride) => (
              <div key={ride.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${ride.passenger.name}`} />
                      <AvatarFallback>{ride.passenger.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{ride.passenger.name}</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-sm">{ride.passenger.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${ride.fare.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Est. {ride.estimatedTime} min</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="w-0.5 h-6 bg-gray-300 my-1"></div>
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                  <div className="flex-grow space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p className="text-xs">{ride.pickupLocation.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Dropoff</p>
                      <p className="text-xs">{ride.dropoffLocation.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleDeclineRide(ride)}>
                    Decline
                  </Button>
                  <Button size="sm" onClick={() => handleAcceptRide(ride)}>
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${earnings.today.toFixed(2)}</div>
            <p className="text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Acceptance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.acceptanceRate}%</div>
            <p className="text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rating</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <div className="text-3xl font-bold">{stats.averageRating}</div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">Total Earnings</div>
                  <div className="text-2xl font-bold">${earnings.today.toFixed(2)}</div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4" />
                      <span>Ride Earnings</span>
                    </div>
                    <div>${(earnings.today * 0.85).toFixed(2)}</div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Tips</span>
                    </div>
                    <div>${(earnings.today * 0.15).toFixed(2)}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Recent Rides</div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          10:30 AM
                        </div>
                        <div className="text-sm">Downtown SF → Airport</div>
                      </div>
                      <div className="text-sm font-medium">$35.50</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          9:15 AM
                        </div>
                        <div className="text-sm">Marina → Financial District</div>
                      </div>
                      <div className="text-sm font-medium">$18.75</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          8:00 AM
                        </div>
                        <div className="text-sm">Mission → Soma</div>
                      </div>
                      <div className="text-sm font-medium">$12.25</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="week" className="pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">Total Earnings</div>
                  <div className="text-2xl font-bold">${earnings.week.toFixed(2)}</div>
                </div>

                <div className="h-48 bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Earnings chart would go here</p>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <div key={day} className="text-center">
                      <div className="text-xs text-muted-foreground">{day}</div>
                      <div className="h-24 bg-muted rounded-md mt-1 relative overflow-hidden">
                        <div
                          className="absolute bottom-0 w-full bg-primary"
                          style={{ height: `${20 + Math.random() * 80}%` }}
                        ></div>
                      </div>
                      <div className="text-xs font-medium mt-1">${(50 + Math.random() * 100).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="month" className="pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">Total Earnings</div>
                  <div className="text-2xl font-bold">${earnings.month.toFixed(2)}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">July 2023</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{stats.totalRides} rides completed</div>
                </div>

                <div className="h-48 bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Monthly statistics chart would go here</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Busiest Day</div>
                    <div className="flex justify-between items-center">
                      <div>Friday</div>
                      <div className="font-medium">${(earnings.month * 0.25).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Busiest Time</div>
                    <div className="flex justify-between items-center">
                      <div>5:00 PM - 8:00 PM</div>
                      <div className="font-medium">${(earnings.month * 0.4).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
