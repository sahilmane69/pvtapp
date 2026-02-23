import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, MapPin, ChevronLeft, Search, CheckCircle2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const DeliveryOrdersScreen = () => {
     const { user } = useAuth();
     const navigation = useNavigation<any>();
     const [orders, setOrders] = useState<any[]>([]);
     const [isLoading, setIsLoading] = useState(true);
     const [refreshing, setRefreshing] = useState(false);

     const fetchOrders = useCallback(async () => {
          try {
               const response = await fetch(`${API_URL}/orders/delivery`);
               const data = await response.json();
               if (response.ok) setOrders(data);
          } catch {
               // Keep showing existing data
          } finally {
               setIsLoading(false);
               setRefreshing(false);
          }
     }, []);

     useEffect(() => { fetchOrders(); }, [fetchOrders]);

     const onRefresh = useCallback(() => {
          setRefreshing(true);
          fetchOrders();
     }, [fetchOrders]);

     const handleAcceptOrder = useCallback(async (orderId: string) => {
          try {
               const response = await fetch(`${API_URL}/orders/${orderId}/accept`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ deliveryPartnerId: user?.id }),
               });
               const data = await response.json();
               if (response.ok) {
                    Alert.alert('Accepted', 'Order assigned to you!', [
                         { text: 'Go Home', onPress: () => navigation.navigate('DeliveryHome') }
                    ]);
                    setOrders(prev => prev.filter((o: any) => o._id !== orderId));
               } else {
                    Alert.alert('Error', data.message || 'Could not accept order');
               }
          } catch {
               Alert.alert('Error', 'Connection failed');
          }
     }, [user?.id, navigation]);

     if (isLoading && !refreshing) {
          return (
               <View className="flex-1 justify-center items-center bg-white">
                    <ActivityIndicator size="large" color="#2563EB" />
               </View>
          );
     }

     const renderItem = useCallback(({ item }: { item: any }) => (
          <View className="bg-white p-6 mb-5 rounded-[32px] shadow-card border border-neutral-100">
               <View className="flex-row justify-between items-center mb-4">
                    <View className="bg-blue-50 px-3 py-1 rounded-full">
                         <Text className="text-blue-700 font-black text-[10px] uppercase">₹{item.totalAmount} • {item.items.length} Items</Text>
                    </View>
                    <Text className="text-neutral-400 font-bold text-[10px]">#{item._id.slice(-6).toUpperCase()}</Text>
               </View>

               <View className="flex-row items-center mb-6">
                    <View className="bg-blue-600 p-4 rounded-2xl mr-4">
                         <Package size={24} color="white" />
                    </View>
                    <View className="flex-1">
                         <Text className="text-neutral-900 font-black text-lg leading-tight" numberOfLines={1}>
                              Pickup: {item.farmerId?.username || 'Local Farm'}
                         </Text>
                         <View className="flex-row items-center mt-1">
                              <MapPin size={12} color="#64748B" />
                              <Text className="text-neutral-500 text-xs ml-1" numberOfLines={1}>
                                   {item.deliveryAddress || 'Detecting address...'}
                              </Text>
                         </View>
                    </View>
               </View>

               <TouchableOpacity
                    className="bg-blue-700 py-4 rounded-2xl items-center shadow-md active:bg-blue-800"
                    onPress={() => handleAcceptOrder(item._id)}
               >
                    <Text className="text-white font-black uppercase tracking-widest italic">Accept Request</Text>
               </TouchableOpacity>
          </View>
     ), [handleAcceptOrder]);

     return (
          <View className="flex-1 bg-neutral-50">
               <SafeAreaView edges={['top']} className="bg-white shadow-sm">
                    <View className="px-6 py-4 flex-row items-center justify-between">
                         <TouchableOpacity onPress={() => navigation.goBack()}>
                              <ChevronLeft size={24} color="#1E293B" />
                         </TouchableOpacity>
                         <Text className="text-neutral-900 text-xl font-black italic">PENDING TASKS</Text>
                         <TouchableOpacity>
                              <Search size={24} color="#1E293B" />
                         </TouchableOpacity>
                    </View>
               </SafeAreaView>

               <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
                    ListEmptyComponent={
                         <View className="items-center justify-center mt-20">
                              <CheckCircle2 size={64} color="#D1D5DB" strokeWidth={1} />
                              <Text className="text-neutral-400 font-bold text-center mt-4">No pending orders found{'\n'}Check back later!</Text>
                         </View>
                    }
                    renderItem={renderItem}
                    initialNumToRender={8}
                    maxToRenderPerBatch={8}
                    windowSize={10}
                    removeClippedSubviews
               />
          </View>
     );
};
