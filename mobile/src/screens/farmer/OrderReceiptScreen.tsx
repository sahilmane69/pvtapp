import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Share, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle, Share2, Download, Home, ShoppingBag, MapPin, Calendar, Clock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const OrderReceiptScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { order } = route.params || {};

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Order Receipt from FarminGo\nOrder ID: ${order?._id || 'N/A'}\nTotal Amount: ₹${order?.totalAmount?.toFixed(2)}\nDelivery to: ${order?.deliveryAddress}`,
            });
        } catch (error) {
            Alert.alert('Error', 'Could not share receipt');
        }
    };

    if (!order) return <View className="flex-1 items-center justify-center bg-white"><Text>Order details not found.</Text></View>;

    const date = new Date(order.createdAt || Date.now()).toLocaleDateString();
    const time = new Date(order.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                {/* Receipt Header Card */}
                <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 items-center overflow-hidden">
                    {/* Tick Icon */}
                    <View className="bg-emerald-100 p-4 rounded-full mb-4">
                        <CheckCircle size={48} color="#059669" />
                    </View>

                    <Text className="text-2xl font-bold text-gray-900 mb-1">Receipt</Text>
                    <Text className="text-gray-500 mb-6">Payment successful & order placed</Text>

                    {/* Dotted Divider */}
                    <View className="w-full h-[1px] border-dashed border-gray-200 border bg-transparent mb-6" />

                    {/* Order Details Grid */}
                    <View className="w-full flex-row justify-between mb-4">
                        <View>
                            <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Order ID</Text>
                            <Text className="text-gray-800 font-bold">#{order._id?.slice(-8).toUpperCase()}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Date & Time</Text>
                            <View className="flex-row items-center">
                                <Calendar size={12} color="#6b7280" className="mr-1" />
                                <Text className="text-gray-800 text-xs mr-2">{date}</Text>
                                <Clock size={12} color="#6b7280" className="mr-1" />
                                <Text className="text-gray-800 text-xs">{time}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Items List */}
                    <View className="w-full space-y-3 mb-6">
                        <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Order Summary</Text>
                        {order.items?.map((item: any, index: number) => (
                            <View key={index} className="flex-row justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-bold" numberOfLines={1}>{item.name}</Text>
                                    <Text className="text-gray-500 text-xs">{item.quantity} x ₹{item.price}</Text>
                                </View>
                                <Text className="text-emerald-700 font-bold ml-4">₹{(item.price * item.quantity).toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Total */}
                    <View className="w-full bg-emerald-600 rounded-2xl p-4 flex-row justify-between items-center">
                        <Text className="text-emerald-50 text-xl font-bold">Total Amount</Text>
                        <Text className="text-white text-3xl font-extrabold">₹{order.totalAmount?.toFixed(2)}</Text>
                    </View>

                    {/* Delivery Info */}
                    <View className="w-full mt-6 flex-row items-start">
                        <MapPin size={20} color="#6b7280" className="mr-3 mt-1" />
                        <View className="flex-1">
                            <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Delivery Address</Text>
                            <Text className="text-gray-700 text-sm">{order.deliveryAddress}</Text>
                        </View>
                    </View>

                    {/* Receipt Footer */}
                    <View className="w-full mt-8 p-3 bg-gray-50 rounded-xl border border-gray-100 items-center">
                        <Text className="text-gray-400 text-xs italic">Thank you for using FarminGo!</Text>
                        <Text className="text-gray-400 text-xs italic">Digital Receipt - Valid for 100 days</Text>
                    </View>
                </View>

                {/* Actions */}
                <View className="flex-row space-x-3 mt-6 mb-12">
                    <TouchableOpacity 
                        onPress={handleShare}
                        className="flex-1 bg-white border border-gray-200 py-4 rounded-2xl flex-row items-center justify-center"
                    >
                        <Share2 size={20} color="#374151" className="mr-2" />
                        <Text className="text-gray-700 font-bold ml-2">Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className="flex-1 bg-white border border-gray-200 py-4 rounded-2xl flex-row items-center justify-center"
                    >
                        <Download size={20} color="#374151" className="mr-2" />
                        <Text className="text-gray-700 font-bold ml-2">Download</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Primary Button */}
            <View className="p-4 bg-white border-t border-gray-100 flex-row space-x-3">
                <TouchableOpacity 
                    onPress={() => navigation.navigate('FarmerHome')}
                    className="flex-1 border border-emerald-600 py-4 rounded-xl items-center"
                >
                    <Text className="text-emerald-700 font-bold">Go to Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Tracking', { orderId: order._id })}
                    className="flex-1 bg-emerald-600 py-4 rounded-xl items-center shadow-md shadow-emerald-200"
                >
                    <Text className="text-white font-bold">Track Shipment</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
