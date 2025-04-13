"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Loader } from "@/components/map/loader"
import { Map } from "@/components/map/map"
import { format } from "date-fns"
import { MapPin, Clock, DollarSign, Star, ArrowLeft, MessageSquare, Phone, Receipt, Flag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TripDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [trip, setTrip] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const tripId = params.id as string

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Fetch trip details
  useEffect(() => {
    if (!token || authLoading) return

    const fetchTripDetails = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/trips/${tripId}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // })
        // const data = await response.json()
        // setTrip(data)

        // Mock data for demonstration
        setTimeout(() => {
          const mockTrip = generateMockTrip(tripId, user.role)
          setTrip(mockTrip)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching trip details:", error)
        toast({
          title: "Error",
          description: "Failed to load trip details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchTripDetails()
  }, [tripId, token, authLoading, user, toast])

  const generateMockTrip = (id, userRole) => {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    const statuses = ["completed", "cancelled", "in_progress"]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    const fare = (10 + Math.random() * 40).toFixed(2)
    const baseFare = (Number.parseFloat(fare) * 0.7).toFixed(2)
    const timeFare = (Number.parseFloat(fare) * 0.15).toFixed(2)
    const distanceFare = (Number.parseFloat(fare) * 0.15).toFixed(2)

    return {
      id,
      date: date.toISOString(),
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
      status,
      fare: Number.parseFloat(fare),
      fareBreakdown: {
        baseFare: Number.parseFloat(baseFare),
        timeFare: Number.parseFloat(timeFare),
        distanceFare: Number.parseFloat(distanceFare),
      },
      duration: Math.floor(10 + Math.random() * 30), // 10-40 minutes
      distance: (1 + Math.random() * 10).toFixed(1), // 1-11 miles
      rating: status === "completed" ? (3 + Math.random() * 2).toFixed(1) : null,
      paymentMethod: "Credit Card (•••• 4242)",
      timeline: [
        {
          status: "requested",
          time: new Date(date.getTime() - 1000 * 60 * 40).toISOString(),
        },
        {
          status: "accepted",
          time: new Date(date.getTime() - 1000 * 60 * 38).toISOString(),
        },
        {
          status: "arrived",
          time: new Date(date.getTime() - 1000 * 60 * 30).toISOString(),
        },
        {
          status: "in_progress",
          time: new Date(date.getTime() - 1000 * 60 * 25).toISOString(),
        },
        ...(status === "completed"
          ? [
              {
                status: "completed",
                time: date.toISOString(),
              },
            ]
          : status === "cancelled"
            ? [
                {
                  status: "cancelled",
                  time: new Date(date.getTime() - 1000 * 60 * 20).toISOString(),
                  reason: "Passenger cancelled the ride",
                },
              ]
            : []),
      ],
      [userRole === "passenger" ? "driver" : "passenger"]: {
        id: "user123",
        name: userRole === "passenger" ? "John Driver" : "Jane Passenger",
        phone: "+1 (555) 123-4567",
        rating: (4 + Math.random()).toFixed(1),
        ...(userRole === "passenger"
          ? {
              vehicle: {
                make: "Toyota",
                model: "Camry",
                color: "Silver",
                licensePlate: "ABC123",
              },
            }
          : {}),
      },
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
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

  if (!trip) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center mb-8">
          <Button variant="ghost" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Trip Not Found</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground">
              The trip you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button className="mt-6" onClick={() => router.push("/trips")}>
              Back to Trips
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const otherParty = user.role === "passenger" ? trip.driver : trip.passenger

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-8">
        <Button variant="ghost" className="mr-4" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Trip Details</h1>
          <p className="text-muted-foreground">{format(new Date(trip.date), "MMMM d, yyyy 'at' h:mm a")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Map Card */}
          <Card className="overflow-hidden">
            <div className="h-64">
              <Map pickupLocation={trip.pickupLocation} dropoffLocation={trip.dropoffLocation} isMapLoaded={true} />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
                <div className="flex-grow space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup</p>
                    <p className="font-medium">{trip.pickupLocation.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dropoff</p>
                    <p className="font-medium">{trip.dropoffLocation.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trip Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-gray-200 ml-3">
                {trip.timeline.map((event, index) => (
                  <li key={index} className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full -left-3 ring-8 ring-white">
                      {event.status === "requested" ? (
                        <MapPin className="w-3 h-3 text-primary" />
                      ) : event.status === "accepted" ? (
                        <Clock className="w-3 h-3 text-primary" />
                      ) : event.status === "arrived" ? (
                        <MapPin className="w-3 h-3 text-primary" />
                      ) : event.status === "in_progress" ? (
                        <Clock className="w-3 h-3 text-primary" />
                      ) : event.status === "completed" ? (
                        <Star className="w-3 h-3 text-primary" />
                      ) : (
                        <Flag className="w-3 h-3 text-primary" />
                      )}
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold capitalize">
                      {event.status.replace("_", " ")}
                      {index === 0 && (
                        <span className="bg-primary text-primary-foreground text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                          Latest
                        </span>
                      )}
                    </h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                      {format(new Date(event.time), "MMM d, yyyy 'at' h:mm a")}
                    </time>
                    {event.reason && <p className="text-sm text-muted-foreground">{event.reason}</p>}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Fare Details */}
          <Card>
            <CardHeader>
              <CardTitle>Fare Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Base fare</span>
                  <span>${trip.fareBreakdown.baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time ({trip.duration} min)</span>
                  <span>${trip.fareBreakdown.timeFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Distance ({trip.distance} miles)</span>
                  <span>${trip.fareBreakdown.distanceFare.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <span>${trip.fare.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span>{trip.paymentMethod}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Receipt className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Status</h3>
                {getStatusBadge(trip.status)}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration</span>
                  </div>
                  <span>{trip.duration} min</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Distance</span>
                  </div>
                  <span>{trip.distance} miles</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Fare</span>
                  </div>
                  <span>${trip.fare.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Party Card */}
          <Card>
            <CardHeader>
              <CardTitle>{user.role === "passenger" ? "Your Driver" : "Passenger"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${otherParty.name}`} />
                  <AvatarFallback>{otherParty.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{otherParty.name}</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{otherParty.rating}</span>
                  </div>
                </div>
              </div>

              {user.role === "passenger" && otherParty.vehicle && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Vehicle</p>
                  <p className="text-sm">
                    {otherParty.vehicle.color} {otherParty.vehicle.make} {otherParty.vehicle.model}
                  </p>
                  <p className="text-sm font-medium">{otherParty.vehicle.licensePlate}</p>
                </div>
              )}

              <div className="flex space-x-2 mt-4">
                <Button variant="outline" className="flex-1">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rating Card */}
          {trip.status === "completed" && (
            <Card>
              <CardHeader>
                <CardTitle>Rating</CardTitle>
              </CardHeader>
              <CardContent>
                {trip.rating ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 ${
                            star <= Math.round(Number.parseFloat(trip.rating))
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-center text-muted-foreground">
                      {user.role === "passenger" ? "You rated this driver" : "The passenger rated this trip"}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-center text-muted-foreground mb-4">
                      {user.role === "passenger"
                        ? "You haven't rated this trip yet"
                        : "The passenger hasn't rated this trip yet"}
                    </p>
                    {user.role === "passenger" && <Button>Rate this Trip</Button>}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Help Card */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Flag className="mr-2 h-4 w-4" />
                  Report an Issue
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Receipt className="mr-2 h-4 w-4" />
                  Request a Refund
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
