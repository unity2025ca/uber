import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "../auth/middleware"
import { z } from "zod"
import { db } from "@/lib/db"

// Validation schema for ride booking
const rideSchema = z.object({
  pickupLocation: z.object({
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  dropoffLocation: z.object({
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  estimatedPrice: z.number(),
  paymentMethodId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  // Authenticate user
  const { authenticated, user } = await authenticateUser(req)

  if (!authenticated || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Validate request body
    const result = rideSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { pickupLocation, dropoffLocation, estimatedPrice, paymentMethodId } = result.data

    // Create ride
    const ride = await db.ride.create({
      data: {
        userId: user.id,
        status: "pending",
        pickupAddress: pickupLocation.address,
        pickupLatitude: pickupLocation.latitude,
        pickupLongitude: pickupLocation.longitude,
        dropoffAddress: dropoffLocation.address,
        dropoffLatitude: dropoffLocation.latitude,
        dropoffLongitude: dropoffLocation.longitude,
        estimatedPrice,
        paymentMethodId,
      },
    })

    // Find nearby drivers (simplified example)
    // In a real app, you would use geospatial queries
    const nearbyDrivers = await db.user.findMany({
      where: {
        role: "driver",
        driverDetails: {
          isOnline: true,
        },
      },
      take: 5,
    })

    // In a real app, you would send notifications to nearby drivers

    return NextResponse.json({
      message: "Ride booked successfully",
      ride,
      driversNotified: nearbyDrivers.length,
    })
  } catch (error) {
    console.error("Ride booking error:", error)
    return NextResponse.json({ error: "Failed to book ride" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Authenticate user
  const { authenticated, user } = await authenticateUser(req)

  if (!authenticated || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get user's rides
    const rides = await db.ride.findMany({
      where: {
        OR: [{ userId: user.id }, { driverId: user.id }],
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ rides })
  } catch (error) {
    console.error("Get rides error:", error)
    return NextResponse.json({ error: "Failed to get rides" }, { status: 500 })
  }
}
