"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RateRidePage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const rideId = params.id as string

  // Mock data for the example
  const mockDriver = {
    id: "driver123",
    name: "John Driver",
    rating: 4.8,
  }

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleSubmit = async () => {
    if (!token || !user) return

    setIsSubmitting(true)

    try {
      // In a real app, you would send this to your API
      const response = await fetch(`/api/rides/${rideId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          comment,
          rideId,
          rateeId: mockDriver.id, // Who is being rated
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit rating")
      }

      toast({
        title: "Rating Submitted",
        description: "Thank you for your feedback!",
      })

      // Navigate back to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Rate your ride</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${mockDriver.name}`} />
              <AvatarFallback>{mockDriver.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-medium text-lg">{mockDriver.name}</p>
              <p className="text-sm text-muted-foreground">Your driver</p>
            </div>
          </div>

          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => handleRatingChange(star)} className="focus:outline-none">
                <Star className={`h-8 w-8 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
              </button>
            ))}
          </div>

          <div>
            <Textarea
              placeholder="Share your experience with this driver..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
