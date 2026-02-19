import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export const OrderConfirmationScreen = () => {
     const navigation = useNavigation<any>();
     const route = useRoute<any>();
     const { orderId } = route.params || {};
     const displayId = orderId ? `#${orderId}` : `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;

     return (
          <View className="flex-1 justify-center items-center bg-white p-6">
               <View className="bg-green-100 p-6 rounded-full mb-6">
                    <Text className="text-6xl">✅</Text>
               </View>

               <Text className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</Text>
               <Text className="text-gray-600 text-lg mb-8">
                    Order ID: <Text className="font-bold text-gray-800">{displayId}</Text>
               </Text>

               <Text className="text-gray-500 text-center mb-8">
                    Your order has been sent to the nearest delivery agent. You can track it in the 'Orders' section.
               </Text>

               <TouchableOpacity
                    className="bg-green-600 px-8 py-4 rounded-xl shadow-md active:bg-green-700 w-full"
                    onPress={() => navigation.navigate('FarmerHome')}
               >
                    <Text className="text-white font-bold text-lg text-center">Back to Home</Text>
               </TouchableOpacity>
          </View>
     );
};
