"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CodeExamplesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Code Examples</h1>

      <Tabs defaultValue="auth">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="maps">Maps Integration</TabsTrigger>
          <TabsTrigger value="booking">Ride Booking</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="auth" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Authentication</CardTitle>
              <CardDescription>React Native example for user registration</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    try {
      // Validate inputs
      if (!email || !password || !name || !phone) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // Call your API to register the user
      const response = await fetch('https://your-api.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          phone,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        // Navigate to login or home screen
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;`}
                </code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maps" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Google Maps Integration</CardTitle>
              <CardDescription>React Native example for implementing maps</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleBookRide = () => {
    if (!destination) {
      alert('Please select a destination');
      return;
    }
    
    // Navigate to booking confirmation screen
    // or show booking modal
    alert('Booking ride to ' + destination.description);
  };

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <GooglePlacesAutocomplete
              placeholder="Where to?"
              onPress={(data, details = null) => {
                setDestination({
                  description: data.description,
                  location: {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  }
                });
              }}
              query={{
                key: 'YOUR_GOOGLE_MAPS_API_KEY',
                language: 'en',
              }}
              styles={{
                container: {
                  position: 'absolute',
                  top: 10,
                  width: '100%',
                  zIndex: 1,
                },
                textInputContainer: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                },
                textInput: {
                  marginLeft: 0,
                  marginRight: 0,
                  height: 45,
                  color: '#5d5d5d',
                  fontSize: 16,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: '#ddd',
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
              }}
            />
          </View>

          {location && (
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={location}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Your Location"
              />
              
              {destination && destination.location && (
                <Marker
                  coordinate={{
                    latitude: destination.location.latitude,
                    longitude: destination.location.longitude,
                  }}
                  title={destination.description}
                  pinColor="#0066ff"
                />
              )}
            </MapView>
          )}

          {destination && (
            <TouchableOpacity style={styles.bookButton} onPress={handleBookRide}>
              <Text style={styles.bookButtonText}>Book Ride</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
    top: 20,
    zIndex: 1,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  bookButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;`}
                </code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ride Booking Backend</CardTitle>
              <CardDescription>Node.js/Express example for ride booking API</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`// routes/rides.js
import express from 'express';
import { auth } from '../middleware/auth.js';
import Ride from '../models/Ride.js';
import User from '../models/User.js';
import { sendPushNotification } from '../utils/notifications.js';

const router = express.Router();

// Book a new ride
router.post('/book', auth, async (req, res) => {
  try {
    const {
      pickupLocation,
      dropoffLocation,
      estimatedPrice,
      paymentMethod
    } = req.body;

    // Validate request
    if (!pickupLocation || !dropoffLocation) {
      return res.status(400).json({ message: 'Pickup and dropoff locations are required' });
    }

    // Create new ride
    const newRide = new Ride({
      user: req.user.id,
      pickupLocation,
      dropoffLocation,
      estimatedPrice,
      paymentMethod,
      status: 'pending'
    });

    await newRide.save();

    // Find nearby drivers and notify them
    const nearbyDrivers = await User.find({
      role: 'driver',
      isOnline: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickupLocation.longitude, pickupLocation.latitude]
          },
          $maxDistance: 5000 // 5km radius
        }
      }
    });

    // Send push notifications to nearby drivers
    for (const driver of nearbyDrivers) {
      await sendPushNotification(
        driver.pushToken,
        'New Ride Request',
        'A new ride is available near you',
        {
          rideId: newRide._id.toString(),
          type: 'new_ride'
        }
      );
    }

    res.status(201).json({
      message: 'Ride booked successfully',
      ride: newRide,
      driversNotified: nearbyDrivers.length
    });
  } catch (error) {
    console.error('Error booking ride:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ride by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('user', 'name profilePicture rating')
      .populate('driver', 'name profilePicture rating vehicleDetails');

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user is authorized to view this ride
    if (
      ride.user._id.toString() !== req.user.id &&
      (ride.driver && ride.driver._id.toString() !== req.user.id) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(ride);
  } catch (error) {
    console.error('Error fetching ride:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Driver accepts a ride
router.post('/:id/accept', auth, async (req, res) => {
  try {
    // Check if user is a driver
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Only drivers can accept rides' });
    }

    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({ message: \`Ride is already \${ride.status}\` });
    }

    // Update ride with driver info
    ride.driver = req.user.id;
    ride.status = 'accepted';
    ride.acceptedAt = new Date();
    
    await ride.save();

    // Notify passenger
    const passenger = await User.findById(ride.user);
    await sendPushNotification(
      passenger.pushToken,
      'Ride Accepted',
      'A driver has accepted your ride request',
      {
        rideId: ride._id.toString(),
        type: 'ride_accepted'
      }
    );

    res.json({ message: 'Ride accepted successfully', ride });
  } catch (error) {
    console.error('Error accepting ride:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;`}
                </code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>WebSocket implementation for real-time ride tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`// Server-side WebSocket implementation (Node.js)
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Ride from '../models/Ride.js';

export default function setupWebSockets(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.id);
    
    // Join user to their own room for private messages
    socket.join(socket.user.id);
    
    // Driver location updates
    socket.on('updateLocation', async (data) => {
      try {
        const { latitude, longitude, rideId } = data;
        
        if (!rideId) return;
        
        // Verify this driver is assigned to this ride
        const ride = await Ride.findById(rideId);
        
        if (!ride || ride.driver.toString() !== socket.user.id) {
          return;
        }
        
        // Update driver location in database
        await Ride.findByIdAndUpdate(rideId, {
          driverLocation: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          lastLocationUpdate: new Date()
        });
        
        // Emit location update to passenger
        io.to(ride.user.toString()).emit('driverLocation', {
          rideId,
          latitude,
          longitude,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error updating location:', error);
      }
    });
    
    // Ride status updates
    socket.on('updateRideStatus', async (data) => {
      try {
        const { rideId, status } = data;
        
        const ride = await Ride.findById(rideId);
        
        if (!ride) return;
        
        // Check authorization
        const isDriver = ride.driver && ride.driver.toString() === socket.user.id;
        const isPassenger = ride.user.toString() === socket.user.id;
        
        if (!isDriver && !isPassenger) {
          return;
        }
        
        // Only drivers can update certain statuses
        if (['in_progress', 'arrived', 'completed'].includes(status) && !isDriver) {
          return;
        }
        
        // Update ride status
        ride.status = status;
        
        if (status === 'in_progress') {
          ride.startedAt = new Date();
        } else if (status === 'completed') {
          ride.completedAt = new Date();
        }
        
        await ride.save();
        
        // Notify both passenger and driver
        io.to(ride.user.toString()).emit('rideStatusUpdate', {
          rideId,
          status,
          timestamp: new Date()
        });
        
        if (ride.driver) {
          io.to(ride.driver.toString()).emit('rideStatusUpdate', {
            rideId,
            status,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Error updating ride status:', error);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.id);
    });
  });

  return io;
}

// Client-side implementation (React Native)
import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RideTrackingScreen = ({ route }) => {
  const { rideId } = route.params;
  const socketRef = useRef(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [rideStatus, setRideStatus] = useState('pending');

  useEffect(() => {
    const connectSocket = async () => {
      try {
        // Get auth token from storage
        const token = await AsyncStorage.getItem('userToken');
        
        // Initialize socket connection
        const socket = io('https://your-api-server.com', {
          auth: { token }
        });
        
        socketRef.current = socket;
        
        // Listen for driver location updates
        socket.on('driverLocation', (data) => {
          if (data.rideId === rideId) {
            setDriverLocation({
              latitude: data.latitude,
              longitude: data.longitude,
              timestamp: data.timestamp
            });
          }
        });
        
        // Listen for ride status updates
        socket.on('rideStatusUpdate', (data) => {
          if (data.rideId === rideId) {
            setRideStatus(data.status);
            
            // Handle different status updates
            switch (data.status) {
              case 'accepted':
                Alert.alert('Driver is on the way!');
                break;
              case 'arrived':
                Alert.alert('Driver has arrived at your pickup location');
                break;
              case 'in_progress':
                Alert.alert('Your ride has started');
                break;
              case 'completed':
                Alert.alert('Ride completed', 'Thank you for riding with us!');
                // Navigate to rating screen
                break;
            }
          }
        });
        
        // Handle connection errors
        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });
        
        return () => {
          // Clean up socket connection
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        };
      } catch (error) {
        console.error('Error setting up socket:', error);
      }
    };
    
    connectSocket();
  }, [rideId]);
  
  // Function to update passenger's location
  const updateMyLocation = (latitude, longitude) => {
    if (socketRef.current) {
      socketRef.current.emit('updatePassengerLocation', {
        rideId,
        latitude,
        longitude
      });
    }
  };
  
  // Function to cancel ride
  const cancelRide = () => {
    if (socketRef.current) {
      socketRef.current.emit('updateRideStatus', {
        rideId,
        status: 'cancelled'
      });
      // Navigate back to home screen
    }
  };
  
  return (
    <View>
      {/* Implement your map and UI components here */}
      <Text>Ride Status: {rideStatus}</Text>
      {/* Cancel button, map view, etc. */}
    </View>
  );
};

export default RideTrackingScreen;`}
                </code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
