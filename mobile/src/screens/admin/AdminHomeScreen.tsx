import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

export const AdminHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { logout } = useAuth();

     return (
          <View className="flex-1 bg-emerald-900 p-6">
               <View className="mt-10 mb-8">
                    <Text className="text-3xl font-bold text-white mb-2">Farmingo Admin</Text>
                    <Text className="text-emerald-100">Manage products and monitor the marketplace.</Text>
               </View>

               <View className="bg-white rounded-3xl p-6 space-y-4">
                    <TouchableOpacity
                         className="bg-emerald-600 rounded-2xl py-4 px-4 mb-3"
                         onPress={() => navigation.navigate('AdminProducts')}
                    >
                         <Text className="text-white font-bold text-lg text-center">Manage Products</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                         className="bg-emerald-50 rounded-2xl py-4 px-4 border border-emerald-200"
                         onPress={logout}
                    >
                         <Text className="text-emerald-800 font-semibold text-center">Logout</Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
};

