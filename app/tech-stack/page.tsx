import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TechStackPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Recommended Technology Stack</h1>

      <Tabs defaultValue="frontend">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="frontend">Frontend</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
          <TabsTrigger value="database">Database & Services</TabsTrigger>
        </TabsList>

        <TabsContent value="frontend" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>React Native</CardTitle>
                <CardDescription>Cross-platform mobile development</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  React Native allows you to build mobile apps using JavaScript and React. It's ideal for creating a
                  consistent experience across iOS and Android with a single codebase.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Faster development cycle</li>
                  <li>Large community and ecosystem</li>
                  <li>Native performance</li>
                  <li>Code reusability</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flutter</CardTitle>
                <CardDescription>Google's UI toolkit</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Flutter is Google's UI toolkit for building natively compiled applications. It offers excellent
                  performance and beautiful UI components.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Fast rendering</li>
                  <li>Consistent UI across platforms</li>
                  <li>Hot reload for quick iterations</li>
                  <li>Rich widget library</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backend" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Node.js with Express</CardTitle>
                <CardDescription>JavaScript backend framework</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Node.js with Express provides a robust backend solution that's perfect for real-time applications like
                  ride-sharing platforms.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Asynchronous and event-driven</li>
                  <li>Excellent for real-time applications</li>
                  <li>Same language as frontend (JavaScript)</li>
                  <li>Large ecosystem of packages</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Firebase</CardTitle>
                <CardDescription>Backend-as-a-Service</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Firebase offers a complete backend solution with authentication, real-time database, cloud functions,
                  and more.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Real-time data synchronization</li>
                  <li>Built-in authentication</li>
                  <li>Cloud functions for serverless logic</li>
                  <li>Push notifications</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>MongoDB</CardTitle>
                <CardDescription>NoSQL Database</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  MongoDB is a flexible NoSQL database that works well for applications with complex, evolving data
                  structures.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Flexible schema</li>
                  <li>Horizontal scaling</li>
                  <li>JSON-like documents</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PostgreSQL</CardTitle>
                <CardDescription>Relational Database</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  PostgreSQL offers robust relational data storage with geospatial capabilities perfect for
                  location-based services.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>ACID compliance</li>
                  <li>PostGIS extension for geospatial data</li>
                  <li>Strong data integrity</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Google Maps API</CardTitle>
                <CardDescription>Mapping Services</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Essential for providing mapping, directions, distance calculations, and geocoding in your ride-sharing
                  app.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Accurate maps and navigation</li>
                  <li>Distance matrix API</li>
                  <li>Geocoding and reverse geocoding</li>
                  <li>Places API</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
