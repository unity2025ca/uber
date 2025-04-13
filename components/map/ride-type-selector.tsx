"use client"

import { Car, Truck, Crown } from "lucide-react"

interface RideTypeSelectorProps {
  selectedType: string
  onSelectType: (type: string) => void
}

export function RideTypeSelector({ selectedType, onSelectType }: RideTypeSelectorProps) {
  const rideTypes = [
    {
      id: "economy",
      name: "Economy",
      description: "Affordable, everyday rides",
      icon: Car,
      eta: "3 min",
    },
    {
      id: "comfort",
      name: "Comfort",
      description: "Newer cars with extra legroom",
      icon: Truck,
      eta: "5 min",
    },
    {
      id: "premium",
      name: "Premium",
      description: "Luxury cars with top-rated drivers",
      icon: Crown,
      eta: "8 min",
    },
  ]

  return (
    <div className="space-y-2">
      {rideTypes.map((rideType) => (
        <div
          key={rideType.id}
          className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-colors ${
            selectedType === rideType.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
          }`}
          onClick={() => onSelectType(rideType.id)}
        >
          <div className="bg-background p-2 rounded-full shadow">
            <rideType.icon className="h-6 w-6" />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <p className="font-medium">{rideType.name}</p>
              <p className="text-sm">{rideType.eta}</p>
            </div>
            <p className="text-xs text-muted-foreground">{rideType.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
