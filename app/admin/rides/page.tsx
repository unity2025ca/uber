"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, MoreHorizontal, Download, Filter, MapPin, DollarSign } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

export default function AdminRidesPage() {
  const router = useRouter()
  const [rides, setRides] = useState([])
  const [filteredRides, setFilteredRides] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const ridesPerPage = 10

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // Simulate API call with setTimeout
    const fetchRides = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockRides = generateMockRides(50)
        setRides(mockRides)
        setFilteredRides(mockRides)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching rides:", error)
        setIsLoading(false)
      }
    }

    fetchRides()
  }, [])

  useEffect(() => {
    // Filter rides based on search query and active tab
    let filtered = [...rides]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ride) =>
          ride.passenger.name.toLowerCase().includes(query) ||
          ride.driver?.name.toLowerCase().includes(query) ||
          ride.pickupLocation.toLowerCase().includes(query) ||
          ride.dropoffLocation.toLowerCase().includes(query) ||
          ride.id.toLowerCase().includes(query),
      )
    }

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter((ride) => ride.status === activeTab)
    }

    setFilteredRides(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, activeTab, rides])

  const generateMockRides = (count) => {
    const statuses = ["pending", "accepted", "in_progress", "completed", "cancelled"]
    const locations = [
      { pickup: "123 Main St, San Francisco", dropoff: "456 Market St, San Francisco" },
      { pickup: "789 Mission St, San Francisco", dropoff: "101 Valencia St, San Francisco" },
      { pickup: "555 Howard St, San Francisco", dropoff: "222 Brannan St, San Francisco" },
      { pickup: "333 Folsom St, San Francisco", dropoff: "444 Harrison St, San Francisco" },
      { pickup: "777 Bryant St, San Francisco", dropoff: "888 Townsend St, San Francisco" },
    ]

    return Array.from({ length: count }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))

      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const location = locations[Math.floor(Math.random() * locations.length)]
      const fare = (10 + Math.random() * 40).toFixed(2)

      return {
        id: `ride-${i + 1}`,
        passenger: {
          id: `passenger-${i + 1}`,
          name: `Passenger ${i + 1}`,
        },
        driver:
          status !== "pending"
            ? {
                id: `driver-${i + 1}`,
                name: `Driver ${i + 1}`,
              }
            : null,
        pickupLocation: location.pickup,
        dropoffLocation: location.dropoff,
        status,
        fare: Number.parseFloat(fare),
        date: date.toISOString(),
        duration: Math.floor(10 + Math.random() * 30), // 10-40 minutes
        distance: (1 + Math.random() * 10).toFixed(1), // 1-11 miles
      }
    })
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Pagination
  const indexOfLastRide = currentPage * ridesPerPage
  const indexOfFirstRide = indexOfLastRide - ridesPerPage
  const currentRides = filteredRides.slice(indexOfFirstRide, indexOfLastRide)
  const totalPages = Math.ceil(filteredRides.length / ridesPerPage)

  const getRideStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Accepted
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            In Progress
          </Badge>
        )
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
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading rides...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rides</h1>
          <p className="text-muted-foreground">Monitor and manage all rides on the platform</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Ride Management</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search rides..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Rides</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Passenger</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fare</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentRides.length > 0 ? (
                      currentRides.map((ride) => (
                        <TableRow key={ride.id}>
                          <TableCell className="font-medium">{ride.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${ride.passenger.name}`}
                                />
                                <AvatarFallback>{ride.passenger.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{ride.passenger.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {ride.driver ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${ride.driver.name}`}
                                  />
                                  <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{ride.driver.name}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center text-xs">
                                <MapPin className="h-3 w-3 mr-1 text-green-500" />
                                <span className="truncate max-w-[150px]">{ride.pickupLocation}</span>
                              </div>
                              <div className="flex items-center text-xs mt-1">
                                <MapPin className="h-3 w-3 mr-1 text-red-500" />
                                <span className="truncate max-w-[150px]">{ride.dropoffLocation}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getRideStatusBadge(ride.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                              <span>{ride.fare.toFixed(2)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(ride.date), "MMM d, yyyy")}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => router.push(`/admin/rides/${ride.id}`)}>
                                  View Details
                                </DropdownMenuItem>
                                {ride.status === "pending" && <DropdownMenuItem>Assign Driver</DropdownMenuItem>}
                                {(ride.status === "pending" || ride.status === "accepted") && (
                                  <DropdownMenuItem className="text-red-600">Cancel Ride</DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Contact Passenger</DropdownMenuItem>
                                {ride.driver && <DropdownMenuItem>Contact Driver</DropdownMenuItem>}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No rides found. Try adjusting your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredRides.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {indexOfFirstRide + 1}-
                    {indexOfLastRide > filteredRides.length ? filteredRides.length : indexOfLastRide} of{" "}
                    {filteredRides.length} rides
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
