import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, LogOut } from 'lucide-react-native';

export const FarmerHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { logout, user } = useAuth();

     return (
          <View className="flex-1 bg-emerald-700">
               <View className="pt-14 px-6 pb-6 bg-emerald-700">
                    <Text className="text-2xl font-bold text-white mb-1">
                         Get in 15 Minutes
                    </Text>
                    <Text className="text-emerald-100">
                         Welcome{user?.username ? `, ${user.username}` : ''} 👋
                    </Text>

                    <View className="mt-4 bg-white/10 border border-emerald-400/40 rounded-2xl px-4 py-3">
                         <Text className="text-emerald-50 text-sm">Search “seeds”</Text>
                    </View>
               </View>

               <View className="flex-1 bg-stone-50 rounded-t-3xl -mt-4 p-6">
                    <View className="bg-emerald-50 rounded-2xl p-4 mb-6">
                         <Text className="text-sm text-emerald-700 mb-1">Happiness plants…</Text>
                         <Text className="text-xl font-bold text-emerald-900">
                              Get up to 35% OFF
                         </Text>
                    </View>

                    <TouchableOpacity
                         className="bg-emerald-600 w-full py-5 rounded-2xl shadow-sm flex-row justify-center items-center mb-4"
                         onPress={() => navigation.navigate('ProductList')}
                         activeOpacity={0.8}
                    >
                         <ShoppingBag color="white" size={24} />
                         <Text className="text-white font-bold text-xl ml-2">Order Products</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                         className="bg-white border text-stone-500 border-stone-200 w-full py-5 rounded-2xl flex-row justify-center items-center"
                         onPress={logout}
                         activeOpacity={0.7}
                    >
                         <LogOut color="#78716c" size={20} />
                         <Text className="text-stone-500 font-bold text-lg ml-2">Sign Out</Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
};
