import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import {
     View,
     Text,
     ScrollView,
     TouchableOpacity,
     Image,
     Animated,
     RefreshControl,
     Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/constants';
import { DUMMY_ORDERS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, AVATAR_URLS } from '../../data/mockData';
import {
     Package,
     MapPin,
     Clock,
     CheckCircle2,
     Truck,
     ChevronRight,
     Navigation,
     RotateCcw,
     ShoppingBag,
     User as UserIcon,
     Star,
     Phone,
     Circle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────
// STATUS TIMELINE CONFIG
// ─────────────────────────────────────────────────────────────────
const STATUS_STEPS = [
     { key: 'placed', label: 'Order Placed', icon: Package },
     { key: 'packed', label: 'Order Packed', icon: Package },
     { key: 'otd', label: 'Out for Delivery', icon: Truck },
     { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

// Map backend statuses to step index
const statusToStep = (status: string): number => {
     if (status === 'delivered') return 3;
     if (status === 'assigned') return 2;
     if (status === 'pending') return 0;
     return 0;
};

// ─────────────────────────────────────────────────────────────────
// ANIMATED PROGRESS TIMELINE
// ─────────────────────────────────────────────────────────────────
const OrderTimeline = ({ status }: { status: string }) => {
     const currentStep = statusToStep(status);
     const animatedWidth = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          const targetPct = currentStep / (STATUS_STEPS.length - 1);
          Animated.timing(animatedWidth, {
               toValue: targetPct,
               duration: 1200,
               useNativeDriver: false,
          }).start();
     }, [currentStep]);

     return (
          <View className="mt-5">
               {/* Progress bar */}
               <View className="relative mx-4 mb-1">
                    <View className="h-1.5 bg-neutral-100 rounded-full" />
                    <Animated.View
                         style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: 6,
                              borderRadius: 99,
                              backgroundColor: '#006B44',
                              width: animatedWidth.interpolate({
                                   inputRange: [0, 1],
                                   outputRange: ['0%', '100%'],
                              }),
                         }}
                    />
               </View>

               {/* Step circles + labels */}
               <View className="flex-row justify-between px-0 mt-2">
                    {STATUS_STEPS.map((step, index) => {
                         const done = index <= currentStep;
                         const Icon = step.icon;
                         return (
                              <View key={step.key} className="items-center flex-1">
                                   <View
                                        className="w-9 h-9 rounded-full items-center justify-center mb-1.5"
                                        style={{ backgroundColor: done ? '#006B44' : '#F1F5F9' }}
                                   >
                                        <Icon size={16} color={done ? '#fff' : '#CBD5E1'} />
                                   </View>
                                   <Text
                                        className="text-[9px] font-black text-center uppercase tracking-tight"
                                        style={{ color: done ? '#006B44' : '#94A3B8' }}
                                        numberOfLines={2}
                                   >
                                        {step.label}
                                   </Text>
                              </View>
                         );
                    })}
               </View>
          </View>
     );
};

