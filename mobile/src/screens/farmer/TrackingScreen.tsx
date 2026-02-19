import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, Animated, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Check, Truck, MapPin, Phone, ArrowLeft, Clock, Search } from 'lucide-react-native';
import io from 'socket.io-client';

const API_URL = 'http://192.168.0.101:5000';
const SOCKET_URL = 'http://192.168.0.101:5000';

const STEPS = [
     { title: 'Order Placed', key: 'pending' },
     { title: 'Partner Assigned', key: 'assigned' },
     { title: 'Out for Delivery', key: 'out_for_delivery' },
     { title: 'Delivered', key: 'delivered' },
];

type OrderStatus = 'pending' | 'assigned' | 'out_for_delivery' | 'delivered';

interface Order {
     status: OrderStatus;
     // Add other properties of the order object if they are used
     // For example: id: string; customerName: string; etc.
}

export const TrackingScreen = () => {
     const navigation = useNavigation<any>();
     const route = useRoute<any>();
     const { orderId } = route.params || {};

     const [order, setOrder] = useState<Order | null>(null);
     const [status, setStatus] = useState<OrderStatus>('pending'); // pending, assigned, out_for_delivery, delivered
     const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null);
     const [eta, setEta] = useState<number>(15);
     const [socket, setSocket] = useState<any>(null); // Suppressing 'any' for socket as types can be complex

     // Animation for searching
     const pulseAnim = useRef(new Animated.Value(1)).current;

     useEffect(() => {
          // Fetch initial order details
          fetch(`${API_URL}/orders/${orderId}`)
               .then((res: any) => res.json())
               .then((data: Order) => {
                    setOrder(data);
                    setStatus(data.status);
               })
               .catch((err: any) => console.error(err));

          // Connect Socket
          const newSocket = io(SOCKET_URL);
          setSocket(newSocket);

          newSocket.on('connect', () => {
               console.log('Connected to socket server');
               newSocket.emit('join_order', orderId);
          });

          newSocket.on('order_accepted', (data: any) => { // 'any' as payload structure might vary
               setStatus('assigned');
               Alert.alert("Good news!", "A delivery partner has accepted your order.");
          });

          newSocket.on('driver_location', (data: { latitude: number, longitude: number }) => {
               setDriverLocation({ lat: data.latitude, lng: data.longitude });
               // Basic ETA calc simulation
               setEta(Math.max(1, Math.floor(Math.random() * 20)));
          });

          newSocket.on('status_update', (data: { status: OrderStatus }) => {
               setStatus(data.status);
          });

          return () => {
               newSocket.disconnect();
          };
     }, [orderId]);

     // Pulse animation for searching state
     useEffect(() => {
          if (status === 'pending') {
               Animated.loop(
                    Animated.sequence([
                         Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
                         Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
                    ])
               ).start();
          }
     }, [status]);

     const getStatusIndex = () => {
          switch (status) {
               case 'pending': return 0;
               case 'assigned': return 1;
               case 'out_for_delivery': return 2;
               case 'delivered': return 3;
               default: return 0;
          }
     };

     const currentStepIndex = getStatusIndex();

     return (
          <View className="flex-1 bg-white">
               {/* Header */}
               <View className="absolute top-10 left-4 z-10 p-2 bg-white/80 rounded-full shadow-sm">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <ArrowLeft color="#1e293b" size={24} />
                    </TouchableOpacity>
               </View>

               {/* Map Area */}
               <View className="h-2/5 w-full bg-slate-200 relative overflow-hidden">
                    <Image
                         source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' }}
                         className="w-full h-full opacity-80"
                         resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/10" />

                    {/* User Location */}
                    <View className="absolute bottom-10 left-1/2 -translate-x-4">
                         <View className="bg-emerald-500 p-2 rounded-full border-4 border-white shadow-lg">
                              <MapPin color="white" size={24} fill="white" />
                         </View>
                    </View>

                    {/* Driver Location or Searching Radar */}
                    {status === 'pending' ? (
                         <View className="absolute top-1/2 left-1/2 -ml-8 -mt-8 items-center justify-center">
                              <Animated.View style={{ transform: [{ scale: pulseAnim }] }} className="w-32 h-32 bg-emerald-500/20 rounded-full absolute" />
                              <View className="bg-white p-3 rounded-full shadow-lg">
                                   <Search color="#10b981" size={24} />
                              </View>
                         </View>
                    ) : (
                         // Driver Icon (Static position for demo, but would use driverLocation in real map)
                         <View className="absolute top-[30%] left-[40%]">
                              <View className="bg-white p-2 rounded-full shadow-lg border-2 border-orange-500">
                                   <Truck color="#ea580c" size={24} fill="#ea580c" />
                              </View>
                              <View className="bg-white px-2 py-1 rounded-md shadow-md mt-1 -ml-4">
                                   <Text className="text-xs font-bold text-gray-800">{eta} min</Text>
                              </View>
                         </View>
                    )}
               </View>

               {/* Tracking Sheet */}
               <View className="flex-1 -mt-6 bg-white rounded-t-3xl px-6 pt-8 pb-4 shadow-2xl">
                    <View className="items-center mb-6">
                         <View className="w-12 h-1 bg-gray-300 rounded-full" />
                    </View>

                    {status === 'pending' ? (
                         <View className="items-center py-8">
                              <ActivityIndicator size="large" color="#10b981" className="mb-4" />
                              <Text className="text-xl font-bold text-slate-800">Finding Delivery Partner...</Text>
                              <Text className="text-slate-500 text-center mt-2 mx-8">
                                   We are looking for the nearest delivery agent for your order.
                              </Text>
                         </View>
                    ) : (
                         <>
                              <View className="flex-row justify-between items-center mb-6">
                                   <View>
                                        <Text className="text-2xl font-bold text-slate-800">
                                             {status === 'delivered' ? 'Order Delivered' : `Arriving in ${eta} mins`}
                                        </Text>
                                        <Text className="text-slate-500">Order #{orderId?.slice(-6).toUpperCase()}</Text>
                                   </View>
                                   <View className="bg-emerald-100 px-3 py-1 rounded-full">
                                        <Text className="text-emerald-700 font-bold text-xs uppercase">
                                             {status.replace('_', ' ')}
                                        </Text>
                                   </View>
                              </View>

                              {/* Delivery Partner Info */}
                              <View className="flex-row items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                                   <Image
                                        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                                        className="w-12 h-12 rounded-full mr-4"
                                   />
                                   <View className="flex-1">
                                        <Text className="font-bold text-slate-800 text-lg">Ramesh Kumar</Text>
                                        <Text className="text-slate-500 text-xs">Delivery Partner • 4.8 ⭐</Text>
                                   </View>
                                   <TouchableOpacity className="bg-emerald-500 p-3 rounded-full mr-2">
                                        <Phone color="white" size={20} />
                                   </TouchableOpacity>
                              </View>

                              {/* Timeline */}
                              <ScrollView showsVerticalScrollIndicator={false}>
                                   {STEPS.map((step, index) => {
                                        const isCompleted = index <= currentStepIndex;

                                        return (
                                             <View key={index} className="flex-row mb-6 relative">
                                                  {/* Line */}
                                                  {index !== STEPS.length - 1 && (
                                                       <View className={`absolute left-[15px] top-8 bottom-[-24px] w-[2px] ${isCompleted && index < currentStepIndex ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                                                  )}

                                                  <View className={`w-8 h-8 rounded-full items-center justify-center z-10 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                                                       {isCompleted ? <Check color="white" size={16} /> : <View className="w-2 h-2 rounded-full bg-gray-400" />}
                                                  </View>

                                                  <View className="ml-4 flex-1">
                                                       <Text className={`font-bold text-base ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                                                            {step.title}
                                                       </Text>
                                                       <Text className="text-slate-400 text-xs text-capitalize">
                                                            {isCompleted ? 'Completed' : 'Pending'}
                                                       </Text>
                                                  </View>
                                             </View>
                                        );
                                   })}
                              </ScrollView>
                         </>
                    )}
               </View>
          </View>
     );
};
