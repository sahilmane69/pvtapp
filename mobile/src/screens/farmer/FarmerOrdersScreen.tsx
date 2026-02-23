import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Package, Truck, ChevronRight, Clock, MapPin } from 'lucide-react-native';
import { API_URL } from '../../utils/constants';

export const FarmerOrdersScreen = () => {
     const { user } = useAuth();
     const navigation = useNavigation<any>();
     const [orders, setOrders] = useState([]);
     const [loading, setLoading] = useState(true);
     const [refreshing, setRefreshing] = useState(false);

     const fetchOrders = useCallback(async () => {
          try {
               const response = await fetch(`${API_URL}/orders/farmer/${user?.id}`);
               const data = await response.json();
               if (response.ok) {
                    setOrders(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
               }
          } catch {
               // Keep dummy data
          } finally {
               setLoading(false);
               setRefreshing(false);
          }
     }, [user?.id]);

     useEffect(() => {
          if (user?.id) fetchOrders();
     }, [fetchOrders]);

     const onRefresh = useCallback(() => {
          setRefreshing(true);
          fetchOrders();
     }, [fetchOrders]);

     const renderOrderItem = useCallback(({ item }: { item: any }) => (
          <TouchableOpacity
               className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-stone-100"
               activeOpacity={0.7}
               onPress={() => navigation.navigate('Tracking', { orderId: item._id })}
          >
               <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center space-x-2">
                         <View className={`p-2 rounded-full ${item.status === 'delivered' ? 'bg-green-100' :
                              item.status === 'assigned' ? 'bg-orange-100' : 'bg-blue-100'
                              }`}>
                              <Package size={20} color={
                                   item.status === 'delivered' ? '#166534' :
                                        item.status === 'assigned' ? '#c2410c' : '#1e40af'
                              } />
                         </View>
                         <View>
                              <Text className="font-bold text-stone-800 text-lg">Order #{item._id.slice(-6).toUpperCase()}</Text>
                              <Text className="text-stone-500 text-sm">
                                   {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Text>
                         </View>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${item.status === 'delivered' ? 'bg-green-100' :
                         item.status === 'assigned' ? 'bg-orange-100' : 'bg-blue-100'
                         }`}>
                         <Text className={`font-semibold text-xs ${item.status === 'delivered' ? 'text-green-700' :
                              item.status === 'assigned' ? 'text-orange-700' : 'text-blue-700'
                              }`}>
                              {item.status.toUpperCase()}
                         </Text>
                    </View>
               </View>

               <View className="border-t border-stone-100 my-3" />

               <View className="space-y-2">
                    <View className="flex-row justify-between">
                         <Text className="text-stone-500">Total Amount</Text>
                         <Text className="font-bold text-stone-800">₹{item.totalAmount}</Text>
                    </View>
                    <View className="flex-row justify-between">
                         <Text className="text-stone-500">Items</Text>
                         <Text className="font-medium text-stone-800">{item.items.length} Items</Text>
                    </View>
               </View>

               <View className="mt-4 flex-row items-center justify-end">
                    <Text className="text-emerald-600 font-semibold mr-1">Track Order</Text>
                    <ChevronRight size={16} color="#059669" />
               </View>
          </TouchableOpacity>
     ), [navigation]);

     if (loading) {
          return (
               <View className="flex-1 justify-center items-center bg-stone-50">
                    <ActivityIndicator size="large" color="#059669" />
               </View>
          );
     }

     return (
          <View className="flex-1 bg-stone-50">
               <View className="bg-white p-4 pt-12 shadow-sm z-10">
                    <Text className="text-2xl font-bold text-stone-800">My Orders</Text>
               </View>
               <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item: any) => item._id}
                    contentContainerStyle={{ padding: 16 }}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews
                    refreshControl={
                         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#059669']} />
                    }
                    ListEmptyComponent={
                         <View className="items-center justify-center mt-20">
                              <Package size={64} color="#d6d3d1" />
                              <Text className="text-stone-400 mt-4 text-lg">No orders yet</Text>
                              <TouchableOpacity
                                   className="mt-6 bg-emerald-600 px-6 py-3 rounded-xl"
                                   onPress={() => navigation.navigate('FarmerHome')}
                              >
                                   <Text className="text-white font-bold">Start Shopping</Text>
                              </TouchableOpacity>
                         </View>
                    }
               />
          </View>
     );
};
