"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { PaymentForm } from "@/components/payment/payment-form"
import { Loader } from "@/components/map/loader"
import { Check } from "lucide-react"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token, isLoading: authLoading } = useAuth()
  const [ride, setRide] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const rideId = params.rideId as string

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "passenger")) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Simulate fetching ride details
  useEffect(() => {
    if (!token || authLoading) return

    // Simulate API call
    setTimeout(() => {
      setRide({
        id: rideId,
        driver: {
          name: "John Driver",
          rating: 4.8,
        },
        pickupLocation: {
          address: "123 Main St, San Francisco, CA",
        },
        dropoffLocation: {
          address: "456 Market St, San Francisco, CA",
        },
        duration: 18, // minutes
        distance: 5.3, // miles
        fare: 28.5,
        timestamp: new Date().toISOString(),
      })
      setIsLoading(false)
    }, 1000)
  }, [rideId, token, authLoading])

  const handlePaymentSuccess = () => {
    setPaymentComplete(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 3000)
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    )
  }

  if (!user || user.role !== "passenger") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      {paymentComplete ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Complete</h2>
            <p className="text-center text-muted-foreground mb-4">
              Thank you for your payment. Your receipt has been emailed to you.
            </p>
            <div className="text-center text-sm text-muted-foreground">Redirecting to dashboard...</div>
          </CardContent>
        </Card>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h1>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Ride Summary</span>
                  <div className="flex justify-between">
                    <span>From</span>
                    <span className="font-medium">{ride.pickupLocation.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>To</span>
                    <span className="font-medium">{ride.dropoffLocation.address}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base fare</span>
                    <span>${(ride.fare * 0.75).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Distance ({ride.distance.toFixed(1)} miles)</span>
                    <span>${(ride.fare * 0.2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Time ({ride.duration} min)</span>
                    <span>${(ride.fare * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>${ride.fare.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <PaymentForm amount={ride.fare} onSuccess={handlePaymentSuccess} />
        </>
      )}
    </div>
  )
}
