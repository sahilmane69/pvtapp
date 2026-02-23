import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
     LayoutDashboard,
     Package,
     TrendingUp,
     Plus,
     ChevronRight,
     DollarSign,
     ShoppingBag,
     Bell,
     Settings,
     Clock,
     CheckCircle2,
     LogOut
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../utils/constants';

const { width } = Dimensions.get('window');

interface Stats {
     totalOrders: number;
     completedDeliveries: number;
     pendingOrders: number;
     earnings: number;
}

export const FarmerDashboardScreen = () => {
     const { user, logout } = useAuth();
     const navigation = useNavigation<any>();
     const [stats, setStats] = useState<Stats>({
          totalOrders: 0,
          completedDeliveries: 0,
          pendingOrders: 0,
          earnings: 0
     });
     const [recentOrders, setRecentOrders] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
     const [refreshing, setRefreshing] = useState(false);

     const fetchDashboardData = async () => {
          try {
               const response = await fetch(`${API_URL}/orders/farmer/${user?.id}`);
               const orders = await response.json();

               if (response.ok) {
                    const completed = orders.filter((o: any) => o.status === 'delivered');
                    const pending = orders.filter((o: any) => o.status === 'pending');
                    const totalEarnings = completed.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

                    setStats({
                         totalOrders: orders.length,
                         completedDeliveries: completed.length,
                         pendingOrders: pending.length,
                         earnings: totalEarnings
                    });
                    setRecentOrders(orders.slice(0, 5));
               }
          } catch (error) {
               console.error('Dashboard fetch error:', error);
          } finally {
               setIsLoading(false);
               setRefreshing(false);
          }
     };

     useEffect(() => {
          fetchDashboardData();
     }, []);

     const onRefresh = () => {
          setRefreshing(true);
          fetchDashboardData();
     };

     if (isLoading) {
          return (
               <View className="flex-1 justify-center items-center bg-background">
                    <ActivityIndicator size="large" color="#059669" />
               </View>
          );
     }

     return (
          <View className="flex-1 bg-background">
               {/* Header */}
               <View className="bg-emerald-800 pb-12 rounded-b-[40px] shadow-premium">
                    <SafeAreaView edges={['top']}>
                         <View className="px-6 pt-4 flex-row justify-between items-center">
                              <View>
                                   <Text className="text-emerald-100/70 text-sm font-medium">Farmer Dashboard</Text>
                                   <Text className="text-white text-2xl font-black">{user?.username || 'Farmer'}</Text>
                              </View>
                              <View className="flex-row items-center">
                                   <TouchableOpacity className="bg-white/10 p-2.5 rounded-2xl mr-2">
                                        <Bell size={22} color="white" />
                                   </TouchableOpacity>
                                   <TouchableOpacity 
                                        className="bg-red-500/20 p-2.5 rounded-2xl"
                                        onPress={() => logout()}
                                   >
                                        <LogOut size={22} color="white" />
                                   </TouchableOpacity>
                              </View>
                         </View>

                         {/* Quick Stats Grid */}
                         <View className="flex-row flex-wrap px-6 mt-8 justify-between">
                              <StatCard
                                   title="Earnings"
                                   value={`₹${stats.earnings.toLocaleString()}`}
                                   icon={<DollarSign size={20} color="white" />}
                                   colors={['#059669', '#064E3B']}
                              />
                              <StatCard
                                   title="Total Orders"
                                   value={stats.totalOrders.toString()}
                                   icon={<ShoppingBag size={20} color="white" />}
                                   colors={['#0284C7', '#075985']}
                              />
                              <StatCard
                                   title="Completed"
                                   value={stats.completedDeliveries.toString()}
                                   icon={<CheckCircle2 size={20} color="white" />}
                                   colors={['#7C3AED', '#5B21B6']}
                              />
                              <StatCard
                                   title="Pending"
                                   value={stats.pendingOrders.toString()}
                                   icon={<Clock size={20} color="white" />}
                                   colors={['#EA580C', '#9A3412']}
                              />
                         </View>
                    </SafeAreaView>
               </View>

               <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
               >
                    {/* Main Actions */}
                    <View className="px-6 -mt-6">
                         <View className="bg-white p-6 rounded-3xl shadow-card flex-row justify-around border border-neutral-100">
                              <ActionItem
                                   label="Add Product"
                                   icon={<Plus size={24} color="#059669" />}
                                   bgColor="bg-emerald-50"
                                   onPress={() => navigation.navigate('AddProduct')}
                              />
                              <ActionItem
                                   label="Inventory"
                                   icon={<Package size={24} color="#2563EB" />}
                                   bgColor="bg-blue-50"
                                   onPress={() => { }}
                              />
                              <ActionItem
                                   label="Orders"
                                   icon={<TrendingUp size={24} color="#D97706" />}
                                   bgColor="bg-amber-50"
                                   onPress={() => navigation.navigate('FarmerOrders')}
                              />
                         </View>
                    </View>

                    {/* Recent Orders Section */}
                    <View className="px-6 mt-8 mb-24">
                         <View className="flex-row justify-between items-center mb-5">
                              <Text className="text-xl font-bold text-neutral-900">Recent Activity</Text>
                              <TouchableOpacity onPress={() => navigation.navigate('FarmerOrders')}>
                                   <Text className="text-emerald-700 font-bold">See All</Text>
                              </TouchableOpacity>
                         </View>

                         {recentOrders.length === 0 ? (
                              <View className="bg-white p-10 rounded-3xl items-center border border-dashed border-neutral-200">
                                   <Package size={48} color="#D1D5DB" />
                                   <Text className="text-neutral-400 font-medium mt-4">No recent orders</Text>
                              </View>
                         ) : (
                              recentOrders.map((order: any) => (
                                   <OrderListItem key={order._id} order={order} onPress={() => navigation.navigate('Tracking', { orderId: order._id })} />
                              ))
                         )}
                    </View>
               </ScrollView>

               {/* New Floating Action Button */}
               <TouchableOpacity
                    onPress={() => navigation.navigate('AddProduct')}
                    className="absolute bottom-10 right-6 bg-emerald-700 p-5 rounded-3xl shadow-premium"
               >
                    <Plus size={32} color="white" />
               </TouchableOpacity>
          </View>
     );
};

