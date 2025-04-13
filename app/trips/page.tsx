"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader } from "@/components/map/loader"
import { Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TripCard } from "@/components/trips/trip-card"
import { TripFilter } from "@/components/trips/trip-filter"

export default function TripsPage() {
  const router = useRouter()
  const { user, token, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [trips, setTrips] = useState([])
  const [filteredTrips, setFilteredTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: null, to: null })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Fetch trips
  useEffect(() => {
    if (!token || authLoading) return

    const fetchTrips = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch("/api/trips", {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // })
        // const data = await response.json()
        // setTrips(data.trips)

        // Mock data for demonstration
        setTimeout(() => {
          const mockTrips = generateMockTrips(user.role)
          setTrips(mockTrips)
          setFilteredTrips(mockTrips)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching trips:", error)
        toast({
          title: "Error",
          description: "Failed to load trip history",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchTrips()
  }, [token, authLoading, user, toast])

  // Filter trips based on status and date range
  useEffect(() => {
    if (!trips.length) return

    let filtered = [...trips]

    // Filter by status
    if (activeFilter !== "all") {
      filtered = filtered.filter((trip) => trip.status === activeFilter)
    }

    // Filter by date range
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from)
      filtered = filtered.filter((trip) => new Date(trip.date) >= fromDate)
    }

    if (dateRange.to) {
      const toDate = new Date(dateRange.to)
      toDate.setHours(23, 59, 59, 999) // End of the day
      filtered = filtered.filter((trip) => new Date(trip.date) <= toDate)
    }

    setFilteredTrips(filtered)
  }, [trips, activeFilter, dateRange])

  const generateMockTrips = (role) => {
    const statuses = ["completed", "cancelled", "in_progress"]
    const locations = [
      { pickup: "123 Main St", dropoff: "456 Market St" },
      { pickup: "789 Mission St", dropoff: "101 Valencia St" },
      { pickup: "555 Howard St", dropoff: "222 Brannan St" },
      { pickup: "333 Folsom St", dropoff: "444 Harrison St" },
      { pickup: "777 Bryant St", dropoff: "888 Townsend St" },
    ]

    return Array.from({ length: 15 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30)) // Random date within last 30 days

      const location = locations[Math.floor(Math.random() * locations.length)]
      const status =
        i < 2 ? "in_progress" : statuses[Math.floor(Math.random() * (statuses.length - 1)) + (i < 2 ? 0 : 1)]
      const fare = (10 + Math.random() * 40).toFixed(2)

      return {
        id: `trip-${i + 1}`,
        date: date.toISOString(),
        pickupLocation: location.pickup,
        dropoffLocation: location.dropoff,
        status,
        fare: Number.parseFloat(fare),
        duration: Math.floor(10 + Math.random() * 30), // 10-40 minutes
        distance: (1 + Math.random() * 10).toFixed(1), // 1-11 miles
        rating: status === "completed" ? (3 + Math.random() * 2).toFixed(1) : null,
        [role === "passenger" ? "driver" : "passenger"]: {
          name: role === "passenger" ? `Driver ${i + 1}` : `Passenger ${i + 1}`,
          rating: (4 + Math.random()).toFixed(1),
        },
      }
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
          <h1 className="text-3xl font-bold">Your Trips</h1>
          <p className="text-muted-foreground">View and manage your ride history</p>
        </div>
      </div>

      <div className="mb-8">
        <TripFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>

      {filteredTrips.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Calendar className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trips found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {trips.length === 0
                ? "You haven't taken any trips yet. Book a ride to get started!"
                : "No trips match your current filters. Try adjusting your search criteria."}
            </p>
            {trips.length === 0 && <Button onClick={() => router.push("/book-ride")}>Book a Ride</Button>}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} userRole={user.role} onClick={() => router.push(`/trips/${trip.id}`)} />
          ))}
        </div>
      )}
    </div>
  )
}
