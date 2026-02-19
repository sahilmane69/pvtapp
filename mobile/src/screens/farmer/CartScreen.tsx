import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://192.168.0.101:5000';

export const CartScreen = () => {
     const navigation = useNavigation<any>();
     const { cartItems, getCartTotal, removeFromCart, clearCart } = useCart();
     const { user } = useAuth();
     const total = getCartTotal();
     const [isLoading, setIsLoading] = useState(false);
     const [deliveryAddress, setDeliveryAddress] = useState('Farm house, main village road');

     const handlePlaceOrder = async () => {
          setIsLoading(true);
          try {
               if (!user?.id) {
                    Alert.alert('Not logged in', 'Please log in again to place an order.');
                    return;
               }

               const response = await fetch(`${API_URL}/orders`, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         farmerId: user.id,
                         items: cartItems.map(item => ({
                              productId: item.id,
                              name: item.name,
                              price: item.price,
                              quantity: item.quantity
                         })),
                         totalAmount: total,
                         deliveryAddress,
                    }),
               });

               const data = await response.json();

               if (response.ok) {
                    clearCart();
                    navigation.navigate('OrderConfirmation', { orderId: data.orderId });
               } else {
                    Alert.alert('Order Failed', data.message || 'Something went wrong');
               }
          } catch (error) {
               console.error(error);
               Alert.alert('Error', 'Could not connect to server');
          } finally {
               setIsLoading(false);
          }
     };

     if (cartItems.length === 0) {
          return (
               <View className="flex-1 justify-center items-center bg-stone-50 p-6">
                    <View className="bg-stone-100 p-8 rounded-full mb-6">
                         <ShoppingCart size={64} color="#a8a29e" />
                    </View>
                    <Text className="text-2xl font-bold text-stone-800 mb-2">Your cart is empty</Text>
                    <Text className="text-stone-500 text-center mb-8">
                         Start adding fresh produce to your cart!
                    </Text>
                    <TouchableOpacity
                         className="bg-emerald-600 px-8 py-4 rounded-2xl active:bg-emerald-700"
                         onPress={() => navigation.goBack()}
                    >
                         <Text className="text-white font-bold text-lg">Start Shopping</Text>
                    </TouchableOpacity>
               </View>
          );
     }

     return (
          <View className="flex-1 bg-stone-50">
               <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                         <View className="bg-white mx-4 mt-4 p-4 rounded-2xl shadow-sm border border-stone-100 flex-row justify-between items-center">
                              <View className="flex-1 justify-center">
                                   <Text className="text-lg font-bold text-stone-800 mb-1">{item.name}</Text>
                                   <Text className="text-stone-500 font-medium">
                                        ₹{item.price.toFixed(2)} x {item.quantity}
                                   </Text>
                              </View>
                              <View className="flex-row items-center space-x-4">
                                   <Text className="text-lg font-bold text-emerald-700">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                   </Text>
                                   <TouchableOpacity
                                        onPress={() => removeFromCart(item.id)}
                                        className="p-2 bg-red-50 rounded-full"
                                   >
                                        <Trash2 size={20} color="#ef4444" />
                                   </TouchableOpacity>
                              </View>
                         </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 120 }}
               />

               <View className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl shadow-lg border-t border-stone-100">
                    <View className="flex-row justify-between mb-6 items-end">
                         <Text className="text-stone-500 text-lg font-medium">Total Amount</Text>
                         <Text className="text-3xl font-bold text-stone-800">₹{total.toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity
                         className="bg-emerald-600 py-5 rounded-2xl flex-row justify-center items-center shadow-md active:bg-emerald-700"
                         onPress={handlePlaceOrder}
                         activeOpacity={0.8}
                    >
                         {isLoading ? (
                              <ActivityIndicator color="white" />
                         ) : (
                              <>
                                   <Text className="text-white font-bold text-xl mr-2">Place Order</Text>
                                   <ArrowRight size={24} color="white" />
                              </>
                         )}
                    </TouchableOpacity>
               </View>
          </View>
     );
};
