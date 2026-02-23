import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
     View, Text, TouchableOpacity, Alert,
     Animated, ActivityIndicator, Dimensions, ScrollView,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import io from 'socket.io-client';
import { API_URL } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
     ArrowLeft, Truck, MapPin, Phone, Check,
     Clock, Package, Navigation, AlertCircle,
     Star, RotateCcw,
} from 'lucide-react-native';

const { height } = Dimensions.get('window');

// ─── Dummy coordinates (Pune city area) ─────────────────────────
const FALLBACK_DRIVER: Region = {
     latitude: 18.5204,
     longitude: 73.8567,
     latitudeDelta: 0.01,
     longitudeDelta: 0.01,
};
const FALLBACK_CUSTOMER: Region = {
     latitude: 18.5074,
     longitude: 73.8077,
     latitudeDelta: 0.01,
     longitudeDelta: 0.01,
};

// ─── Status timeline ─────────────────────────────────────────────
const STEPS = [
     { title: 'Order Placed', key: 'pending' },
     { title: 'Partner Assigned', key: 'assigned' },
     { title: 'Out for Delivery', key: 'out_for_delivery' },
     { title: 'Delivered', key: 'delivered' },
];

type OrderStatus = 'pending' | 'assigned' | 'out_for_delivery' | 'delivered';

const statusIndex = (s: OrderStatus) => {
     const map: Record<OrderStatus, number> = {
          pending: 0, assigned: 1, out_for_delivery: 2, delivered: 3,
     };
     return map[s] ?? 0;
};

// ─── Map region that fits both markers ──────────────────────────
const fitRegion = (
     driver: { latitude: number; longitude: number },
     customer: { latitude: number; longitude: number }
): Region => {
     const minLat = Math.min(driver.latitude, customer.latitude);
     const maxLat = Math.max(driver.latitude, customer.latitude);
     const minLng = Math.min(driver.longitude, customer.longitude);
     const maxLng = Math.max(driver.longitude, customer.longitude);
     const pad = 0.005;
     return {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: Math.max(maxLat - minLat + pad * 2, 0.015),
          longitudeDelta: Math.max(maxLng - minLng + pad * 2, 0.015),
     };
};

// ─── Custom marker views ──────────────────────────────────────────
const DriverMarkerView = () => (
     <View style={{
          backgroundColor: '#006B44', padding: 8, borderRadius: 20,
          borderWidth: 3, borderColor: '#fff', alignItems: 'center',
          shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
          elevation: 6,
     }}>
          <Truck size={18} color="#fff" />
     </View>
);

const CustomerMarkerView = () => (
     <View style={{
          backgroundColor: '#2563EB', padding: 8, borderRadius: 20,
          borderWidth: 3, borderColor: '#fff', alignItems: 'center',
          shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
          elevation: 6,
     }}>
          <MapPin size={18} color="#fff" />
     </View>
);

