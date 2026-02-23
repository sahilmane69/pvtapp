import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ShieldCheck, ShoppingBag, Users, Settings, User as UserIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const AdminHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { logout } = useAuth();

     return (
          <View className="flex-1 bg-background">
               {/* Premium White Header */}
               <View className="bg-white rounded-b-[48px] pb-10 shadow-sm">
                    <SafeAreaView edges={['top']}>
                         <View className="px-6 pt-6 flex-row justify-between items-center">
                              <View className="flex-row items-center flex-1">
                                   <View className="w-12 h-12 bg-neutral-100 rounded-2xl items-center justify-center mr-4 border border-neutral-200">
                                        <UserIcon size={24} color="#059669" />
                                   </View>
                                   <View>
                                        <Text className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Administrator</Text>
                                        <Text className="text-neutral-900 text-2xl font-black italic">Control Hub</Text>
                                   </View>
                              </View>
                              <TouchableOpacity
                                   className="bg-neutral-100 p-3 rounded-2xl border border-neutral-200"
                                   onPress={() => logout()}
                              >
                                   <LogOut size={20} color="#64748B" />
                              </TouchableOpacity>
                         </View>

                         {/* Status Indicator */}
                         <View className="px-6 mt-8 flex-row items-center bg-emerald-50/50 mx-6 p-4 rounded-3xl border border-emerald-100">
                              <View className="bg-emerald-600 p-3 rounded-2xl mr-4 shadow-sm">
                                   <ShieldCheck size={28} color="white" />
                              </View>
                              <View>
                                   <Text className="text-emerald-900 text-base font-black italic uppercase tracking-tight">System Status: Online</Text>
                                   <Text className="text-emerald-600/60 text-[10px] font-bold uppercase tracking-widest mt-1">Marketplace is stable</Text>
                              </View>
                         </View>
                    </SafeAreaView>
               </View>

               <View className="px-6 -mt-8">
                    <View className="bg-white rounded-[40px] p-8 shadow-card border border-neutral-50">
                         <Text className="text-neutral-900 text-2xl font-black mb-8 italic uppercase tracking-tighter">Core Management</Text>

                         <TouchableOpacity
                              className="bg-emerald-700 rounded-3xl py-6 px-8 mb-6 flex-row items-center shadow-premium"
                              onPress={() => navigation.navigate('AdminProducts')}
                         >
                              <View className="bg-white/20 p-3 rounded-2xl mr-5">
                                   <ShoppingBag size={28} color="white" />
                              </View>
                              <Text className="text-white font-black text-xl italic uppercase font-bold">Manage Listings</Text>
                         </TouchableOpacity>

                         <View className="flex-row justify-between">
                              <TouchableOpacity className="bg-neutral-50 rounded-[32px] p-6 w-[48%] items-center border border-neutral-100">
                                   <Users size={28} color="#059669" />
                                   <Text className="text-neutral-900 font-black mt-3 text-[10px] uppercase tracking-widest italic">Users</Text>
                              </TouchableOpacity>
                              <TouchableOpacity className="bg-neutral-50 rounded-[32px] p-6 w-[48%] items-center border border-neutral-100">
                                   <Settings size={28} color="#059669" />
                                   <Text className="text-neutral-900 font-black mt-3 text-[10px] uppercase tracking-widest italic">Settings</Text>
                              </TouchableOpacity>
                         </View>
                    </View>
               </View>

               <View className="px-6 mt-10">
                    <Text className="text-neutral-900 text-2xl font-black italic mb-6 uppercase tracking-tighter px-2">Notifications</Text>
                    <View className="bg-white p-10 rounded-[40px] items-center border border-dashed border-neutral-200">
                         <Text className="text-neutral-400 font-bold uppercase tracking-widest text-xs">No new system alerts</Text>
                    </View>
               </View>
          </View>
     );
};
