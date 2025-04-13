"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminChart } from "@/components/admin/admin-chart"
import { AdminMetricCard } from "@/components/admin/admin-metric-card"
import { Download, Users, Car, CreditCard, MapPin } from "lucide-react"

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({
    revenue: {
      total: 0,
      growth: 0,
      averagePerRide: 0,
    },
    rides: {
      total: 0,
      growth: 0,
      completionRate: 0,
    },
    users: {
      total: 0,
      growth: 0,
      activeRate: 0,
    },
    topLocations: [],
  })

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // Simulate API call with setTimeout
    const fetchAnalytics = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setAnalyticsData({
          revenue: {
            total: 28456.78,
            growth: 15.2,
            averagePerRide: 24.35,
          },
          rides: {
            total: 5672,
            growth: 8.7,
            completionRate: 94.5,
          },
          users: {
            total: 1248,
            growth: 12.3,
            activeRate: 68.2,
          },
          topLocations: [
            { name: "Downtown", count: 1245, percentage: 22 },
            { name: "Financial District", count: 987, percentage: 17 },
            { name: "Mission District", count: 876, percentage: 15 },
            { name: "SoMa", count: 754, percentage: 13 },
            { name: "Marina", count: 543, percentage: 10 },
          ],
        })
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const handleTimeRangeChange = (value) => {
    setTimeRange(value)
    setIsLoading(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading analytics data...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Insights and statistics about your platform</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminMetricCard
          title="Total Revenue"
          value={`$${analyticsData.revenue.total.toLocaleString()}`}
          icon={<CreditCard className="h-5 w-5" />}
          trend={analyticsData.revenue.growth}
          trendLabel="from previous period"
        />
        <AdminMetricCard
          title="Total Rides"
          value={analyticsData.rides.total.toLocaleString()}
          icon={<Car className="h-5 w-5" />}
          trend={analyticsData.rides.growth}
          trendLabel="from previous period"
        />
        <AdminMetricCard
          title="Total Users"
          value={analyticsData.users.total.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          trend={analyticsData.users.growth}
          trendLabel="from previous period"
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue">
        <TabsList className="mb-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="rides">Rides</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Total revenue for the selected period: ${analyticsData.revenue.total.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <AdminChart type="revenue" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Revenue Per Ride</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${analyticsData.revenue.averagePerRide.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      {analyticsData.revenue.growth > 0 ? "↑" : "↓"} {Math.abs(analyticsData.revenue.growth).toFixed(1)}
                      % from previous period
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Revenue by Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Credit Card</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">PayPal</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Apple Pay</span>
                        <span className="text-sm font-medium">7%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "7%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Revenue by User Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Regular Users</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Business Accounts</span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Premium Users</span>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rides">
          <Card>
            <CardHeader>
              <CardTitle>Ride Statistics</CardTitle>
              <CardDescription>
                Total rides for the selected period: {analyticsData.rides.total.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <AdminChart type="rides" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Ride Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.rides.completionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      {analyticsData.rides.completionRate > 90 ? "Good" : "Needs improvement"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Rides by Time of Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Morning (6am-12pm)</span>
                        <span className="text-sm font-medium">32%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "32%" }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Afternoon (12pm-6pm)</span>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "28%" }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Evening (6pm-12am)</span>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "35%" }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Night (12am-6am)</span>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "5%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Ride Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18 min</div>
                    <p className="text-xs text-muted-foreground">↑ 2% from previous period</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                Total users for the selected period: {analyticsData.users.total.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <AdminChart type="users" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">User Retention Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.users.activeRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      {analyticsData.users.activeRate > 65 ? "Good" : "Needs improvement"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">User Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Passengers</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Drivers</span>
                        <span className="text-sm font-medium">14%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "14%" }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Admins</span>
                        <span className="text-sm font-medium">1%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "1%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">New User Acquisition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">124</div>
                    <p className="text-xs text-muted-foreground">New users this week</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Top Pickup Locations</CardTitle>
          <CardDescription>Most popular areas where rides are requested</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topLocations.map((location, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 text-center font-medium">{index + 1}</div>
                <div className="flex-1 ml-4">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">{location.name}</span>
                    </div>
                    <span className="text-sm">{location.count} rides</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${location.percentage}%` }}></div>
                  </div>
                </div>
                <div className="ml-4 w-12 text-right font-medium">{location.percentage}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
