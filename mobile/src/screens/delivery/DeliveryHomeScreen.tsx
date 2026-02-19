import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const DeliveryHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { logout } = useAuth();

     return (
          <View className="flex-1 justify-center items-center bg-white p-6">
               <Text className="text-xl font-bold bg-blue-100 p-4 rounded text-blue-800 mb-8">
                    Welcome Delivery Partner 🚚
               </Text>

               <TouchableOpacity
                    className="bg-blue-600 px-8 py-4 rounded-xl shadow-md active:bg-blue-700 w-full mb-4"
                    onPress={() => navigation.navigate('DeliveryOrders')}
               >
                    <Text className="text-white font-bold text-lg text-center">View Pending Orders</Text>
               </TouchableOpacity>

               <TouchableOpacity
                    className="bg-red-500 px-8 py-4 rounded-xl shadow-md active:bg-red-600 w-full"
                    onPress={logout}
               >
                    <Text className="text-white font-bold text-lg text-center">Logout</Text>
               </TouchableOpacity>
          </View>
     );
};
