import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
     List,
     LogOut,
     User as UserIcon
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../../utils/constants';
import { DELIVERY_STATS_DUMMY, DUMMY_ORDERS } from '../../data/mockData';

const { width } = Dimensions.get('window');

export const DeliveryHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { user, logout } = useAuth();
     const [isOnline, setIsOnline] = useState(true);
     const [summary, setSummary] = useState({
          earnings: DELIVERY_STATS_DUMMY.totalEarnings,
          completedCount: DELIVERY_STATS_DUMMY.deliveredCount,
     });
     const [activeTasks, setActiveTasks] = useState<any[]>(() =>
          DUMMY_ORDERS.filter(o => o.status === 'assigned' || o.status === 'pending').slice(0, 3)
     );
     const [isLoading, setIsLoading] = useState(false);
     const [refreshing, setRefreshing] = useState(false);

     const fetchDeliveryData = useCallback(async () => {
          try {
               const sumRes = await fetch(`${API_URL}/orders/delivery/${user?.id}/summary`);
               const sumData = await sumRes.json();
               if (sumRes.ok && (sumData.totalEarnings || sumData.deliveredCount)) {
                    setSummary({
                         earnings: sumData.totalEarnings || DELIVERY_STATS_DUMMY.totalEarnings,
                         completedCount: sumData.deliveredCount || DELIVERY_STATS_DUMMY.deliveredCount,
                    });
               }

               const taskRes = await fetch(`${API_URL}/orders/delivery`);
               const taskData = await taskRes.json();
               if (taskRes.ok && taskData?.length > 0) {
                    setActiveTasks(taskData.slice(0, 3));
               }
          } catch {
               // Keep dummy data on error
          } finally {
               setIsLoading(false);
               setRefreshing(false);
          }
     }, [user?.id]);

     useEffect(() => {
          fetchDeliveryData();
     }, [fetchDeliveryData]);

     const onRefresh = useCallback(() => {
          setRefreshing(true);
          fetchDeliveryData();
     }, [fetchDeliveryData]);

     return (
          <View className="flex-1 bg-background">
               {/* Fixed Header */}
               <SafeAreaView edges={['top']} className="bg-white shadow-sm z-20">
                    <View className="px-6 py-4 flex-row justify-between items-center">
                         <View className="flex-row items-center flex-1">
                              <View className="w-12 h-12 bg-neutral-100 rounded-2xl items-center justify-center mr-4 border border-neutral-200">
                                   <UserIcon size={24} color="#006B44" />
                              </View>
                              <View>
                                   <Text className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Delivery Partner</Text>
                                   <Text className="text-neutral-900 text-xl font-black italic">{user?.username || 'Partner'}</Text>
                              </View>
                         </View>
                         <View className="flex-row items-center">
                              <TouchableOpacity
                                   className="bg-neutral-100 p-3 rounded-2xl border border-neutral-200"
                                   onPress={() => logout()}
                              >
                                   <LogOut size={20} color="#64748B" />
                              </TouchableOpacity>
                         </View>
                    </View>

                    {/* Status Bar */}
                    <View className="px-6 py-3 bg-neutral-50 flex-row justify-between items-center border-t border-neutral-100">
                         <Text className="text-neutral-900 font-bold text-xs uppercase italic tracking-wider">{isOnline ? 'Online & Active' : 'Offline'}</Text>
                         <Switch
                              value={isOnline}
                              onValueChange={setIsOnline}
                              trackColor={{ false: '#CBD5E1', true: '#006B44' }}
                              thumbColor="white"
                         />
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
                              colors={['#006B44', '#064E3B']}
                              className="p-8 rounded-[40px] shadow-premium"
                         >
                              <View className="flex-row justify-between items-center mb-6">
                                   <View>
                                        <Text className="text-white/70 text-[10px] font-bold uppercase tracking-[2px]">Total Earnings</Text>
                                        <Text className="text-white text-4xl font-black italic mt-1">₹{summary.earnings.toFixed(0)}</Text>
                                   </View>
                                   <View className="bg-white/20 p-4 rounded-3xl">
                                        <CircleDollarSign size={32} color="white" />
                                   </View>
                              </View>
                              <View className="flex-row justify-between border-t border-white/10 pt-6">
                                   <View>
                                        <Text className="text-white text-lg font-black italic">{summary.completedCount}</Text>
                                        <Text className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">Delivered</Text>
                                   </View>
                                   <View className="items-end">
                                        <Text className="text-white text-lg font-black italic">4.9 ★</Text>
                                        <Text className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">Rating</Text>
                                   </View>
                              </View>
                         </LinearGradient>
                    </View>

                    {/* Active Tasks Section */}
                    <View className="px-6 mt-10">
                         <View className="flex-row justify-between items-center mb-6 px-1">
                              <Text className="text-2xl font-black text-neutral-900 italic tracking-tighter">NEW JOBS</Text>
                              <TouchableOpacity onPress={() => navigation.navigate('DeliveryOrders')}>
                                   <Text className="text-primary-branding font-black text-xs uppercase tracking-widest">See All</Text>
                              </TouchableOpacity>
                         </View>

                         {!isOnline ? (
                              <View className="bg-white rounded-[40px] p-12 items-center justify-center border border-dashed border-neutral-200">
                                   <View className="bg-neutral-50 p-6 rounded-full mb-6">
                                        <Navigation size={40} color="#94A3B8" />
                                   </View>
                                   <Text className="text-neutral-500 font-bold text-center text-sm leading-6">GO ONLINE{'\n'}TO SEE AVAILABLE TASKS</Text>
                              </View>
                         ) : activeTasks.length === 0 ? (
                              <View className="bg-white rounded-[40px] p-12 items-center justify-center border border-dashed border-neutral-200 shadow-sm">
                                   <CheckCircle2 size={48} color="#059669" strokeWidth={1.5} />
                                   <Text className="text-neutral-400 font-bold text-center mt-6 uppercase tracking-widest text-xs">All caught up!</Text>
                              </View>
                         ) : (
                              activeTasks.map((task: any) => (
                                   <TouchableOpacity
                                        key={task._id}
                                        className="bg-white rounded-[32px] p-6 mb-4 shadow-card border border-neutral-50"
                                        onPress={() => navigation.navigate('DeliveryOrders')}
                                   >
                                        <View className="flex-row items-center mb-6">
                                             <View className="bg-neutral-50 p-4 rounded-2xl mr-4 border border-neutral-100">
                                                  <Package size={24} color="#006B44" />
                                             </View>
                                             <View className="flex-1">
                                                  <Text className="text-neutral-900 font-black text-base italic uppercase tracking-tight">Delivery Request</Text>
                                                  <Text className="text-primary-branding font-black text-sm mt-1">₹{task.totalAmount}</Text>
                                             </View>
                                        </View>
                                        <View className="flex-row items-center justify-between bg-neutral-50 p-4 rounded-2xl">
                                             <View className="flex-row items-center flex-1 mr-4">
                                                  <MapPin size={14} color="#64748B" />
                                                  <Text className="text-neutral-500 text-xs font-bold ml-2" numberOfLines={1}>
                                                       {task.deliveryAddress || 'Pending location...'}
                                                  </Text>
                                             </View>
                                             <TouchableOpacity className="bg-primary-branding px-5 py-2.5 rounded-xl">
                                                  <Text className="text-white font-black text-[10px] uppercase">Accept</Text>
                                             </TouchableOpacity>
                                        </View>
                                   </TouchableOpacity>
                              ))
                         )}
                    </View>

                    {/* Hotspot Section */}
                    <View className="px-6 mt-10 mb-24">
                         <Text className="text-2xl font-black text-neutral-900 italic tracking-tighter mb-6 px-1 uppercase">Top Zones</Text>
                         <View className="h-48 bg-neutral-200 rounded-[40px] overflow-hidden shadow-premium relative">
                              <Image
                                   source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80' }}
                                   className="w-full h-full"
                              />
                              <View className="absolute inset-0 bg-black/20" />
                              <View className="absolute top-6 left-6 bg-white/95 px-4 py-2 rounded-2xl">
                                   <Text className="text-primary-branding font-black text-[10px] uppercase tracking-widest">High Demand Zone (1.5x)</Text>
                              </View>
                         </View>
                    </View>
               </ScrollView>

               {/* Emergency Button */}
               <TouchableOpacity className="absolute bottom-10 right-6 bg-red-600 p-5 rounded-full shadow-premium">
                    <Bell size={24} color="white" />
               </TouchableOpacity>
          </View>
     );
};
