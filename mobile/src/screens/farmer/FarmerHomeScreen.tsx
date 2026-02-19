import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, LogOut } from 'lucide-react-native';

export const FarmerHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { logout } = useAuth();

     return (
          <View className="flex-1 justify-center items-center bg-stone-50 p-6">
               <View className="mb-12 items-center">
                    <Text className="text-4xl font-bold text-emerald-800 mb-3">Farmingo</Text>
                    <Text className="text-stone-500 text-center text-lg max-w-xs">
                         Your digital marketplace for fresh produce and supplies.
                    </Text>
               </View>

               <TouchableOpacity
                    className="bg-emerald-600 w-full py-5 rounded-2xl shadow-sm flex-row justify-center items-center space-x-3 mb-4"
                    onPress={() => navigation.navigate('ProductList')}
                    activeOpacity={0.8}
               >
                    <ShoppingBag color="white" size={24} />
                    <Text className="text-white font-bold text-xl ml-2">Order Products</Text>
               </TouchableOpacity>

               <TouchableOpacity
                    className="bg-white border text-stone-500 border-stone-200 w-full py-5 rounded-2xl flex-row justify-center items-center space-x-3"
                    onPress={logout}
                    activeOpacity={0.7}
               >
                    <LogOut color="#78716c" size={20} />
                    <Text className="text-stone-500 font-bold text-lg ml-2">Sign Out</Text>
               </TouchableOpacity>
          </View>
     );
};
