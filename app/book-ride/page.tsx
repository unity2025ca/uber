"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, X } from "lucide-react"
import { Loader } from "@/components/map/loader"
import { RideTypeSelector } from "@/components/map/ride-type-selector"
import { Map } from "@/components/map/map"
import { PriceEstimate } from "@/components/map/price-estimate"
import { useToast } from "@/hooks/use-toast"

export default function BookRidePage() {
  const { user, token, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [showSearchExpanded, setShowSearchExpanded] = useState(false)
  const [pickupLocation, setPickupLocation] = useState({ address: "", latitude: 0, longitude: 0 })
  const [dropoffLocation, setDropoffLocation] = useState({ address: "", latitude: 0, longitude: 0 })
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isLoadingRide, setIsLoadingRide] = useState(false)
  const [selectedRideType, setSelectedRideType] = useState("economy")
  const [estimatedPrice, setEstimatedPrice] = useState({ min: 0, max: 0 })
  const [estimatedTime, setEstimatedTime] = useState(0)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Simulate location detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would use reverse geocoding to get the address
          setPickupLocation({
            address: "Current Location",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setIsMapLoaded(true)
        },
        () => {
          // Default location if geolocation is denied
          setPickupLocation({
            address: "San Francisco, CA",
            latitude: 37.7749,
            longitude: -122.4194,
          })
          setIsMapLoaded(true)
        },
      )
    }
  }, [])

  // Simulate price calculation when both locations are set
  useEffect(() => {
    if (pickupLocation.latitude && dropoffLocation.latitude) {
      // Calculate distance between points
      const distance = calculateDistance(
        pickupLocation.latitude,
        pickupLocation.longitude,
        dropoffLocation.latitude,
        dropoffLocation.longitude,
      )

      // Simulate price calculation based on distance and ride type
      const basePrice = distance * 1.5
      let multiplier = 1

      switch (selectedRideType) {
        case "economy":
          multiplier = 1
          break
        case "comfort":
          multiplier = 1.3
          break
        case "premium":
          multiplier = 1.8
          break
      }

      const calculatedPrice = basePrice * multiplier
      setEstimatedPrice({
        min: Math.floor(calculatedPrice - calculatedPrice * 0.1),
        max: Math.ceil(calculatedPrice + calculatedPrice * 0.1),
      })

      // Simulate time calculation (1 minute per km + random traffic)
      const timeInMinutes = Math.ceil(distance * 1 + Math.random() * 5)
      setEstimatedTime(timeInMinutes)
    }
  }, [pickupLocation, dropoffLocation, selectedRideType])

  const handleBookRide = async () => {
    if (!pickupLocation.address || !dropoffLocation.address) {
      toast({
        title: "Error",
        description: "Please select pickup and dropoff locations",
        variant: "destructive",
      })
      return
    }

    setIsLoadingRide(true)

    try {
      const response = await fetch("/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pickupLocation,
          dropoffLocation,
          estimatedPrice: (estimatedPrice.min + estimatedPrice.max) / 2,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to book ride")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Your ride has been booked successfully!",
      })

      // In a real app, we would redirect to a ride tracking page
      router.push("/dashboard")
    } catch (error) {
      console.error("Error booking ride:", error)
      toast({
        title: "Error",
        description: "Failed to book your ride. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingRide(false)
    }
  }

  // Helper function to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }

  if (isLoading || !isMapLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Map Section */}
      <div className="relative flex-grow">
        <Map pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} isMapLoaded={isMapLoaded} />

        {/* Location Search Panel */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Where to?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setShowSearchExpanded(true)}>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div className="w-0.5 h-10 bg-gray-300 my-1"></div>
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
                <div className="flex-grow space-y-4">
                  <div className="flex items-center">
                    <Input
                      value={pickupLocation.address}
                      placeholder="Current location"
                      readOnly
                      className="border-none shadow-none focus-visible:ring-0 p-0 text-sm"
                    />
                  </div>
                  <div className="flex items-center">
                    <Input
                      value={dropoffLocation.address}
                      onChange={(e) => setDropoffLocation({ ...dropoffLocation, address: e.target.value })}
                      placeholder="Enter destination"
                      className="border-none shadow-none focus-visible:ring-0 p-0 text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expanded Search Panel */}
        {showSearchExpanded && (
          <div className="absolute inset-0 bg-background z-10">
            <div className="container mx-auto p-4 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" size="sm" onClick={() => setShowSearchExpanded(false)}>
                  <X className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-medium">Select locations</h2>
                <div className="w-8"></div> {/* Empty space for alignment */}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="w-0.5 h-10 bg-gray-300 my-1"></div>
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center">
                      <Input
                        value={pickupLocation.address}
                        onChange={(e) => setPickupLocation({ ...pickupLocation, address: e.target.value })}
                        placeholder="Pickup location"
                        className="border-b border-gray-300 rounded-none"
                      />
                    </div>
                    <div className="flex items-center">
                      <Input
                        value={dropoffLocation.address}
                        onChange={(e) => setDropoffLocation({ ...dropoffLocation, address: e.target.value })}
                        placeholder="Enter destination"
                        className="border-b border-gray-300 rounded-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Sample suggested locations */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Suggested locations</h3>

                  <div
                    className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => {
                      setDropoffLocation({
                        address: "San Francisco Airport (SFO)",
                        latitude: 37.6213,
                        longitude: -122.379,
                      })
                      setShowSearchExpanded(false)
                    }}
                  >
                    <div className="bg-muted p-2 rounded-full">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm">San Francisco Airport (SFO)</p>
                      <p className="text-xs text-muted-foreground">San Francisco, CA 94128</p>
                    </div>
                  </div>

                  <div
                    className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => {
                      setDropoffLocation({
                        address: "Golden Gate Bridge",
                        latitude: 37.8199,
                        longitude: -122.4783,
                      })
                      setShowSearchExpanded(false)
                    }}
                  >
                    <div className="bg-muted p-2 rounded-full">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm">Golden Gate Bridge</p>
                      <p className="text-xs text-muted-foreground">San Francisco, CA</p>
                    </div>
                  </div>

                  <div
                    className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => {
                      setDropoffLocation({
                        address: "Fisherman's Wharf",
                        latitude: 37.808,
                        longitude: -122.4177,
                      })
                      setShowSearchExpanded(false)
                    }}
                  >
                    <div className="bg-muted p-2 rounded-full">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm">Fisherman's Wharf</p>
                      <p className="text-xs text-muted-foreground">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ride Selection Panel */}
        {dropoffLocation.address && !showSearchExpanded && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="mx-auto max-w-md p-4">
              <Card className="w-full shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Select Ride</CardTitle>
                </CardHeader>
                <CardContent>
                  <RideTypeSelector selectedType={selectedRideType} onSelectType={setSelectedRideType} />

                  <div className="mt-4">
                    <PriceEstimate
                      minPrice={estimatedPrice.min}
                      maxPrice={estimatedPrice.max}
                      estimatedTime={estimatedTime}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleBookRide} disabled={isLoadingRide}>
                    {isLoadingRide ? "Finding your ride..." : "Book Ride"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
