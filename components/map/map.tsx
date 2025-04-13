"use client"

import { useRef, useEffect, useState } from "react"

interface MapProps {
  pickupLocation: {
    address: string
    latitude: number
    longitude: number
  }
  dropoffLocation: {
    address: string
    latitude: number
    longitude: number
  }
  isMapLoaded: boolean
}

export function Map({ pickupLocation, dropoffLocation, isMapLoaded }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapImage, setMapImage] = useState("")

  useEffect(() => {
    if (isMapLoaded && mapRef.current) {
      // In a real app, we would use a mapping library like Google Maps, Mapbox, or Leaflet
      // For this demo, we'll just use a placeholder map image

      // Generate a map centered on the pickup location, or between pickup and dropoff if both exist
      let centerLat, centerLng, zoom

      if (dropoffLocation.latitude && dropoffLocation.longitude) {
        // Center between pickup and dropoff
        centerLat = (pickupLocation.latitude + dropoffLocation.latitude) / 2
        centerLng = (pickupLocation.longitude + dropoffLocation.longitude) / 2
        zoom = 12 // Zoom out to show both points
      } else {
        // Center on pickup
        centerLat = pickupLocation.latitude
        centerLng = pickupLocation.longitude
        zoom = 14 // Closer zoom for single point
      }

      const width = mapRef.current.clientWidth
      const height = mapRef.current.clientHeight

      // Update the map image
      setMapImage(`/placeholder.svg?height=${height}&width=${width}`)
    }
  }, [pickupLocation, dropoffLocation, isMapLoaded])

  return (
    <div ref={mapRef} className="w-full h-full bg-gray-100">
      {/* This would be replaced with an actual map library in a real app */}
      <div className="relative w-full h-full">
        {mapImage && <img src={mapImage || "/placeholder.svg"} alt="Map" className="w-full h-full object-cover" />}

        {/* Pickup marker */}
        {pickupLocation.latitude !== 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-500/20"></div>
              <p className="text-xs font-medium mt-1 bg-white px-2 py-1 rounded-md shadow-sm">Pickup</p>
            </div>
          </div>
        )}

        {/* Dropoff marker */}
        {dropoffLocation.latitude !== 0 && (
          <div className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-500/20"></div>
              <p className="text-xs font-medium mt-1 bg-white px-2 py-1 rounded-md shadow-sm">Dropoff</p>
            </div>
          </div>
        )}

        {/* Route line (simplified) */}
        {dropoffLocation.latitude !== 0 && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <svg width="100%" height="100%">
              <path d="M 50% 50% L 66.67% 33.33%" stroke="black" strokeWidth="3" fill="none" strokeDasharray="5,5" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
