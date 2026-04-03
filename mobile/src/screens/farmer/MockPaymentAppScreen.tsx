import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle, XCircle, ShieldCheck, ArrowLeft, Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../../utils/constants';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MockPaymentAppScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { orderData } = route.params || {};
    const { clearCart } = useCart();
    const [status, setStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
    const [progress] = useState(new Animated.Value(0));

    const handleConfirmPayment = async () => {
        setStatus('processing');
        
        // Simulate progress bar animation
        Animated.timing(progress, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: false,
        }).start();

        // Actual API call to create order
        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            // Short delay to let the animation feel real
            setTimeout(() => {
                if (response.ok) {
                    setStatus('success');
                    clearCart();
                    // After success, navigate to receipt screen
                    setTimeout(() => {
                        navigation.navigate('OrderReceipt', { order: data.order || data });
                    }, 1500);
                } else {
                    setStatus('failed');
                }
            }, 2500);
        } catch (error) {
            console.error(error);
            setStatus('failed');
        }
    };

    if (status === 'processing' || status === 'success' || status === 'failed') {
        const progressWidth = progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%']
        });

        return (
            <SafeAreaView className="flex-1 bg-[#121212] justify-center items-center p-6">
                <View className="w-full items-center">
                    {status === 'processing' && (
                        <>
                            <ActivityIndicator size="large" color="#4ade80" />
                            <Text className="text-white text-xl font-bold mt-6">Processing Payment...</Text>
                            <Text className="text-gray-400 mt-2 text-center">Please do not close the app or press back</Text>
                            <View className="w-full h-1 bg-gray-800 rounded-full mt-8 overflow-hidden">
                                <Animated.View 
                                    style={{ 
                                        width: progressWidth, 
                                        height: '100%', 
                                        backgroundColor: '#4ade80' 
                                    }} 
                                />
                            </View>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle size={80} color="#4ade80" />
                            <Text className="text-white text-2xl font-bold mt-6">Payment Successful!</Text>
                            <Text className="text-gray-400 mt-2 text-center">Redirecting you back to FarminGo...</Text>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <XCircle size={80} color="#ef4444" />
                            <Text className="text-white text-2xl font-bold mt-6">Payment Failed</Text>
                            <Text className="text-gray-400 mt-2 text-center">Something went wrong with your transaction.</Text>
                            <TouchableOpacity 
                                onPress={() => navigation.goBack()}
                                className="mt-8 bg-white/10 px-6 py-3 rounded-xl"
                            >
                                <Text className="text-white font-bold">Try Again</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Mock Header for "SecurePay" */}
            <View className="bg-indigo-700 p-6 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <ShieldCheck size={28} color="white" />
                    <Text className="text-white text-xl font-bold ml-2 italic">SecurePay</Text>
                </View>
                <View className="bg-white/20 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold uppercase">Safe Mode</Text>
                </View>
            </View>

            <View className="p-6">
                <View className="flex-row justify-between items-center mb-8">
                    <View>
                        <Text className="text-gray-500 uppercase text-xs font-bold tracking-widest">Merchant</Text>
                        <Text className="text-gray-900 text-lg font-bold">FarminGo Marketplace</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-gray-500 uppercase text-xs font-bold tracking-widest">Amount</Text>
                        <Text className="text-indigo-700 text-3xl font-bold">₹{orderData?.totalAmount?.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Simulated UPI Selection */}
                <View className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
                    <View className="flex-row items-center mb-4">
                        <Info size={16} color="#4b5563" />
                        <Text className="text-gray-600 text-sm ml-2">Choose your preferred UPI app</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <View className="items-center opacity-40">
                            <View className="w-14 h-14 bg-gray-200 rounded-2xl items-center justify-center mb-1">
                                <Text className="text-xs font-bold text-gray-500">GPay</Text>
                            </View>
                        </View>
                        <View className="items-center">
                            <View className="w-14 h-14 bg-indigo-100 border-2 border-indigo-500 rounded-2xl items-center justify-center mb-1">
                                <Text className="text-xs font-bold text-indigo-700">PhonePe</Text>
                            </View>
                            <View className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        </View>
                        <View className="items-center opacity-40">
                            <View className="w-14 h-14 bg-gray-200 rounded-2xl items-center justify-center mb-1">
                                <Text className="text-xs font-bold text-gray-500">Paytm</Text>
                            </View>
                        </View>
                        <View className="items-center opacity-40">
                            <View className="w-14 h-14 bg-gray-200 rounded-2xl items-center justify-center mb-1">
                                <Text className="text-xs font-bold text-gray-500">Other</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex-row mb-8">
                    <ShieldCheck size={20} color="#b45309" />
                    <Text className="text-amber-800 text-xs ml-3 flex-1">
                        This is a simulated payment gateway. Your real bank account will not be debited.
                    </Text>
                </View>
            </View>

            <View className="mt-auto p-6 border-t border-gray-100">
                <TouchableOpacity 
                    onPress={handleConfirmPayment}
                    className="bg-indigo-700 py-4 rounded-2xl items-center shadow-lg shadow-indigo-200"
                >
                    <Text className="text-white font-bold text-xl">Confirm & Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="mt-4 py-2 items-center"
                >
                    <Text className="text-gray-400 font-bold">Cancel Transaction</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
