import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Image, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
     Navigation,
     MapPin,
     Clock,
     CircleDollarSign,
     ChevronRight,
     Package,
     Bell,
     CheckCircle2,
     List
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../../utils/constants';

const { width } = Dimensions.get('window');

export const DeliveryHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { user } = useAuth();
     const [isOnline, setIsOnline] = useState(true);
     const [summary, setSummary] = useState({ earnings: 0, completedCount: 0 });
     const [activeTasks, setActiveTasks] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
     const [refreshing, setRefreshing] = useState(false);

     const fetchDeliveryData = async () => {
          try {
               // 1. Fetch Summary
               const sumRes = await fetch(`${API_URL}/orders/delivery/${user?.id}/summary`);
               const sumData = await sumRes.json();
               if (sumRes.ok) setSummary({
                    earnings: sumData.totalEarnings || 0,
                    completedCount: sumData.deliveredCount || 0
               });

               // 2. Fetch Active/Pending Tasks
               const taskRes = await fetch(`${API_URL}/orders/delivery`);
               const taskData = await taskRes.json();
               if (taskRes.ok) setActiveTasks(taskData.slice(0, 3));

          } catch (error) {
               console.error('Delivery dashboard fetch error:', error);
          } finally {
               setIsLoading(false);
               setRefreshing(false);
          }
     };

     useEffect(() => {
          fetchDeliveryData();
     }, []);

     const onRefresh = () => {
          setRefreshing(true);
          fetchDeliveryData();
     };

     if (isLoading) {
          return (
               <View className="flex-1 justify-center items-center bg-background">
                    <ActivityIndicator size="large" color="#2563EB" />
               </View>
          );
     }

     return (
          <View className="flex-1 bg-background">
               {/* Fixed Header */}
               <SafeAreaView edges={['top']} className="bg-blue-700 shadow-sm z-20">
                    <View className="px-6 py-4 flex-row justify-between items-center">
                         <View>
                              <Text className="text-blue-100 text-xs font-bold">Delivery Partner</Text>
                              <Text className="text-white text-xl font-black">{user?.username || 'Partner'}</Text>
                         </View>
                         <View className="flex-row items-center bg-white/10 px-4 py-2 rounded-full">
                              <Text className="text-white font-black text-xs mr-3">{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
                              <Switch
                                   value={isOnline}
                                   onValueChange={setIsOnline}
                                   trackColor={{ false: '#64748B', true: '#10B981' }}
                                   thumbColor="white"
                              />
                         </View>
                    </View>
               </SafeAreaView>

               <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
               >
                    {/* Earnings Summary Card */}
                    <View className="px-6 pt-6">
                         <LinearGradient
                              colors={['#2563EB', '#1D4ED8']}
                              className="p-6 rounded-3xl shadow-premium"
                         >
                              <View className="flex-row justify-between items-center mb-6">
                                   <View>
                                        <Text className="text-blue-100/70 text-xs font-bold uppercase tracking-widest">Total Earnings</Text>
                                        <Text className="text-white text-3xl font-black">₹ {summary.earnings.toFixed(2)}</Text>
                                   </View>
                                   <View className="bg-white/20 p-3 rounded-2xl">
                                        <CircleDollarSign size={28} color="white" />
                                   </View>
                              </View>
                              <View className="flex-row justify-between border-t border-white/20 pt-4">
                                   <View className="items-center">
                                        <Text className="text-white font-bold">{summary.completedCount}</Text>
                                        <Text className="text-blue-100/60 text-[10px] uppercase">Completed</Text>
                                   </View>
                                   <View className="items-center">
                                        <Text className="text-white font-bold">4.9★</Text>
                                        <Text className="text-blue-100/60 text-[10px] uppercase">Rating</Text>
                                   </View>
                                   <View className="items-center">
                                        <TouchableOpacity onPress={() => navigation.navigate('DeliveryOrders')}>
                                             <List size={20} color="white" />
                                             <Text className="text-blue-100/60 text-[10px] uppercase">History</Text>
                                        </TouchableOpacity>
                                   </View>
                              </View>
                         </LinearGradient>
                    </View>

                    {/* Active Tasks Section */}
                    <View className="px-6 mt-8">
                         <View className="flex-row justify-between items-center mb-4">
                              <Text className="text-xl font-bold text-neutral-900">Available Tasks</Text>
                              <TouchableOpacity onPress={() => navigation.navigate('DeliveryOrders')}>
                                   <Text className="text-blue-700 font-bold">See All</Text>
                              </TouchableOpacity>
                         </View>

                         {!isOnline ? (
                              <View className="bg-white rounded-3xl p-10 items-center justify-center border border-dashed border-neutral-300">
                                   <Navigation size={48} color="#94A3B8" strokeWidth={1} />
                                   <Text className="text-neutral-400 font-bold text-center mt-4">Go Online to start receiving{'\n'}delivery tasks</Text>
                              </View>
                         ) : activeTasks.length === 0 ? (
                              <View className="bg-white rounded-3xl p-10 items-center justify-center border border-dashed border-neutral-300">
                                   <CheckCircle2 size={48} color="#10B981" strokeWidth={1} />
                                   <Text className="text-neutral-400 font-bold text-center mt-4">No pending tasks!{'\n'}Enjoy your break.</Text>
                              </View>
                         ) : (
                              activeTasks.map((task: any) => (
                                   <TouchableOpacity
                                        key={task._id}
                                        className="bg-white rounded-3xl p-5 mb-4 shadow-card border border-neutral-100"
                                        onPress={() => navigation.navigate('DeliveryOrders')}
                                   >
                                        <View className="flex-row items-center mb-4">
                                             <View className="bg-blue-50 p-3 rounded-2xl mr-4">
                                                  <Package size={24} color="#2563EB" />
                                             </View>
                                             <View className="flex-1">
                                                  <Text className="text-neutral-900 font-bold text-base">New Delivery Request</Text>
                                                  <Text className="text-neutral-500 text-xs">Total: ₹{task.totalAmount}</Text>
                                             </View>
                                        </View>
                                        <View className="flex-row items-center justify-between">
                                             <View className="flex-row items-center">
                                                  <MapPin size={14} color="#64748B" />
                                                  <Text className="text-neutral-500 text-xs ml-1" numberOfLines={1}>
                                                       {task.deliveryAddress?.slice(0, 30)}...
                                                  </Text>
                                             </View>
                                             <View className="bg-blue-600 px-4 py-2 rounded-xl">
                                                  <Text className="text-white font-bold text-xs">Accept</Text>
                                             </View>
                                        </View>
                                   </TouchableOpacity>
                              ))
                         )}
                    </View>

                    {/* Hotspot Section (Mockup) */}
                    <View className="px-6 mt-8 mb-24">
                         <Text className="text-xl font-bold text-neutral-900 mb-4">Earning Hotspots</Text>
                         <View className="h-48 bg-neutral-200 rounded-3xl overflow-hidden shadow-sm relative">
                              <Image
                                   source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80' }}
                                   className="w-full h-full"
                              />
                              <View className="absolute inset-0 bg-black/5" />
                              <View className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl">
                                   <Text className="text-neutral-900 font-black text-[10px] uppercase">High Multiplier (1.5x)</Text>
                              </View>
                         </View>
                    </View>
               </ScrollView>

               {/* Emergency Button */}
               <TouchableOpacity className="absolute bottom-10 right-6 bg-red-600 p-4 rounded-full shadow-premium">
                    <Bell size={24} color="white" />
               </TouchableOpacity>
          </View>
     );
};
