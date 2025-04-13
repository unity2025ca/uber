"use client"

import { formatDistanceToNow, format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, Calendar, Star, ChevronRight } from "lucide-react"

interface TripCardProps {
  trip: {
    id: string
    date: string
    pickupLocation: string
    dropoffLocation: string
    status: string
    fare: number
    duration: number
    distance: string
    rating: string | null
    driver?: {
      name: string
      rating: string
    }
    passenger?: {
      name: string
      rating: string
    }
  }
  userRole: string
  onClick: () => void
}

export function TripCard({ trip, userRole, onClick }: TripCardProps) {
  const getStatusBadge = (status: string) => {
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

  const otherParty = userRole === "passenger" ? trip.driver : trip.passenger

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(trip.date), { addSuffix: true })}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{format(new Date(trip.date), "MMM d, yyyy")}</span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex flex-col items-center mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <div className="flex-grow space-y-1">
                <div>
                  <p className="text-sm text-muted-foreground">Pickup</p>
                  <p className="text-sm font-medium">{trip.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dropoff</p>
                  <p className="text-sm font-medium">{trip.dropoffLocation}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge(trip.status)}
            <div className="text-lg font-bold">${trip.fare.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="flex items-center space-x-4">
            {otherParty && (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${otherParty.name}`} />
                  <AvatarFallback>{otherParty.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{otherParty.name}</p>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-xs">{otherParty.rating}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{trip.duration} min</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{trip.distance} mi</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
