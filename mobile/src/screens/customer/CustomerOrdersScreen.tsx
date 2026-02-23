import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Package, Truck, ChevronRight, Clock, MapPin, Search, ShoppingBag } from 'lucide-react-native';
import { API_URL } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CustomerOrdersScreen = () => {
     const { user } = useAuth();
     const navigation = useNavigation<any>();
     const [orders, setOrders] = useState([]);
     const [loading, setLoading] = useState(true);
     const [refreshing, setRefreshing] = useState(false);

     const fetchOrders = async () => {
          try {
               const response = await fetch(`${API_URL}/orders/customer/${user?.id}`);
               const data = await response.json();
               if (response.ok) {
                    setOrders(data);
               }
          } catch (error) {
               console.error('Error fetching customer orders:', error);
          } finally {
               setLoading(false);
               setRefreshing(false);
          }
     };

     useEffect(() => {
          if (user?.id) fetchOrders();
     }, [user?.id]);

     const onRefresh = () => {
          setRefreshing(true);
          fetchOrders();
     };

     const renderOrderItem = ({ item }: { item: any }) => (
          <TouchableOpacity
               className="bg-white rounded-3xl p-5 mb-4 shadow-card border border-neutral-100"
               activeOpacity={0.7}
               onPress={() => navigation.navigate('Tracking', { orderId: item._id })}
          >
               <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-row items-center">
                         <View className="bg-primary-light p-3 rounded-2xl mr-4">
                              <Package size={24} color="#006B44" />
                         </View>
                         <View>
                              <Text className="font-black text-neutral-900 text-lg italic">#{item._id.slice(-6).toUpperCase()}</Text>
                              <View className="flex-row items-center mt-1">
                                   <Clock size={12} color="#94A3B8" />
                                   <Text className="text-neutral-400 text-[10px] font-bold ml-1 uppercase">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                   </Text>
                              </View>
                         </View>
                    </View>
                    <View className={`px-4 py-1.5 rounded-full ${item.status === 'delivered' ? 'bg-green-100' :
                         item.status === 'assigned' ? 'bg-blue-100' : 'bg-amber-100'
                         }`}>
                         <Text className={`font-black text-[10px] uppercase ${item.status === 'delivered' ? 'text-green-700' :
                              item.status === 'assigned' ? 'text-blue-700' : 'text-amber-700'
                              }`}>
                              {item.status}
                         </Text>
                    </View>
               </View>

               <View className="border-t border-neutral-50 my-2" />

               <View className="flex-row justify-between items-center mt-2">
                    <View>
                         <Text className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">Total Price</Text>
                         <Text className="text-primary-branding font-black text-xl italic">₹{item.totalAmount}</Text>
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

     if (loading) {
          return (
               <View className="flex-1 justify-center items-center bg-white">
                    <ActivityIndicator size="large" color="#006B44" />
               </View>
          );
     }

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
