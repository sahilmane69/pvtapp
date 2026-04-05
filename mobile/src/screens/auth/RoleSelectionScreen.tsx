import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Tractor, Truck, ShoppingBag, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../../utils/constants';

const { width } = Dimensions.get('window');

export const RoleSelectionScreen = () => {
     const [selectedRole, setSelectedRole] = useState<string | null>(null);
     const { user, setUserRole, setUser } = useAuth();

     const handleRoleSelect = async (role: 'FARMER' | 'DELIVERY' | 'CUSTOMER') => {
          if (!user?.id) {
               Alert.alert('Not logged in', 'Please log in again.');
               return;
          }

          setSelectedRole(role);

          try {
               const response = await fetch(`${API_URL}/auth/set-role`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                         userId: user.id,
                         role: role.toLowerCase(),
                    }),
               });

               const data = await response.json();

               if (response.ok) {
                    await setUser({ id: user.id, username: user.username, role });
                    await setUserRole(role);
               } else {
                    Alert.alert('Error', data.message || 'Could not set role');
               }
          } catch (error) {
               console.error(error);
               Alert.alert('Error', 'Could not connect to server');
          }
     };

     return (
          <View className="flex-1 bg-[#E8F5E9]">
               <SafeAreaView className="flex-1">
                    <View className="flex-1 px-8 pt-12 items-center">
                         {/* Placeholder for the illustration */}
                         <View className="mb-6 items-center">
                              <Image 
                                   source={require('../../../assets/icon.png')} 
                                   style={{ width: 120, height: 120 }} 
                                   resizeMode="contain" 
                              />
                         </View>

                         <View className="items-center mb-10 w-full">
                              <Text className="text-[#006B44] text-[28px] font-black italic tracking-tight text-center">CHOOSE YOUR PATH</Text>
                              <Text className="text-[#64748B] font-bold mt-2 text-[15px] text-center">How would you like to use FarminGo?</Text>
                         </View>

                         <View className="space-y-4 w-full">
                              <RoleCard
                                   title="Customer"
                                   desc="I want to buy fresh seeds & tools"
                                   icon={<ShoppingBag size={24} color="#006B44" />}
                                   selected={selectedRole === 'CUSTOMER'}
                                   onPress={() => handleRoleSelect('CUSTOMER')}
                              />

                              <RoleCard
                                   title="Farmer"
                                   desc="I want to sell my produce"
                                   icon={<Tractor size={24} color="#006B44" />}
                                   selected={selectedRole === 'FARMER'}
                                   onPress={() => handleRoleSelect('FARMER')}
                              />

                              <RoleCard
                                   title="Delivery Partner"
                                   desc="I want to deliver and earn"
                                   icon={<Truck size={24} color="#006B44" />}
                                   selected={selectedRole === 'DELIVERY'}
                                   onPress={() => handleRoleSelect('DELIVERY')}
                              />
                         </View>
                    </View>
               </SafeAreaView>
          </View>
     );
};

const RoleCard = ({ title, desc, icon, selected, onPress }: any) => (
     <TouchableOpacity
          className="bg-white p-5 rounded-[24px] flex-row items-center border-[1.5px] border-transparent mb-4 shadow-sm"
          style={{
               shadowColor: '#000',
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.05,
               shadowRadius: 10,
               elevation: 2,
               ...(selected ? { borderColor: '#006B44' } : {})
          }}
          onPress={onPress}
          activeOpacity={0.8}
     >
          <View className="w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100">
               {icon}
          </View>
          <View className="flex-1 ml-4 justify-center">
               <Text className="text-xl font-bold text-[#1E293B] italic">{title}</Text>
               <Text className="text-[#64748B] text-[12px] font-medium mt-1">{desc}</Text>
          </View>
          <View className="ml-2">
               <ChevronRight size={20} color="#94A3B8" />
          </View>
     </TouchableOpacity>
);
