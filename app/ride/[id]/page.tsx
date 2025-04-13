"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useSocket, useRideUpdates } from "@/lib/socket"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Map } from "@/components/map/map"
import { Loader } from "@/components/map/loader"
import { Phone, MessageSquare, Star, Clock, Navigation } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RidePage() {
  const params = useParams()
  const router = useRouter()
  const { user, token, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [ride, setRide] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { socket, isConnected } = useSocket(token)
  const rideId = params.id as string

  const { driverLocation, rideStatus, driverInfo, updatePassengerLocation, updateRideStatus } = useRideUpdates(
    socket,
    rideId,
  )

  // Fetch ride details
  useEffect(() => {
    if (!token || authLoading) return

    const fetchRide = async () => {
      try {
        const response = await fetch(`/api/rides/${rideId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch ride")
        }

        const data = await response.json()
        setRide(data)
      } catch (error) {
        console.error("Error fetching ride:", error)
        toast({
          title: "Error",
          description: "Failed to load ride details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRide()
  }, [rideId, token, authLoading, toast])

  // Update passenger location periodically
  useEffect(() => {
    if (!isConnected || !user || user.role !== "passenger") return

    // Get current location
    const locationInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Update passenger location
            updatePassengerLocation(position.coords.latitude, position.coords.longitude)
          },
          (error) => {
            console.error("Error getting location:", error)
          },
        )
      }
    }, 10000) // Update every 10 seconds

    return () => {
      clearInterval(locationInterval)
    }
  }, [isConnected, user, updatePassengerLocation])

  const handleCancelRide = () => {
    if (window.confirm("Are you sure you want to cancel this ride?")) {
      updateRideStatus("cancelled")
      toast({
        title: "Ride Cancelled",
        description: "Your ride has been cancelled",
      })
      // Navigate back to dashboard
      router.push("/dashboard")
    }
  }

  const handleCompleteRide = () => {
    updateRideStatus("completed")
    toast({
      title: "Ride Completed",
      description: "Your ride has been completed. Thank you for riding with us!",
    })
    // Navigate to rating screen
    router.push(`/ride/${rideId}/rate`)
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    )
  }

  // Mock data for the example
  const mockRide = {
    id: rideId,
    status: rideStatus || "accepted",
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
    estimatedPrice: 25.5,
    estimatedTime: 15, // minutes
    driver: driverInfo || {
      id: "driver123",
      name: "John Driver",
      phone: "+1 (555) 123-4567",
      rating: 4.8,
      vehicle: {
        make: "Toyota",
        model: "Camry",
        color: "Silver",
        licensePlate: "ABC123",
      },
    },
  }

  const displayRide = ride || mockRide

  const getStatusBadge = () => {
    switch (displayRide.status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Finding driver
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Driver on the way
          </Badge>
        )
      case "arrived":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Driver arrived
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            In progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Map Section */}
      <div className="relative flex-grow">
        <Map
          pickupLocation={displayRide.pickupLocation}
          dropoffLocation={displayRide.dropoffLocation}
          isMapLoaded={true}
        />

        {/* Ride Details Panel */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-md p-4">
            <Card className="w-full shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Your Ride</CardTitle>
                  {getStatusBadge()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Driver info */}
                {displayRide.status !== "pending" && (
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayRide.driver.name}`} />
                      <AvatarFallback>{displayRide.driver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="font-medium">{displayRide.driver.name}</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{displayRide.driver.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {displayRide.driver.vehicle?.color} {displayRide.driver.vehicle?.make}{" "}
                        {displayRide.driver.vehicle?.model}
                      </p>
                      <p className="text-sm font-medium">{displayRide.driver.vehicle?.licensePlate}</p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Ride details */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    </div>
                    <div className="flex-grow space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup</p>
                        <p className="text-sm">{displayRide.pickupLocation.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dropoff</p>
                        <p className="text-sm">{displayRide.dropoffLocation.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Est. time:</span>
                    </div>
                    <span className="text-sm font-medium">{displayRide.estimatedTime} min</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground">Fare:</span>
                    </div>
                    <span className="text-sm font-medium">${displayRide.estimatedPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                {/* Action buttons */}
                <div className="flex justify-around">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                {displayRide.status !== "completed" && displayRide.status !== "cancelled" && (
                  <div className="w-full flex justify-between">
                    {user?.role === "passenger" && (
                      <Button variant="destructive" onClick={handleCancelRide}>
                        Cancel Ride
                      </Button>
                    )}
                    {user?.role === "driver" && displayRide.status === "in_progress" && (
                      <Button onClick={handleCompleteRide} className="ml-auto">
                        Complete Ride
                      </Button>
                    )}
                    {user?.role === "driver" && displayRide.status === "accepted" && (
                      <Button onClick={() => updateRideStatus("in_progress")} className="ml-auto">
                        Start Ride
                      </Button>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
