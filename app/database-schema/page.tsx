import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DatabaseSchemaPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Database Schema Design</h1>

      <Tabs defaultValue="mongodb">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mongodb">MongoDB (NoSQL)</TabsTrigger>
          <TabsTrigger value="postgresql">PostgreSQL (SQL)</TabsTrigger>
        </TabsList>

        <TabsContent value="mongodb" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Collection</CardTitle>
                <CardDescription>Stores user information for both passengers and drivers</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">
                    {`// User Schema
{
  _id: ObjectId,
  email: String,
  password: String, // Hashed
  name: String,
  phone: String,
  role: String, // "passenger" or "driver"
  profilePicture: String, // URL to image
  rating: Number, // Average rating
  reviews: [
    {
      userId: ObjectId,
      rating: Number,
      comment: String,
      createdAt: Date
    }
  ],
  paymentMethods: [
    {
      type: String, // "credit_card", "paypal", etc.
      details: Object, // Tokenized payment details
      isDefault: Boolean
    }
  ],
  // Driver-specific fields
  driverStatus: {
    isVerified: Boolean,
    isOnline: Boolean,
    documents: [
      {
        type: String, // "license", "insurance", etc.
        url: String,
        verifiedAt: Date
      }
    ]
  },
  vehicleDetails: {
    make: String,
    model: String,
    year: Number,
    color: String,
    licensePlate: String,
    type: String // "economy", "premium", etc.
  },
  currentLocation: {
    type: { type: String, enum: ['Point'] },
    coordinates: [Number] // [longitude, latitude]
  },
  pushToken: String, // For push notifications
  createdAt: Date,
  updatedAt: Date
}`}
                  </code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ride Collection</CardTitle>
                <CardDescription>Stores information about ride requests and trips</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">
                    {`// Ride Schema
{
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User' }, // Passenger
  driver: { type: ObjectId, ref: 'User' }, // Driver
  status: String, // "pending", "accepted", "in_progress", "completed", "cancelled"
  pickupLocation: {
    address: String,
    coordinates: {
      type: { type: String, enum: ['Point'] },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  dropoffLocation: {
    address: String,
    coordinates: {
      type: { type: String, enum: ['Point'] },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  route: {
    distance: Number, // in meters
    duration: Number, // in seconds
    polyline: String // Encoded polyline
  },
  driverLocation: {
    type: { type: String, enum: ['Point'] },
    coordinates: [Number] // [longitude, latitude]
  },
  estimatedPrice: Number,
  finalPrice: Number,
  paymentMethod: {
    type: String,
    details: Object
  },
  paymentStatus: String, // "pending", "completed", "failed"
  ratings: {
    fromPassenger: {
      rating: Number,
      comment: String,
      createdAt: Date
    },
    fromDriver: {
      rating: Number,
      comment: String,
      createdAt: Date
    }
  },
  createdAt: Date,
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  lastLocationUpdate: Date
}`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="postgresql" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SQL Schema</CardTitle>
                <CardDescription>Relational database schema for the ride-sharing app</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">
                    {`-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('passenger', 'driver')),
  profile_picture VARCHAR(255),
  rating DECIMAL(3, 2),
  push_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Driver Details Table
CREATE TABLE driver_details (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_year INTEGER,
  vehicle_color VARCHAR(50),
  license_plate VARCHAR(20),
  vehicle_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Driver Documents Table
CREATE TABLE driver_documents (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER REFERENCES driver_details(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_url VARCHAR(255) NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Methods Table
CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  payment_type VARCHAR(50) NOT NULL,
  payment_details JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations Table (for current locations)
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geospatial index
ALTER TABLE locations ADD COLUMN geom GEOGRAPHY(POINT);
UPDATE locations SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography;
CREATE INDEX locations_geom_idx ON locations USING GIST(geom);

-- Rides Table
CREATE TABLE rides (
  id SERIAL PRIMARY KEY,
  passenger_id INTEGER REFERENCES users(id),
  driver_id INTEGER REFERENCES users(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  pickup_address VARCHAR(255) NOT NULL,
  pickup_latitude DECIMAL(10, 7) NOT NULL,
  pickup_longitude DECIMAL(10, 7) NOT NULL,
  dropoff_address VARCHAR(255) NOT NULL,
  dropoff_latitude DECIMAL(10, 7) NOT NULL,
  dropoff_longitude DECIMAL(10, 7) NOT NULL,
  distance_meters INTEGER,
  duration_seconds INTEGER,
  route_polyline TEXT,
  estimated_price DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  payment_method_id INTEGER REFERENCES payment_methods(id),
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP
);

-- Add geospatial columns and indexes for rides
ALTER TABLE rides ADD COLUMN pickup_geom GEOGRAPHY(POINT);
ALTER TABLE rides ADD COLUMN dropoff_geom GEOGRAPHY(POINT);
UPDATE rides SET pickup_geom = ST_SetSRID(ST_MakePoint(pickup_longitude, pickup_latitude), 4326)::geography;
UPDATE rides SET dropoff_geom = ST_SetSRID(ST_MakePoint(dropoff_longitude, dropoff_latitude), 4326)::geography;
CREATE INDEX rides_pickup_geom_idx ON rides USING GIST(pickup_geom);
CREATE INDEX rides_dropoff_geom_idx ON rides USING GIST(dropoff_geom);

-- Ratings Table
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  ride_id INTEGER REFERENCES rides(id) ON DELETE CASCADE,
  rater_id INTEGER REFERENCES users(id),
  ratee_id INTEGER REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ride Location Updates Table (for tracking driver location during ride)
CREATE TABLE ride_location_updates (
  id SERIAL PRIMARY KEY,
  ride_id INTEGER REFERENCES rides(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
