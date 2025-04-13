import { Button } from "@/components/ui/button"
import { ArrowRight, Car, MapPin, CreditCard, Phone, User, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Ride, Your Way</h1>
              <p className="text-xl mb-8 text-gray-300">
                Request a ride, hop in, and go. It's that simple. Download our app today and experience the future of
                transportation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  <Link href="/login">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <div className="relative">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <div className="w-0.5 h-10 bg-gray-300 my-1"></div>
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      </div>
                      <div className="flex-grow space-y-4">
                        <div className="flex items-center">
                          <input
                            placeholder="Enter pickup location"
                            className="border-b border-gray-300 w-full p-1 text-gray-900 focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            placeholder="Enter destination"
                            className="border-b border-gray-300 w-full p-1 text-gray-900 focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Car className="mr-2 h-4 w-4" />
                      Request Ride
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 bg-primary/10 p-4 rounded-full">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Request a Ride</h3>
              <p className="text-gray-600">
                Open the app and enter your destination. You'll see upfront pricing and estimated arrival time.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 bg-primary/10 p-4 rounded-full">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Match with a Driver</h3>
              <p className="text-gray-600">
                We'll connect you with a nearby driver who will pick you up in minutes and take you to your destination.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 bg-primary/10 p-4 rounded-full">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pay and Go</h3>
              <p className="text-gray-600">
                When you arrive at your destination, payment is automatic. Just hop out and rate your driver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h2 className="text-3xl font-bold mb-6">Become a Driver</h2>
              <p className="text-xl mb-8 text-gray-600">
                Set your own schedule, earn on your terms, and get paid weekly. Start earning by driving with us.
              </p>
              <Button asChild size="lg">
                <Link href="/signup?role=driver">Sign Up to Drive</Link>
              </Button>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-3">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">Competitive Earnings</span>
                  </div>
                  <p className="text-gray-600 text-sm">Earn money on your schedule and cash out when you want.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-3">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">Flexible Schedule</span>
                  </div>
                  <p className="text-gray-600 text-sm">Drive whenever you want — no minimum hours or shifts.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-3">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">Easy App</span>
                  </div>
                  <p className="text-gray-600 text-sm">Our driver app helps you find riders quickly and easily.</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-3">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">Safety First</span>
                  </div>
                  <p className="text-gray-600 text-sm">Driver-friendly policies and 24/7 support for peace of mind.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">RideShare</h3>
              <p className="text-gray-400">Your ride, your way. Anytime, anywhere.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ride</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Sign Up to Ride
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Fare Estimate
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Cities
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Drive</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Become a Driver
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Earnings
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Requirements
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Safety
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">© 2023 RideShare. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
