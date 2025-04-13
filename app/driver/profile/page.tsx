"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Star, UserIcon, Car, CreditCard, Check } from "lucide-react"
import { Loader } from "@/components/map/loader"
import { useToast } from "@/hooks/use-toast"

export default function DriverProfilePage() {
  const router = useRouter()
  const { user, token, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Driver profile data
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    rating: 0,
    totalRides: 0,
    joinedDate: "",
    accountStatus: "verified", // "pending", "verified", "suspended"
    vehicle: {
      make: "",
      model: "",
      year: "",
      color: "",
      licensePlate: "",
    },
    documents: [
      { type: "driver_license", status: "verified", expiryDate: "2025-06-15" },
      { type: "vehicle_registration", status: "verified", expiryDate: "2023-12-31" },
      { type: "insurance", status: "verified", expiryDate: "2024-02-28" },
      { type: "background_check", status: "verified", expiryDate: null },
    ],
    bankAccount: {
      type: "bank_account",
      last4: "6789",
      name: "Chase Bank",
    },
  })

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "driver")) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Simulate fetching profile data
  useEffect(() => {
    if (!token || authLoading) return

    // Simulate API call
    setTimeout(() => {
      setProfile({
        ...profile,
        name: user?.name || "John Driver",
        email: user?.email || "john.driver@example.com",
        phone: user?.phone || "+1 (555) 123-4567",
        rating: 4.8,
        totalRides: 142,
        joinedDate: "2023-01-15",
        vehicle: {
          make: "Toyota",
          model: "Camry",
          year: "2020",
          color: "Silver",
          licensePlate: "ABC123",
        },
      })
      setIsLoading(false)
    }, 1000)
  }, [token, authLoading, user])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateVehicle = async (e) => {
    e.preventDefault()

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Vehicle Information Updated",
        description: "Your vehicle information has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating vehicle info:", error)
      toast({
        title: "Error",
        description: "Failed to update vehicle information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Verified
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Expired
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    )
  }

  if (!user || user.role !== "driver") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Driver Profile</h1>
          <p className="text-muted-foreground">Manage your account and vehicle information</p>
        </div>

        <Button variant="outline" onClick={() => router.push("/driver/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-2">{profile.name}</CardTitle>
              <CardDescription>Driver since {new Date(profile.joinedDate).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="text-lg font-bold">{profile.rating}</span>
                <span className="text-sm text-muted-foreground ml-2">({profile.totalRides} rides)</span>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Account Status</div>
                  <div>{getStatusBadge(profile.accountStatus)}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="text-sm">{profile.email}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="text-sm">{profile.phone}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="text-sm font-medium">Vehicle</div>
                <div className="text-sm">
                  {profile.vehicle.color} {profile.vehicle.make} {profile.vehicle.model} ({profile.vehicle.year})
                </div>
                <div className="text-sm font-medium">{profile.vehicle.licensePlate}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" onClick={handleUpdateProfile} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="vehicle" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                  <CardDescription>Update your vehicle details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateVehicle}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="make">Make</Label>
                          <Input
                            id="make"
                            value={profile.vehicle.make}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                vehicle: { ...profile.vehicle, make: e.target.value },
                              })
                            }
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="model">Model</Label>
                          <Input
                            id="model"
                            value={profile.vehicle.model}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                vehicle: { ...profile.vehicle, model: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="year">Year</Label>
                          <Input
                            id="year"
                            value={profile.vehicle.year}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                vehicle: { ...profile.vehicle, year: e.target.value },
                              })
                            }
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="color">Color</Label>
                          <Input
                            id="color"
                            value={profile.vehicle.color}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                vehicle: { ...profile.vehicle, color: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="licensePlate">License Plate</Label>
                        <Input
                          id="licensePlate"
                          value={profile.vehicle.licensePlate}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              vehicle: { ...profile.vehicle, licensePlate: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" onClick={handleUpdateVehicle} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Manage your driver documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.documents.map((doc) => (
                    <div key={doc.type} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-muted p-2 rounded-full">
                          {doc.type === "driver_license" ? (
                            <UserIcon className="h-5 w-5" />
                          ) : doc.type === "vehicle_registration" ? (
                            <Car className="h-5 w-5" />
                          ) : doc.type === "insurance" ? (
                            <AlertCircle className="h-5 w-5" />
                          ) : (
                            <Check className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{doc.type.replace("_", " ")}</p>
                          {doc.expiryDate && (
                            <p className="text-xs text-muted-foreground">
                              Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(doc.status)}
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center mt-6">
                    <Button variant="outline">Upload New Document</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Manage your payment methods and payout settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Payout Method</h3>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-muted p-2 rounded-full">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{profile.bankAccount.name}</p>
                          <p className="text-sm text-muted-foreground">Account ending in {profile.bankAccount.last4}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Tax Information</h3>
                    <div className="p-4 border rounded-lg">
                      <p className="text-muted-foreground">
                        You need to provide your tax information to continue receiving payments.
                      </p>
                      <Button className="mt-4">Add Tax Information</Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Automatic Deposits</div>
                        <div className="flex items-center">
                          <span className="text-sm text-green-600 mr-2">Enabled</span>
                          <Button variant="outline" size="sm">
                            Disable
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm">Deposit Frequency</div>
                        <div className="flex items-center">
                          <span className="text-sm mr-2">Weekly</span>
                          <Button variant="outline" size="sm">
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
