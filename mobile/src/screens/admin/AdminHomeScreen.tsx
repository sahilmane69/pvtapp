import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ShieldCheck, ShoppingBag, Users, Settings } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const AdminHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { logout } = useAuth();

     return (
          <View className="flex-1 bg-emerald-50">
               <SafeAreaView edges={['top']} className="bg-emerald-900 rounded-b-[40px] pb-10 shadow-premium">
                    <View className="px-6 pt-4 flex-row justify-between items-center">
                         <View>
                              <Text className="text-emerald-100/70 text-sm font-bold uppercase tracking-widest">Admin Control</Text>
                              <Text className="text-white text-2xl font-black">Dashboard</Text>
                         </View>
                         <TouchableOpacity
                              className="bg-white/10 p-3 rounded-2xl"
                              onPress={() => logout()}
                         >
                              <LogOut size={22} color="white" />
                         </TouchableOpacity>
                    </View>

                    <View className="px-6 mt-8 flex-row items-center">
                         <View className="bg-white/20 p-3 rounded-2xl mr-4">
                              <ShieldCheck size={32} color="white" />
                         </View>
                         <View>
                              <Text className="text-white text-lg font-bold">System Status: Online</Text>
                              <Text className="text-emerald-100/60 text-xs">Marketplace is running smoothly</Text>
                         </View>
                    </View>
               </SafeAreaView>

               <View className="px-6 -mt-8">
                    <View className="bg-white rounded-3xl p-6 shadow-card border border-emerald-100">
                         <Text className="text-neutral-900 text-lg font-black mb-6 italic uppercase">Core Management</Text>

                         <TouchableOpacity
                              className="bg-emerald-600 rounded-2xl py-5 px-6 mb-4 flex-row items-center shadow-md"
                              onPress={() => navigation.navigate('AdminProducts')}
                         >
                              <View className="bg-white/20 p-2 rounded-xl mr-4">
                                   <ShoppingBag size={24} color="white" />
                              </View>
                              <Text className="text-white font-black text-lg italic">MANAGE LISTINGS</Text>
                         </TouchableOpacity>

                         <View className="flex-row justify-between">
                              <TouchableOpacity className="bg-emerald-50 rounded-2xl p-4 w-[48%] items-center border border-emerald-100">
                                   <Users size={24} color="#059669" />
                                   <Text className="text-emerald-800 font-bold mt-2 text-xs">Users</Text>
                              </TouchableOpacity>
                              <TouchableOpacity className="bg-emerald-50 rounded-2xl p-4 w-[48%] items-center border border-emerald-100">
                                   <Settings size={24} color="#059669" />
                                   <Text className="text-emerald-800 font-bold mt-2 text-xs">Settings</Text>
                              </TouchableOpacity>
                         </View>
                    </View>
               </View>

               <View className="px-6 mt-8">
                    <Text className="text-neutral-900 text-xl font-black italic mb-4 uppercase">Notifications</Text>
                    <View className="bg-white p-6 rounded-3xl items-center border border-dashed border-emerald-200">
                         <Text className="text-emerald-600 font-bold">No new system alerts</Text>
                    </View>
               </View>
          </View>
     );
};

