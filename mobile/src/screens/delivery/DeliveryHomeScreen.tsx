import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const DeliveryHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { logout, user } = useAuth();

     return (
          <View className="flex-1 bg-blue-700">
               <View className="pt-14 px-6 pb-6 bg-blue-700">
                    <Text className="text-2xl font-bold text-white mb-1">
                         Welcome Delivery Partner
                    </Text>
                    <Text className="text-blue-100">
                         Ready for your next delivery{user?.username ? `, ${user.username}` : ''}?
                    </Text>
               </View>

               <View className="flex-1 bg-white rounded-t-3xl -mt-4 p-6">
                    <View className="bg-blue-50 rounded-2xl p-4 mb-6">
                         <Text className="text-sm text-blue-700 mb-1">Today&apos;s overview</Text>
                         <Text className="text-xl font-bold text-blue-900">Check pending orders</Text>
                    </View>

                    <TouchableOpacity
                         className="bg-blue-600 px-8 py-4 rounded-2xl shadow-md active:bg-blue-700 w-full mb-4"
                         onPress={() => navigation.navigate('DeliveryOrders')}
                    >
                         <Text className="text-white font-bold text-lg text-center">View Pending Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                         className="bg-white border border-red-200 px-8 py-4 rounded-2xl shadow-sm active:bg-red-50 w-full"
                         onPress={logout}
                    >
                         <Text className="text-red-600 font-bold text-lg text-center">Logout</Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
};