// ─────────────────────────────────────────────────────────────────
// ACTIVE ORDER CARD (Swiggy-style)
// ─────────────────────────────────────────────────────────────────
const ActiveOrderCard = memo(({ order, onTrack }: { order: any; onTrack: () => void }) => {
     const pulseAnim = useRef(new Animated.Value(1)).current;

     useEffect(() => {
          if (order.status === 'assigned') {
               Animated.loop(
                    Animated.sequence([
                         Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
                         Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                    ])
               ).start();
          }
     }, [order.status]);

     const statusColor = ORDER_STATUS_COLORS[order.status] || '#006B44';
     const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;

     // Estimated delivery time based on status
     const etaText =
          order.status === 'pending' ? '30–45 min' :
               order.status === 'assigned' ? '15–20 min' : 'Delivered';

     return (
          <View className="bg-white rounded-[32px] overflow-hidden shadow-premium border border-neutral-100 mx-6 mb-4">
               {/* Status header band */}
               <View style={{ backgroundColor: statusColor }} className="px-6 py-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                         <Animated.View style={{ transform: [{ scale: pulseAnim }] }}
                              className="w-3 h-3 rounded-full bg-white/60 mr-2" />
                         <Text className="text-white font-black text-sm uppercase tracking-widest">{statusLabel}</Text>
                    </View>
                    <View className="bg-white/20 px-3 py-1 rounded-xl flex-row items-center">
                         <Clock size={12} color="#fff" />
                         <Text className="text-white font-black text-[10px] ml-1 uppercase">{etaText}</Text>
                    </View>
               </View>

               <View className="p-6">
                    {/* Order ID + date */}
                    <View className="flex-row justify-between items-center mb-4">
                         <View>
                              <Text className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">Order ID</Text>
                              <Text className="text-neutral-900 font-black text-lg italic">
                                   #{order._id?.slice(-6).toUpperCase() || 'ABC123'}
                              </Text>
                         </View>
                         <View className="items-end">
                              <Text className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">Amount</Text>
                              <Text className="text-primary-branding font-black text-xl italic">₹{order.totalAmount}</Text>
                         </View>
                    </View>

                    {/* Items preview */}
                    <View className="flex-row mb-4">
                         {(order.items || []).slice(0, 3).map((item: any, i: number) => (
                              <View key={i}
                                   className="w-14 h-14 rounded-2xl bg-neutral-50 mr-2 overflow-hidden border border-neutral-100 items-center justify-center">
                                   {item.image ? (
                                        <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                                   ) : (
                                        <Package size={24} color="#CBD5E1" />
                                   )}
                              </View>
                         ))}
                         {(order.items || []).length > 3 && (
                              <View className="w-14 h-14 rounded-2xl bg-neutral-100 items-center justify-center">
                                   <Text className="text-neutral-500 font-black text-sm">+{order.items.length - 3}</Text>
                              </View>
                         )}
                    </View>

                    {/* Delivery address */}
                    <View className="flex-row items-start bg-neutral-50 rounded-2xl p-3 mb-4">
                         <MapPin size={16} color="#006B44" style={{ marginTop: 1 }} />
                         <Text className="text-neutral-700 text-xs font-bold ml-2 flex-1" numberOfLines={2}>
                              {order.deliveryAddress || '14 Green Valley, Kothrud, Pune - 411038'}
                         </Text>
                    </View>

                    {/* Delivery partner (if assigned) */}
                    {order.status === 'assigned' && (
                         <View className="flex-row items-center bg-primary-light/50 rounded-2xl p-3 mb-4 border border-primary-light">
                              <View className="w-10 h-10 rounded-2xl overflow-hidden bg-neutral-200 mr-3">
                                   <Image
                                        source={{ uri: AVATAR_URLS.delivery }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                   />
                              </View>
                              <View className="flex-1">
                                   <Text className="text-neutral-500 text-[9px] font-black uppercase tracking-widest">Delivery Partner</Text>
                                   <Text className="text-neutral-900 font-black text-sm">
                                        {order.deliveryPartner || 'Vikram Singh'}
                                   </Text>
                              </View>
                              <View className="flex-row">
                                   <View className="bg-primary-branding w-9 h-9 rounded-xl items-center justify-center mr-2">
                                        <Phone size={16} color="#fff" />
                                   </View>
                                   <View className="bg-white border border-neutral-200 w-9 h-9 rounded-xl items-center justify-center">
                                        <Star size={14} color="#F59E0B" fill="#F59E0B" />
                                   </View>
                              </View>
                         </View>
                    )}

                    {/* Timeline */}
                    <OrderTimeline status={order.status} />

                    {/* Live Track button */}
                    {order.status !== 'delivered' && (
                         <TouchableOpacity
                              onPress={onTrack}
                              activeOpacity={0.85}
                              className="mt-5 bg-primary-branding rounded-2xl py-4 flex-row items-center justify-center shadow-premium"
                         >
                              <Navigation size={18} color="#fff" />
                              <Text className="text-white font-black text-sm uppercase ml-2 tracking-wider">
                                   Live Track Order
                              </Text>
                         </TouchableOpacity>
                    )}
                    {order.status === 'delivered' && (
                         <TouchableOpacity
                              activeOpacity={0.85}
                              className="mt-5 border-2 border-primary-branding rounded-2xl py-4 flex-row items-center justify-center"
                         >
                              <RotateCcw size={16} color="#006B44" />
                              <Text className="text-primary-branding font-black text-sm uppercase ml-2 tracking-wider">
                                   Reorder
                              </Text>
                         </TouchableOpacity>
                    )}
               </View>
          </View>
     );
});

// ─────────────────────────────────────────────────────────────────
// HISTORY ORDER CARD
// ─────────────────────────────────────────────────────────────────
const HistoryCard = memo(({ order, onPress }: { order: any; onPress: () => void }) => {
     const statusColor = ORDER_STATUS_COLORS[order.status] || '#059669';
     const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;

     return (
          <TouchableOpacity
               onPress={onPress}
               activeOpacity={0.8}
               className="bg-white rounded-[24px] p-5 mb-4 mx-6 shadow-card border border-neutral-100"
          >
               <View className="flex-row items-center justify-between mb-3">
                    {/* Left: icon + ID */}
                    <View className="flex-row items-center">
                         <View className="w-12 h-12 rounded-2xl bg-neutral-50 items-center justify-center mr-3 border border-neutral-100">
                              {(order.items?.[0]?.image) ? (
                                   <Image source={{ uri: order.items[0].image }} className="w-full h-full rounded-2xl" resizeMode="cover" />
                              ) : (
                                   <Package size={22} color="#94A3B8" />
                              )}
                         </View>
                         <View>
                              <Text className="text-neutral-900 font-black text-base italic">
                                   #{order._id?.slice(-6).toUpperCase() || 'ABC123'}
                              </Text>
                              <View className="flex-row items-center mt-0.5">
                                   <Clock size={10} color="#94A3B8" />
                                   <Text className="text-neutral-400 text-[10px] font-bold ml-1 uppercase">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                   </Text>
                              </View>
                         </View>
                    </View>

                    {/* Right: status badge */}
                    <View style={{ backgroundColor: statusColor + '18' }} className="px-3 py-1.5 rounded-xl">
                         <Text style={{ color: statusColor }} className="text-[10px] font-black uppercase tracking-wider">
                              {statusLabel}
                         </Text>
                    </View>
               </View>

               {/* Divider */}
               <View className="h-px bg-neutral-50 mb-3" />

               {/* Items summary + price */}
               <View className="flex-row justify-between items-center">
                    <Text className="text-neutral-500 text-xs font-bold flex-1 mr-4" numberOfLines={1}>
                         {(order.items || []).map((i: any) => i.name).join(', ')}
                    </Text>
                    <View className="flex-row items-center">
                         <Text className="text-primary-branding font-black text-base mr-3">₹{order.totalAmount}</Text>
                         <ChevronRight size={16} color="#94A3B8" />
                    </View>
               </View>
          </TouchableOpacity>
     );
});

// ─────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────
export const CustomerDashboardScreen = () => {
     const navigation = useNavigation<any>();
     const { user } = useAuth();

     const [orders, setOrders] = useState<any[]>(DUMMY_ORDERS);
     const [refreshing, setRefreshing] = useState(false);

     const fetchOrders = useCallback(async () => {
          try {
               if (!user?.id) return;
               const res = await fetch(`${API_URL}/orders/customer/${user.id}`);
               const data = await res.json();
               if (res.ok && data?.length > 0) setOrders(data);
          } catch {
               // keep dummy data
          } finally {
               setRefreshing(false);
          }
     }, [user?.id]);

     useEffect(() => { fetchOrders(); }, [fetchOrders]);

     const onRefresh = useCallback(() => { setRefreshing(true); fetchOrders(); }, [fetchOrders]);

     const activeOrders = useMemo(() => orders.filter(o => o.status !== 'delivered'), [orders]);
     const historyOrders = useMemo(() => orders.filter(o => o.status === 'delivered'), [orders]);

     return (
          <View className="flex-1 bg-background">
               {/* ── Header ───────────────────────────────────────────── */}
               <SafeAreaView edges={['top']} className="bg-white shadow-sm">
                    <View className="px-6 pt-4 pb-5 flex-row justify-between items-center">
                         <View>
                              <Text className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">Welcome back</Text>
                              <Text className="text-neutral-900 text-2xl font-black italic tracking-tighter">
                                   My Dashboard
                              </Text>
                         </View>
                         <View className="w-12 h-12 bg-neutral-100 rounded-2xl items-center justify-center border border-neutral-200">
                              <UserIcon size={22} color="#64748B" />
                         </View>
                    </View>

                    {/* Summary strip */}
                    <View className="mx-6 mb-4 flex-row justify-around bg-primary-light rounded-[24px] px-4 py-4">
                         <View className="items-center">
                              <Text className="text-primary-branding font-black text-2xl">{orders.length}</Text>
                              <Text className="text-neutral-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Total</Text>
                         </View>
                         <View className="w-px bg-primary-branding/20" />
                         <View className="items-center">
                              <Text className="text-amber-500 font-black text-2xl">{activeOrders.length}</Text>
                              <Text className="text-neutral-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Active</Text>
                         </View>
                         <View className="w-px bg-primary-branding/20" />
                         <View className="items-center">
                              <Text className="text-emerald-600 font-black text-2xl">{historyOrders.length}</Text>
                              <Text className="text-neutral-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Delivered</Text>
                         </View>
                    </View>
               </SafeAreaView>

               <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#006B44']} />}
               >
                    {/* ── ACTIVE ORDERS ────────────────────────────────────── */}
                    <View className="mt-6">
                         <View className="flex-row justify-between items-center px-6 mb-4">
                              <View>
                                   <Text className="text-neutral-900 text-xl font-black italic uppercase tracking-tight">
                                        Active Orders
                                   </Text>
                                   <Text className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mt-0.5">
                                        {activeOrders.length} in progress
                                   </Text>
                              </View>
                              {/* Live dot */}
                              {activeOrders.length > 0 && (
                                   <View className="flex-row items-center bg-emerald-50 px-3 py-1.5 rounded-xl">
                                        <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                                        <Text className="text-emerald-700 text-[10px] font-black uppercase">Live</Text>
                                   </View>
                              )}
                         </View>

                         {activeOrders.length === 0 ? (
                              <View className="mx-6 bg-white rounded-[28px] p-10 items-center border border-dashed border-neutral-200">
                                   <ShoppingBag size={40} color="#CBD5E1" />
                                   <Text className="text-neutral-400 font-black text-xs uppercase tracking-widest mt-4">
                                        No active orders
                                   </Text>
                                   <TouchableOpacity
                                        onPress={() => navigation.navigate('Home')}
                                        className="mt-5 bg-primary-branding px-8 py-3 rounded-2xl"
                                   >
                                        <Text className="text-white font-black text-xs uppercase tracking-widest">Shop Now</Text>
                                   </TouchableOpacity>
                              </View>
                         ) : (
                              activeOrders.map(order => (
                                   <ActiveOrderCard
                                        key={order._id}
                                        order={order}
                                        onTrack={() => navigation.navigate('Tracking', { orderId: order._id })}
                                   />
                              ))
                         )}
                    </View>

                    {/* ── ORDER HISTORY ─────────────────────────────────────── */}
                    <View className="mt-8 mb-32">
                         <View className="flex-row justify-between items-center px-6 mb-4">
                              <View>
                                   <Text className="text-neutral-900 text-xl font-black italic uppercase tracking-tight">
                                        Order History
                                   </Text>
                                   <Text className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mt-0.5">
                                        {historyOrders.length} completed orders
                                   </Text>
                              </View>
                         </View>

                         {historyOrders.length === 0 ? (
                              <View className="mx-6 bg-white rounded-[28px] p-8 items-center border border-dashed border-neutral-200">
                                   <Text className="text-neutral-400 font-black text-xs uppercase tracking-widest">No past orders</Text>
                              </View>
                         ) : (
                              historyOrders.map(order => (
                                   <HistoryCard
                                        key={order._id}
                                        order={order}
                                        onPress={() => navigation.navigate('Tracking', { orderId: order._id })}
                                   />
                              ))
                         )}
                    </View>
               </ScrollView>
          </View>
     );
};
