import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus, MapPin } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CartScreen = () => {
     const navigation = useNavigation<any>();
     const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
     const { user } = useAuth();
     const total = cartTotal;
     const [isLoading, setIsLoading] = useState(false);

     const handlePlaceOrder = () => {
          navigation.navigate('Payment');
     };

     if (cartItems.length === 0) {
          return (
               <View className="flex-1 bg-white justify-center items-center p-8">
                    <View className="bg-primary-light p-10 rounded-full mb-8">
                         <ShoppingCart size={80} color="#006B44" strokeWidth={1.5} />
                    </View>
                    <Text className="text-3xl font-black text-neutral-900 italic mb-3">Empty Cart!</Text>
                    <Text className="text-neutral-500 text-center text-base font-medium mb-10">
                         Your basket is as light as a feather. Let&apos;s add some fresh seeds!
                    </Text>
                    <TouchableOpacity
                         className="bg-primary-branding px-10 py-5 rounded-full shadow-premium"
                         onPress={() => navigation.navigate('Home')}
                    >
                         <Text className="text-white font-black text-lg tracking-widest uppercase">Start Shopping</Text>
                    </TouchableOpacity>
               </View>
          );
     }

     return (
          <View className="flex-1 bg-background">
               <SafeAreaView edges={['top']} className="bg-white px-5 pt-4 pb-4 shadow-sm">
                    <View className="flex-row justify-between items-center">
                         <Text className="text-2xl font-black text-neutral-900 italic">My Basket</Text>
                         <View className="bg-primary-light px-4 py-1.5 rounded-full">
                              <Text className="text-primary-branding font-black text-xs uppercase">{cartItems.length} Items</Text>
                         </View>
                    </View>
                    <View className="flex-row items-center mt-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                         <MapPin size={20} color="#006B44" />
                         <View className="ml-3">
                              <Text className="text-neutral-400 text-[10px] font-bold uppercase">Deliver to</Text>
                              <Text className="text-neutral-900 font-bold text-sm">Maharashtra Housing Board Pune...</Text>
                         </View>
                         <TouchableOpacity className="ml-auto">
                              <Text className="text-primary-branding font-bold text-xs">Change</Text>
                         </TouchableOpacity>
                    </View>
               </SafeAreaView>

               <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 20, paddingBottom: 180 }}
                    renderItem={({ item }) => (
                         <View className="bg-white rounded-3xl p-4 mb-4 shadow-card border border-neutral-50 flex-row items-center">
                              <View className="bg-neutral-100 w-20 h-20 rounded-2xl overflow-hidden">
                                   <Image
                                        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                                        className="w-full h-full"
                                        resizeMode="contain"
                                   />
                              </View>
                              <View className="flex-1 ml-4">
                                   <Text className="text-neutral-900 font-bold text-base" numberOfLines={1}>{item.name}</Text>
                                   <Text className="text-primary-branding font-black text-lg mt-1">₹{item.price}</Text>

                                   <View className="flex-row items-center mt-2">
                                        <TouchableOpacity
                                             className="bg-neutral-100 p-1 rounded-lg"
                                             onPress={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                        >
                                             <Minus size={16} color="#475569" />
                                        </TouchableOpacity>
                                        <Text className="mx-4 font-black text-neutral-900">{item.quantity}</Text>
                                        <TouchableOpacity
                                             className="bg-neutral-100 p-1 rounded-lg"
                                             onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                             <Plus size={16} color="#475569" />
                                        </TouchableOpacity>
                                   </View>
                              </View>
                              <TouchableOpacity
                                   onPress={() => removeFromCart(item.id)}
                                   className="p-3 bg-red-50 rounded-2xl"
                              >
                                   <Trash2 size={20} color="#ef4444" />
                              </TouchableOpacity>
                         </View>
                    )}
               />

               <View className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-5xl shadow-premium border-t border-neutral-50">
                    <View className="space-y-3 mb-6">
                         <View className="flex-row justify-between">
                              <Text className="text-neutral-500 font-medium">Subtotal</Text>
                              <Text className="text-neutral-900 font-bold">₹{total.toFixed(2)}</Text>
                         </View>
                         <View className="flex-row justify-between">
                              <Text className="text-neutral-500 font-medium">Delivery Fee</Text>
                              <Text className="text-green-600 font-bold">FREE</Text>
                         </View>
                         <View className="border-t border-neutral-100 pt-3 flex-row justify-between items-center">
                              <View>
                                   <Text className="text-neutral-400 text-xs font-bold uppercase">Total Amount</Text>
                                   <Text className="text-3xl font-black text-primary-branding italic">₹{total.toFixed(2)}</Text>
                              </View>
                              <TouchableOpacity
                                   className="bg-primary-branding px-8 py-5 rounded-3xl shadow-lg flex-row items-center"
                                   onPress={handlePlaceOrder}
                              >
                                   <Text className="text-white font-black uppercase tracking-widest mr-2">Checkout</Text>
                                   <ArrowRight size={20} color="white" />
                              </TouchableOpacity>
                         </View>
                    </View>
               </View>
          </View>
     );
};
