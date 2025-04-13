"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, CreditCard, Star, History } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [recentTrips, setRecentTrips] = useState([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Fetch recent trips
  useEffect(() => {
    if (!user) return

    // Mock data for demonstration
    const mockTrips = Array.from({ length: 3 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)

      return {
        id: `trip-${i + 1}`,
        date: date.toISOString(),
        pickupLocation: "123 Main St, San Francisco, CA",
        dropoffLocation: "456 Market St, San Francisco, CA",
        status: i === 0 ? "completed" : i === 1 ? "completed" : "cancelled",
        fare: 15 + Math.random() * 30,
        duration: Math.floor(10 + Math.random() * 30),
        distance: (1 + Math.random() * 10).toFixed(1),
        rating: i === 0 || i === 1 ? (3 + Math.random() * 2).toFixed(1) : null,
        [user.role === "passenger" ? "driver" : "passenger"]: {
          name: user.role === "passenger" ? `Driver ${i + 1}` : `Passenger ${i + 1}`,
          rating: (4 + Math.random()).toFixed(1),
        },
      }
    })

    setRecentTrips(mockTrips)
  }, [user])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <Button variant="outline" onClick={logout}>
          Log out
        </Button>
      </div>

      {user.role === "passenger" ? (
        <PassengerDashboard recentTrips={recentTrips} />
      ) : (
        <DriverDashboard recentTrips={recentTrips} />
      )}
    </div>
  )
}

function PassengerDashboard({ recentTrips }) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Book a Ride</CardTitle>
          <CardDescription className="text-primary-foreground/80">Where would you like to go today?</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className="w-full" onClick={() => router.push("/book-ride")}>
            <MapPin className="mr-2 h-4 w-4" />
            Book Now
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Rides</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTrips.length > 0 ? (
              <div className="space-y-4">
                {recentTrips.slice(0, 2).map((trip) => (
                  <div
                    key={trip.id}
                    className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{trip.dropoffLocation}</p>
                      <p className="text-sm text-muted-foreground">{new Date(trip.date).toLocaleDateString()}</p>
                    </div>
                    <p className="font-medium">${trip.fare.toFixed(2)}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/trips")}>
                  <History className="mr-2 h-4 w-4" />
                  View All Trips
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground">You haven't taken any rides yet.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push("/book-ride")}>
                  Book Your First Ride
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between border rounded-md p-3 mb-3">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium">•••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20">Default</Badge>
            </div>
            <Button variant="outline" size="sm">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-3 mb-3">
              <p className="font-medium">10% off your next ride</p>
              <p className="text-sm text-muted-foreground">Use code: WELCOME10</p>
              <p className="text-xs text-muted-foreground mt-2">Expires in 7 days</p>
            </div>
            <Button variant="outline" size="sm">
              View All Promotions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DriverDashboard({ recentTrips }) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Go Online</CardTitle>
          <CardDescription className="text-primary-foreground/80">Start receiving ride requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className="w-full" onClick={() => router.push("/driver/dashboard")}>
            Go Online
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${(recentTrips[0]?.fare || 0).toFixed(2)}</p>
            <p className="text-muted-foreground">
              {recentTrips.length > 0 ? `${recentTrips.length} trips completed` : "0 trips completed"}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => router.push("/driver/dashboard")}
            >
              View Earnings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rating</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-xl font-bold">4.9</span>
            <Button variant="link" size="sm" className="ml-auto" onClick={() => router.push("/driver/profile")}>
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Trips</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTrips.length > 0 ? (
              <div className="space-y-4">
                {recentTrips.slice(0, 2).map((trip) => (
                  <div
                    key={trip.id}
                    className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{trip.dropoffLocation}</p>
                      <p className="text-sm text-muted-foreground">{new Date(trip.date).toLocaleDateString()}</p>
                    </div>
                    <p className="font-medium">${trip.fare.toFixed(2)}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/trips")}>
                  <History className="mr-2 h-4 w-4" />
                  View All Trips
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">No trips completed today.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
