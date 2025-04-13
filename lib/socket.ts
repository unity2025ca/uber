"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

// This would be your WebSocket server URL in production
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!token) return

    // Initialize socket connection
    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
    })

    // Set up event listeners
    socketInstance.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setIsConnected(false)
    })

    // Save socket instance
    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [token])

  return { socket, isConnected }
}

export function useRideUpdates(socket: Socket | null, rideId: string | null) {
  const [driverLocation, setDriverLocation] = useState<{
    latitude: number
    longitude: number
    timestamp: Date
  } | null>(null)

  const [rideStatus, setRideStatus] = useState<string | null>(null)

  const [driverInfo, setDriverInfo] = useState<{
    id: string
    name: string
    phone: string
    rating: number
    vehicle?: {
      make: string
      model: string
      color: string
      licensePlate: string
    }
  } | null>(null)

  useEffect(() => {
    if (!socket || !rideId) return

    // Listen for driver location updates
    socket.on("driverLocation", (data) => {
      if (data.rideId === rideId) {
        setDriverLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: new Date(data.timestamp),
        })
      }
    })

    // Listen for ride status updates
    socket.on("rideStatusUpdate", (data) => {
      if (data.rideId === rideId) {
        setRideStatus(data.status)
      }
    })

    // Listen for driver assignments
    socket.on("driverAssigned", (data) => {
      if (data.rideId === rideId) {
        setDriverInfo(data.driver)
      }
    })

    return () => {
      socket.off("driverLocation")
      socket.off("rideStatusUpdate")
      socket.off("driverAssigned")
    }
  }, [socket, rideId])

  // Method to update passenger location
  const updatePassengerLocation = (latitude: number, longitude: number) => {
    if (socket && rideId) {
      socket.emit("updatePassengerLocation", {
        rideId,
        latitude,
        longitude,
      })
    }
  }

  // Method to update ride status
  const updateRideStatus = (status: string) => {
    if (socket && rideId) {
      socket.emit("updateRideStatus", {
        rideId,
        status,
      })
    }
  }

  return {
    driverLocation,
    rideStatus,
    driverInfo,
    updatePassengerLocation,
    updateRideStatus,
  }
}
