"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Car, CreditCard, TrendingUp, TrendingDown, AlertCircle, Clock } from "lucide-react"
import { AdminMetricCard } from "@/components/admin/admin-metric-card"
import { AdminRecentActivity } from "@/components/admin/admin-recent-activity"
import { AdminChart } from "@/components/admin/admin-chart"

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalRides: 0,
    totalRevenue: 0,
    activeDrivers: 0,
    pendingRides: 0,
    completedRides: 0,
    cancelledRides: 0,
    averageRating: 0,
  })

  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // Simulate API call with setTimeout
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setMetrics({
          totalUsers: 1248,
          totalRides: 5672,
          totalRevenue: 28456.78,
          activeDrivers: 89,
          pendingRides: 12,
          completedRides: 5624,
          cancelledRides: 36,
          averageRating: 4.8,
        })

        setRecentActivity(generateMockActivity())
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const generateMockActivity = () => {
    const now = new Date()
    return [
      {
        id: "act1",
        type: "user_registered",
        user: {
          id: "user1",
          name: "John Smith",
          email: "john.smith@example.com",
          role: "passenger",
        },
        timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      },
      {
        id: "act2",
        type: "ride_completed",
        user: {
          id: "user2",
          name: "Alice Johnson",
          role: "passenger",
        },
        driver: {
          id: "driver1",
          name: "Bob Driver",
        },
        amount: 24.5,
        timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      },
      {
        id: "act3",
        type: "ride_cancelled",
        user: {
          id: "user3",
          name: "Emma Wilson",
          role: "passenger",
        },
        reason: "Driver took too long to arrive",
        timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: "act4",
        type: "driver_approved",
        user: {
          id: "driver2",
          name: "Michael Driver",
          role: "driver",
        },
        timestamp: new Date(now.getTime() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      },
      {
        id: "act5",
        type: "support_ticket",
        user: {
          id: "user4",
          name: "Sarah Parker",
          role: "passenger",
        },
        subject: "Payment issue",
        status: "open",
        timestamp: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      },
    ]
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your platform's performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Data</Button>
          <Button>Refresh</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Total Users"
          value={metrics.totalUsers}
          icon={<Users className="h-5 w-5" />}
          trend={12}
          trendLabel="from last month"
        />
        <AdminMetricCard
          title="Total Rides"
          value={metrics.totalRides}
          icon={<Car className="h-5 w-5" />}
          trend={8}
          trendLabel="from last month"
        />
        <AdminMetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon={<CreditCard className="h-5 w-5" />}
          trend={15}
          trendLabel="from last month"
        />
        <AdminMetricCard
          title="Active Drivers"
          value={metrics.activeDrivers}
          icon={<Users className="h-5 w-5" />}
          trend={-3}
          trendLabel="from last month"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily revenue for the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="rides">Rides</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              <TabsContent value="revenue">
                <AdminChart type="revenue" />
              </TabsContent>
              <TabsContent value="rides">
                <AdminChart type="rides" />
              </TabsContent>
              <TabsContent value="users">
                <AdminChart type="users" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminRecentActivity activities={recentActivity} />
          </CardContent>
        </Card>
      </div>

      {/* Ride Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Pending Rides</CardTitle>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {metrics.pendingRides}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="text-sm text-muted-foreground">Awaiting drivers</span>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Completed Rides</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {metrics.completedRides}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  {((metrics.completedRides / metrics.totalRides) * 100).toFixed(1)}% completion rate
                </span>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Cancelled Rides</CardTitle>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {metrics.cancelledRides}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                <span className="text-sm text-muted-foreground">
                  {((metrics.cancelledRides / metrics.totalRides) * 100).toFixed(1)}% cancellation rate
                </span>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues and Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Issues Requiring Attention</CardTitle>
          <CardDescription>Recent issues that need your review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Payment Dispute</h4>
                    <p className="text-sm text-muted-foreground">
                      User claims they were charged incorrectly for ride #5789
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    High Priority
                  </Badge>
                </div>
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="bg-yellow-100 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Driver Verification Pending</h4>
                    <p className="text-sm text-muted-foreground">
                      5 driver applications awaiting document verification
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Medium Priority
                  </Badge>
                </div>
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">System Maintenance</h4>
                    <p className="text-sm text-muted-foreground">Scheduled database maintenance in 2 days</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Low Priority
                  </Badge>
                </div>
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