// ────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ────────────────────────────────────────────────────────────────
export const TrackingScreen = () => {
     const navigation = useNavigation<any>();
     const route = useRoute<any>();
     const { orderId } = route.params || {};
     const { userRole, user: authUser } = useAuth();

     // ── State ──────────────────────────────────────────────────────
     const [order, setOrder] = useState<any>(null);
     const [status, setStatus] = useState<OrderStatus>('assigned');
     const [eta, setEta] = useState(15);
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

     // Driver & customer coordinates
     const [driverCoord, setDriverCoord] = useState({
          latitude: FALLBACK_DRIVER.latitude,
          longitude: FALLBACK_DRIVER.longitude,
     });
     const [customerCoord, setCustomerCoord] = useState({
          latitude: FALLBACK_CUSTOMER.latitude,
          longitude: FALLBACK_CUSTOMER.longitude,
     });

     // Animated coordinate for smooth marker movement
     const driverAnimated = useRef({
          lat: new Animated.Value(FALLBACK_DRIVER.latitude),
          lng: new Animated.Value(FALLBACK_DRIVER.longitude),
     }).current;

     const mapRef = useRef<MapView>(null);
     const socketRef = useRef<any>(null);

     // Simulated route polyline (straight line for now — real polyline requires Directions API)
     const routeCoords = [driverCoord, customerCoord];

     // ── Permissions ────────────────────────────────────────────────
     useEffect(() => {
          (async () => {
               try {
                    const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
                    const granted = permStatus === 'granted';
                    setLocationPermission(granted);

                    if (granted) {
                         // Get customer's real location as drop-off point
                         const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                         setCustomerCoord({
                              latitude: loc.coords.latitude,
                              longitude: loc.coords.longitude,
                         });
                    }
               } catch {
                    setLocationPermission(false);
               }
          })();
     }, []);

     // ── Animate driver marker smoothly on coord change ─────────────
     const animateDriverTo = useCallback(
          (lat: number, lng: number) => {
               Animated.parallel([
                    Animated.timing(driverAnimated.lat, {
                         toValue: lat,
                         duration: 800,
                         useNativeDriver: false,
                    }),
                    Animated.timing(driverAnimated.lng, {
                         toValue: lng,
                         duration: 800,
                         useNativeDriver: false,
                    }),
               ]).start(() => {
                    setDriverCoord({ latitude: lat, longitude: lng });
               });
          },
          [driverAnimated]
     );

     // ── Fit map to show both markers ──────────────────────────────
     const fitMap = useCallback(() => {
          mapRef.current?.fitToCoordinates(
               [driverCoord, customerCoord],
               {
                    edgePadding: { top: 80, right: 60, bottom: 60, left: 60 },
                    animated: true,
               }
          );
     }, [driverCoord, customerCoord]);

     // ── Order fetch + Socket setup ────────────────────────────────
     useEffect(() => {
          // Fetch order details
          if (orderId && !orderId.startsWith('order-')) {
               fetch(`${API_URL}/orders/${orderId}`)
                    .then(r => r.json())
                    .then(data => {
                         setOrder(data);
                         setStatus(data.status ?? 'assigned');
                         if (data.deliveryLocation?.lat && data.deliveryLocation?.lng) {
                              setCustomerCoord({
                                   latitude: data.deliveryLocation.lat,
                                   longitude: data.deliveryLocation.lng,
                              });
                         }
                    })
                    .catch(() => { /* use defaults */ });
          }

          // Socket for real-time driver location
          const socket = io(API_URL, { transports: ['websocket'] });
          socketRef.current = socket;

          socket.on('connect', () => {
               socket.emit('join_order', orderId);
          });

          socket.on('driver_location', (data: { latitude: number; longitude: number }) => {
               animateDriverTo(data.latitude, data.longitude);
               setEta(prev => Math.max(1, prev - 1));
               // Re-fit map
               setTimeout(() => fitMap(), 900);
          });

          socket.on('order_accepted', () => setStatus('assigned'));
          socket.on('status_update', (data: { status: OrderStatus }) => setStatus(data.status));

          return () => { socket.disconnect(); };
     }, [orderId]);

     // ── Simulate driver movement in demo mode ─────────────────────
     // (Moves every 5 seconds if no real socket data arrives)
     useEffect(() => {
          if (status === 'delivered') return;

          const interval = setInterval(() => {
               // Move driver slightly toward customer
               setDriverCoord(prev => {
                    const latStep = (customerCoord.latitude - prev.latitude) * 0.05;
                    const lngStep = (customerCoord.longitude - prev.longitude) * 0.05;
                    const next = {
                         latitude: prev.latitude + latStep,
                         longitude: prev.longitude + lngStep,
                    };
                    animateDriverTo(next.latitude, next.longitude);
                    setEta(e => Math.max(1, e - 1));
                    return next;
               });
          }, 5000);

          return () => clearInterval(interval);
     }, [customerCoord, status]);

     // ── Mark delivered (delivery partner action) ──────────────────
     const handleMarkDelivered = async () => {
          setIsSubmitting(true);
          try {
               const res = await fetch(`${API_URL}/orders/${orderId}/complete`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ deliveryPartnerId: authUser?.id }),
               });
               if (res.ok) {
                    setStatus('delivered');
                    Alert.alert('✅ Done', 'Order marked as delivered!');
                    socketRef.current?.emit('update_status', { orderId, status: 'delivered' });
               } else {
                    const d = await res.json();
                    Alert.alert('Error', d.message || 'Failed');
               }
          } catch {
               Alert.alert('Error', 'Connection failed');
          } finally {
               setIsSubmitting(false);
          }
     };

     const currentStepIdx = statusIndex(status);
     const mapRegion = fitRegion(driverCoord, customerCoord);

     // ── Pulse animation for "pending" state ───────────────────────
     const pulseAnim = useRef(new Animated.Value(1)).current;
     useEffect(() => {
          if (status === 'pending') {
               Animated.loop(
                    Animated.sequence([
                         Animated.timing(pulseAnim, { toValue: 1.3, duration: 900, useNativeDriver: true }),
                         Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
                    ])
               ).start();
          }
     }, [status]);

     return (
          <View style={{ flex: 1, backgroundColor: '#fff' }}>

               {/* ── MAP (top 45% of screen) ─────────────────────────── */}
               <View style={{ height: height * 0.48 }}>
                    <MapView
                         ref={mapRef}
                         provider={PROVIDER_GOOGLE}
                         style={{ flex: 1 }}
                         initialRegion={mapRegion}
                         showsUserLocation={locationPermission === true}
                         showsMyLocationButton={false}
                         showsCompass={false}
                         toolbarEnabled={false}
                         onMapReady={fitMap}
                         mapType="standard"
                    >
                         {/* Route polyline */}
                         {status !== 'pending' && (
                              <Polyline
                                   coordinates={routeCoords}
                                   strokeColor="#006B44"
                                   strokeWidth={4}
                                   lineDashPattern={[8, 4]}
                              />
                         )}

                         {/* Driver marker */}
                         {status !== 'pending' && (
                              <Marker
                                   coordinate={driverCoord}
                                   tracksViewChanges={false}
                                   anchor={{ x: 0.5, y: 0.5 }}
                                   title="Delivery Partner"
                                   description={`ETA: ${eta} min`}
                              >
                                   <DriverMarkerView />
                              </Marker>
                         )}

                         {/* Customer drop-off marker */}
                         <Marker
                              coordinate={customerCoord}
                              tracksViewChanges={false}
                              anchor={{ x: 0.5, y: 1 }}
                              title="Your Location"
                         >
                              <CustomerMarkerView />
                         </Marker>
                    </MapView>

                    {/* Pending state radar overlay */}
                    {status === 'pending' && (
                         <View style={{
                              position: 'absolute', inset: 0,
                              alignItems: 'center', justifyContent: 'center',
                              backgroundColor: 'rgba(255,255,255,0.15)',
                         }}>
                              <Animated.View style={{
                                   width: 120, height: 120, borderRadius: 60,
                                   backgroundColor: 'rgba(0,107,68,0.12)',
                                   position: 'absolute',
                                   transform: [{ scale: pulseAnim }],
                              }} />
                              <View style={{
                                   backgroundColor: '#fff', padding: 16, borderRadius: 99,
                                   shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
                              }}>
                                   <Navigation size={28} color="#006B44" />
                              </View>
                              <Text style={{
                                   marginTop: 12, color: '#fff', fontWeight: '800',
                                   fontSize: 13, letterSpacing: 0.5,
                                   textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4,
                              }}>
                                   Finding Delivery Partner…
                              </Text>
                         </View>
                    )}

                    {/* Top bar */}
                    <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 }}>
                              <TouchableOpacity
                                   onPress={() => navigation.goBack()}
                                   style={{
                                        backgroundColor: '#fff', padding: 10, borderRadius: 16,
                                        shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
                                   }}
                              >
                                   <ArrowLeft size={20} color="#1e293b" />
                              </TouchableOpacity>

                              {status !== 'pending' && (
                                   <TouchableOpacity
                                        onPress={fitMap}
                                        style={{
                                             backgroundColor: '#fff', padding: 10, borderRadius: 16,
                                             shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
                                        }}
                                   >
                                        <Navigation size={20} color="#006B44" />
                                   </TouchableOpacity>
                              )}
                         </View>
                    </SafeAreaView>

                    {/* Location permission denied notice */}
                    {locationPermission === false && (
                         <View style={{
                              position: 'absolute', bottom: 12, left: 16, right: 16,
                              backgroundColor: '#FFF7ED',
                              borderRadius: 16, padding: 12,
                              flexDirection: 'row', alignItems: 'center',
                              borderWidth: 1, borderColor: '#FED7AA',
                         }}>
                              <AlertCircle size={16} color="#EA580C" />
                              <Text style={{ marginLeft: 8, color: '#9A3412', fontSize: 11, fontWeight: '700', flex: 1 }}>
                                   Location permission denied. Using demo coordinates. Enable in settings.
                              </Text>
                         </View>
                    )}
               </View>

               {/* ── BOTTOM SHEET ────────────────────────────────────── */}
               <View style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 32, borderTopRightRadius: 32,
                    marginTop: -24,
                    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 24, elevation: 24,
               }}>
                    {/* Handle */}
                    <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
                         <View style={{ width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2 }} />
                    </View>

                    <ScrollView
                         showsVerticalScrollIndicator={false}
                         contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                    >
                         {status === 'pending' ? (
                              /* Searching state */
                              <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                                   <ActivityIndicator size="large" color="#006B44" />
                                   <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '900', color: '#1E293B', fontStyle: 'italic' }}>
                                        Finding Partner…
                                   </Text>
                                   <Text style={{ color: '#94A3B8', marginTop: 8, textAlign: 'center', fontWeight: '600' }}>
                                        We're assigning the nearest delivery partner to your order.
                                   </Text>
                                   <Text style={{ color: '#006B44', marginTop: 6, fontWeight: '700' }}>
                                        Order #{(orderId ?? 'demo').slice(-6).toUpperCase()}
                                   </Text>
                              </View>
                         ) : (
                              <>
                                   {/* ETA + order ID */}
                                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 16 }}>
                                        <View>
                                             <Text style={{ fontSize: 24, fontWeight: '900', color: '#1E293B', fontStyle: 'italic' }}>
                                                  {status === 'delivered' ? 'Delivered ✓' : `${eta} min away`}
                                             </Text>
                                             <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '700', marginTop: 2 }}>
                                                  Order #{(orderId ?? 'demo').slice(-6).toUpperCase()}
                                             </Text>
                                        </View>
                                        <View style={{
                                             backgroundColor: status === 'delivered' ? '#D1FAE5' : '#DBEAFE',
                                             paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                                        }}>
                                             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                  <Clock size={12} color={status === 'delivered' ? '#059669' : '#2563EB'} />
                                                  <Text style={{
                                                       marginLeft: 5, fontWeight: '800', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5,
                                                       color: status === 'delivered' ? '#059669' : '#2563EB',
                                                  }}>
                                                       {status.replace('_', ' ')}
                                                  </Text>
                                             </View>
                                        </View>
                                   </View>

                                   {/* Delivery partner card */}
                                   <View style={{
                                        flexDirection: 'row', alignItems: 'center',
                                        backgroundColor: '#F8FAFC', borderRadius: 24, padding: 16,
                                        marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0',
                                   }}>
                                        <View style={{
                                             width: 52, height: 52, borderRadius: 18,
                                             backgroundColor: '#E2F2E9', alignItems: 'center', justifyContent: 'center',
                                             marginRight: 14, borderWidth: 2, borderColor: '#006B44',
                                        }}>
                                             <Truck size={24} color="#006B44" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                             <Text style={{ fontWeight: '800', fontSize: 15, color: '#1E293B' }}>Vikram Singh</Text>
                                             <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                                                  <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                                                       4.9 · Delivery Partner
                                                  </Text>
                                             </View>
                                        </View>
                                        <View style={{
                                             backgroundColor: '#006B44', padding: 12, borderRadius: 16,
                                        }}>
                                             <Phone size={18} color="#fff" />
                                        </View>
                                   </View>

                                   {/* Delivery address */}
                                   <View style={{
                                        flexDirection: 'row', alignItems: 'flex-start',
                                        backgroundColor: '#F8FAFC', borderRadius: 20, padding: 14,
                                        marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0',
                                   }}>
                                        <MapPin size={16} color="#006B44" style={{ marginTop: 1 }} />
                                        <Text style={{ flex: 1, marginLeft: 10, color: '#334155', fontWeight: '700', fontSize: 13 }}>
                                             {order?.deliveryAddress || '14 Green Valley, Kothrud, Pune - 411038'}
                                        </Text>
                                   </View>

                                   {/* Delivery partner "Mark Delivered" button */}
                                   {userRole === 'DELIVERY' && status === 'assigned' && (
                                        <TouchableOpacity
                                             onPress={handleMarkDelivered}
                                             disabled={isSubmitting}
                                             style={{
                                                  backgroundColor: '#006B44',
                                                  borderRadius: 24, paddingVertical: 16,
                                                  alignItems: 'center', marginBottom: 16,
                                                  opacity: isSubmitting ? 0.6 : 1,
                                                  shadowColor: '#006B44', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
                                             }}
                                        >
                                             {isSubmitting ? (
                                                  <ActivityIndicator color="#fff" />
                                             ) : (
                                                  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', fontStyle: 'italic' }}>
                                                       Mark as Delivered
                                                  </Text>
                                             )}
                                        </TouchableOpacity>
                                   )}

                                   {/* Reorder button for delivered */}
                                   {status === 'delivered' && (
                                        <TouchableOpacity
                                             style={{
                                                  borderWidth: 2, borderColor: '#006B44',
                                                  borderRadius: 24, paddingVertical: 16,
                                                  alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
                                                  marginBottom: 16,
                                             }}
                                        >
                                             <RotateCcw size={16} color="#006B44" />
                                             <Text style={{ color: '#006B44', fontWeight: '900', fontSize: 14, marginLeft: 8, textTransform: 'uppercase', fontStyle: 'italic' }}>
                                                  Reorder
                                             </Text>
                                        </TouchableOpacity>
                                   )}

                                   {/* Status timeline */}
                                   <Text style={{ fontWeight: '900', fontSize: 14, color: '#1E293B', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 16 }}>
                                        Order Timeline
                                   </Text>
                                   {STEPS.map((step, index) => {
                                        const done = index <= currentStepIdx;
                                        return (
                                             <View key={step.key} style={{ flexDirection: 'row', marginBottom: 20, position: 'relative' }}>
                                                  {/* Vertical connector line */}
                                                  {index < STEPS.length - 1 && (
                                                       <View style={{
                                                            position: 'absolute',
                                                            left: 16, top: 34, bottom: -20, width: 2,
                                                            backgroundColor: done && index < currentStepIdx ? '#006B44' : '#E2E8F0',
                                                       }} />
                                                  )}
                                                  {/* Step circle */}
                                                  <View style={{
                                                       width: 34, height: 34, borderRadius: 17,
                                                       backgroundColor: done ? '#006B44' : '#F1F5F9',
                                                       alignItems: 'center', justifyContent: 'center',
                                                       zIndex: 1,
                                                  }}>
                                                       {done
                                                            ? <Check size={16} color="#fff" />
                                                            : <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#CBD5E1' }} />
                                                       }
                                                  </View>
                                                  {/* Step text */}
                                                  <View style={{ marginLeft: 14, flex: 1, paddingTop: 6 }}>
                                                       <Text style={{
                                                            fontWeight: '800', fontSize: 14,
                                                            color: done ? '#1E293B' : '#94A3B8',
                                                       }}>
                                                            {step.title}
                                                       </Text>
                                                       <Text style={{ fontSize: 11, color: done ? '#059669' : '#CBD5E1', fontWeight: '600', marginTop: 2 }}>
                                                            {done ? 'Completed' : 'Pending'}
                                                       </Text>
                                                  </View>
                                             </View>
                                        );
                                   })}
                              </>
                         )}
                    </ScrollView>
               </View>
          </View>
     );
};
