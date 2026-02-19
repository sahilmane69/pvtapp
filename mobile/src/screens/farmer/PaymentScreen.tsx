import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { CreditCard, Wallet, Banknote, ArrowLeft, Lock, MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';

const API_URL = 'http://192.168.0.101:5000';

import { SafeAreaView } from 'react-native-safe-area-context';

export const PaymentScreen = () => {
     const navigation = useNavigation<any>();
     const { user } = useAuth();
     const { cartItems, getCartTotal, clearCart } = useCart();
     const total = getCartTotal();
     const [isLoading, setIsLoading] = useState(false);
     const [isLocating, setIsLocating] = useState(false);
     const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'cod'>('card');

     // Location state
     const [deliveryAddress, setDeliveryAddress] = useState('Farm House, Main Road (Default)');
     const [locationCoords, setLocationCoords] = useState<{ lat: number, lng: number } | null>(null);

     const detectLocation = async () => {
          setIsLocating(true);
          try {
               let { status } = await Location.requestForegroundPermissionsAsync();
               if (status !== 'granted') {
                    Alert.alert('Permission to access location was denied');
                    setIsLocating(false);
                    return;
               }

               let location = await Location.getCurrentPositionAsync({});
               setLocationCoords({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
               });

               // Reverse geocoding to get address text
               let address = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
               });

               if (address && address.length > 0) {
                    const addr = address[0];
                    const formattedAddr = `${addr.street || ''} ${addr.name || ''}, ${addr.city || ''}, ${addr.region || ''} ${addr.postalCode || ''}`;
                    setDeliveryAddress(formattedAddr.trim() || "Detected Location");
               } else {
                    setDeliveryAddress(`Lat: ${location.coords.latitude}, Lng: ${location.coords.longitude}`);
               }

          } catch (error) {
               console.error(error);
               Alert.alert('Error', 'Could not detect location');
          } finally {
               setIsLocating(false);
          }
     };

     const handlePayment = async () => {
          setIsLoading(true);

          // Simulate payment processing delay
          setTimeout(async () => {
               try {
                    if (!user?.id) {
                         Alert.alert('Error', 'User not logged in');
                         setIsLoading(false);
                         return;
                    }

                    const response = await fetch(`${API_URL}/orders`, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({
                              farmerId: user.id,
                              items: cartItems.map(item => ({
                                   productId: item.id,
                                   name: item.name,
                                   price: item.price,
                                   quantity: item.quantity
                              })),
                              totalAmount: total,
                              deliveryAddress: deliveryAddress,
                              deliveryLocation: locationCoords
                         }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                         clearCart();
                         navigation.navigate('OrderConfirmation', { orderId: data.orderId || data._id });
                    } else {
                         Alert.alert('Payment Failed', data.message || 'Server error');
                    }
               } catch (error) {
                    console.error(error);
                    Alert.alert('Error', 'Connection failed');
               } finally {
                    setIsLoading(false);
               }
          }, 2000); // 2 second fake processing time
     };

     return (
          <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
               {/* Header */}
               <View className="flex-row items-center p-4 bg-white shadow-sm border-b border-gray-100">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                         <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800">Payment</Text>
               </View>

               <ScrollView className="flex-1 p-4 bg-gray-50">
                    {/* Delivery Location Card */}
                    <View className="bg-white p-4 rounded-xl mb-6 shadow-sm border border-gray-100">
                         <Text className="text-gray-500 font-bold mb-2 uppercase text-xs">Delivery Location</Text>
                         <View className="flex-row items-center justify-between">
                              <View className="flex-1 mr-2">
                                   <Text className="text-gray-800 font-medium text-base" numberOfLines={2}>
                                        {deliveryAddress}
                                   </Text>
                              </View>
                              <TouchableOpacity
                                   onPress={detectLocation}
                                   disabled={isLocating}
                                   className="bg-emerald-50 p-2 rounded-full border border-emerald-100"
                              >
                                   {isLocating ? <ActivityIndicator size="small" color="#059669" /> : <MapPin size={20} color="#059669" />}
                              </TouchableOpacity>
                         </View>
                         <TouchableOpacity onPress={detectLocation}>
                              <Text className="text-emerald-600 text-xs font-bold mt-2">
                                   {locationCoords ? "Update Location" : "Detect My Location"}
                              </Text>
                         </TouchableOpacity>
                    </View>

                    {/* Total Amount Card */}
                    <View className="bg-emerald-600 p-6 rounded-2xl mb-6 shadow-md items-center">
                         <Text className="text-emerald-100 text-lg mb-1">Total Amount to Pay</Text>
                         <Text className="text-white text-4xl font-bold">₹{total.toFixed(2)}</Text>
                    </View>

                    {/* Payment Methods */}
                    <Text className="text-lg font-bold text-gray-700 mb-4">Select Payment Method</Text>

                    <TouchableOpacity
                         onPress={() => setSelectedMethod('card')}
                         className={`bg-white p-4 rounded-xl mb-3 flex-row items-center border-2 ${selectedMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-transparent'}`}
                    >
                         <View className="bg-blue-100 p-3 rounded-full mr-4">
                              <CreditCard size={24} color="#1d4ed8" />
                         </View>
                         <View className="flex-1">
                              <Text className="font-bold text-gray-800 text-lg">Credit / Debit Card</Text>
                              <Text className="text-gray-500">Visa, Mastercard, RuPay</Text>
                         </View>
                         {selectedMethod === 'card' && <View className="w-4 h-4 rounded-full bg-emerald-500" />}
                    </TouchableOpacity>

                    <TouchableOpacity
                         onPress={() => setSelectedMethod('upi')}
                         className={`bg-white p-4 rounded-xl mb-3 flex-row items-center border-2 ${selectedMethod === 'upi' ? 'border-emerald-500 bg-emerald-50' : 'border-transparent'}`}
                    >
                         <View className="bg-orange-100 p-3 rounded-full mr-4">
                              <Wallet size={24} color="#c2410c" />
                         </View>
                         <View className="flex-1">
                              <Text className="font-bold text-gray-800 text-lg">UPI</Text>
                              <Text className="text-gray-500">Google Pay, PhonePe, Paytm</Text>
                         </View>
                         {selectedMethod === 'upi' && <View className="w-4 h-4 rounded-full bg-emerald-500" />}
                    </TouchableOpacity>

                    <TouchableOpacity
                         onPress={() => setSelectedMethod('cod')}
                         className={`bg-white p-4 rounded-xl mb-3 flex-row items-center border-2 ${selectedMethod === 'cod' ? 'border-emerald-500 bg-emerald-50' : 'border-transparent'}`}
                    >
                         <View className="bg-green-100 p-3 rounded-full mr-4">
                              <Banknote size={24} color="#15803d" />
                         </View>
                         <View className="flex-1">
                              <Text className="font-bold text-gray-800 text-lg">Cash on Delivery</Text>
                              <Text className="text-gray-500">Pay when you receive</Text>
                         </View>
                         {selectedMethod === 'cod' && <View className="w-4 h-4 rounded-full bg-emerald-500" />}
                    </TouchableOpacity>

               </ScrollView>

               {/* Pay Button */}
               <View className="p-4 bg-white border-t border-gray-100">
                    <TouchableOpacity
                         onPress={handlePayment}
                         disabled={isLoading}
                         className={`w-full py-4 rounded-xl items-center flex-row justify-center ${isLoading ? 'bg-gray-300' : 'bg-emerald-600'}`}
                    >
                         {isLoading ? (
                              <ActivityIndicator color="white" />
                         ) : (
                              <>
                                   <Lock size={20} color="white" className="mr-2" />
                                   <Text className="text-white font-bold text-xl ml-2">Pay ₹{total.toFixed(2)}</Text>
                              </>
                         )}
                    </TouchableOpacity>
                    <Text className="text-center text-gray-400 text-xs mt-3 flex-row items-center justify-center">
                         <Lock size={12} color="#9ca3af" /> 100% Secure Transaction
                    </Text>
               </View>
          </SafeAreaView>
     );
};