const StatCard = ({ title, value, icon, colors }: any) => (
     <View style={{ width: '48%' }} className="mb-4">
          <LinearGradient colors={colors} className="p-4 rounded-3xl shadow-sm">
               <View className="bg-white/20 p-2 rounded-xl self-start mb-3">
                    {icon}
               </View>
               <Text className="text-white/70 text-[10px] font-bold uppercase tracking-wider">{title}</Text>
               <Text className="text-white text-xl font-black">{value}</Text>
          </LinearGradient>
     </View>
);

const ActionItem = ({ label, icon, bgColor, onPress }: any) => (
     <TouchableOpacity className="items-center" onPress={onPress}>
          <View className={`${bgColor} p-4 rounded-2xl`}>
               {icon}
          </View>
          <Text className="text-neutral-700 text-xs font-bold mt-2">{label}</Text>
     </TouchableOpacity>
);

const OrderListItem = ({ order, onPress }: any) => (
     <TouchableOpacity
          onPress={onPress}
          className="bg-white p-4 rounded-2xl mb-4 border border-neutral-100 flex-row items-center shadow-sm"
     >
          <View className="bg-neutral-100 p-3 rounded-2xl mr-4">
               <Package size={24} color="#64748B" />
          </View>
          <View className="flex-1">
               <View className="flex-row justify-between items-center">
                    <Text className="font-bold text-neutral-900 text-base">ORD-{order._id.slice(-6).toUpperCase()}</Text>
                    <Text className="text-emerald-700 font-bold">₹{order.totalAmount}</Text>
               </View>
               <View className="flex-row items-center mt-1">
                    <Text className="text-neutral-500 text-xs">{order.items.length} Items • {new Date(order.createdAt).toLocaleDateString()}</Text>
                    <View className={`ml-2 px-2 py-0.5 rounded-lg ${order.status === 'delivered' ? 'bg-green-100' :
                         order.status === 'assigned' ? 'bg-blue-100' : 'bg-amber-100'
                         }`}>
                         <Text className={`text-[10px] font-black uppercase ${order.status === 'delivered' ? 'text-green-700' :
                              order.status === 'assigned' ? 'text-blue-700' : 'text-amber-700'
                              }`}>{order.status}</Text>
                    </View>
               </View>
          </View>
          <ChevronRight size={20} color="#94A3B8" />
     </TouchableOpacity>
);
