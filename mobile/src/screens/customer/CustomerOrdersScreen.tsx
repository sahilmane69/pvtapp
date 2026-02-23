import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Package, Truck, ChevronRight, Clock, MapPin, Search, ShoppingBag } from 'lucide-react-native';
import { API_URL } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DUMMY_ORDERS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../data/mockData';

export const CustomerOrdersScreen = () => {
     const { user } = useAuth();
     const navigation = useNavigation<any>();
     const [orders, setOrders] = useState<any[]>(DUMMY_ORDERS);
     const [loading, setLoading] = useState(false);
     const [refreshing, setRefreshing] = useState(false);

     const fetchOrders = useCallback(async () => {
          try {
               const response = await fetch(`${API_URL}/orders/customer/${user?.id}`);
               const data = await response.json();
               if (response.ok && data?.length > 0) {
                    setOrders(data);
               }
          } catch {
               // keep dummy data on error
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

     const statusColor = (status: string) => ORDER_STATUS_COLORS[status] || '#059669';
     const statusLabel = (status: string) => ORDER_STATUS_LABELS[status] || status;

     const renderOrderItem = useCallback(({ item }: { item: any }) => {
          const sColor = ORDER_STATUS_COLORS[item.status] || '#059669';
          const sLabel = ORDER_STATUS_LABELS[item.status] || item.status;
          return (
               <TouchableOpacity
                    className="bg-white rounded-3xl p-5 mb-4 shadow-card border border-neutral-100"
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Tracking', { orderId: item._id })}
               >
                    <View className="flex-row justify-between items-start mb-4">
                         <View className="flex-row items-center flex-1 mr-3">
                              <View className="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-50 mr-3 border border-neutral-100 items-center justify-center">
                                   {item.items?.[0]?.image ? (
                                        <Image source={{ uri: item.items[0].image }} className="w-full h-full" resizeMode="cover" />
                                   ) : (
                                        <Package size={22} color="#CBD5E1" />
                                   )}
                              </View>
                              <View className="flex-1">
                                   <Text className="font-black text-neutral-900 text-base italic">#{item._id?.slice(-6).toUpperCase()}</Text>
                                   <Text className="text-neutral-500 text-xs font-medium mt-0.5" numberOfLines={1}>
                                        {(item.items || []).map((i: any) => i.name).join(', ')}
                                   </Text>
                                   <View className="flex-row items-center mt-1">
                                        <Clock size={10} color="#94A3B8" />
                                        <Text className="text-neutral-400 text-[10px] font-bold ml-1 uppercase">
                                             {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </Text>
                                   </View>
                              </View>
                         </View>
                         <View style={{ backgroundColor: sColor + '18' }} className="px-3 py-1.5 rounded-xl">
                              <Text style={{ color: sColor }} className="font-black text-[10px] uppercase tracking-wide">
                                   {sLabel}
                              </Text>
                         </View>
                    </View>

                    <View className="h-px bg-neutral-50 my-1" />

                    <View className="flex-row justify-between items-center mt-3">
                         <View>
                              <Text className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">Total</Text>
                              <Text className="text-primary-branding font-black text-lg italic">₹{item.totalAmount}</Text>
                         </View>
                         <TouchableOpacity
                              className="bg-primary-branding/10 px-5 py-2.5 rounded-2xl flex-row items-center"
                              onPress={() => navigation.navigate('Tracking', { orderId: item._id })}
                         >
                              <Text className="text-primary-branding font-black text-xs uppercase italic mr-1">Details</Text>
                              <ChevronRight size={14} color="#006B44" />
                         </TouchableOpacity>
                    </View>
               </TouchableOpacity>
          );
     }, [navigation]);


     // no blocking loading state — dummy data shows instantly

     return (
          <View className="flex-1 bg-white">
               <SafeAreaView edges={['top']} className="bg-primary-light pb-4 shadow-sm">
                    <View className="px-5 pt-4 flex-row justify-between items-center">
                         <View>
                              <Text className="text-primary-branding text-2xl font-black italic uppercase">My Orders</Text>
                              <Text className="text-neutral-500 text-xs font-bold mt-1">Track your fresh harvest</Text>
                         </View>
                         <TouchableOpacity className="bg-white p-2.5 rounded-2xl shadow-sm">
                              <Search size={22} color="#006B44" />
                         </TouchableOpacity>
                    </View>
               </SafeAreaView>

               <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item: any) => item._id}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    refreshControl={
                         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#006B44']} />
                    }
                    ListEmptyComponent={
                         <View className="items-center justify-center mt-20 px-10">
                              <View className="bg-primary-light p-10 rounded-full mb-6">
                                   <ShoppingBag size={64} color="#006B44" />
                              </View>
                              <Text className="text-neutral-900 font-black text-xl text-center italic uppercase">No Orders Yet</Text>
                              <Text className="text-neutral-500 text-center mt-2 font-medium">Start exploring our fresh seeds and tools collection</Text>
                              <TouchableOpacity
                                   className="mt-8 bg-primary-branding px-10 py-4 rounded-3xl shadow-premium"
                                   onPress={() => navigation.navigate('Home')}
                              >
                                   <Text className="text-white font-black uppercase italic tracking-widest">Shop Now</Text>
                              </TouchableOpacity>
                         </View>
                    }
               />
          </View>
     );
};
