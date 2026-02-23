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
          <View className="flex-1 bg-white">
               <SafeAreaView className="flex-1">
                    <View className="flex-1 px-8 pt-10">
                         <View className="mb-12">
                              <Text className="text-neutral-900 text-4xl font-black italic tracking-tighter">CHOOSE{'\n'}YOUR PATH</Text>
                              <View className="w-16 h-1.5 bg-primary-branding mt-4 rounded-full" />
                              <Text className="text-neutral-500 font-medium mt-6 text-lg">Select how you want to use the platform</Text>
                         </View>

                         <View className="space-y-4">
                              <RoleCard
                                   title="Customer"
                                   desc="Purchase seeds, tools & machinery"
                                   icon={<ShoppingBag size={32} color={selectedRole === 'CUSTOMER' ? '#fff' : '#006B44'} />}
                                   selected={selectedRole === 'CUSTOMER'}
                                   onPress={() => handleRoleSelect('CUSTOMER')}
                              />

                              <RoleCard
                                   title="Farmer"
                                   desc="List your farm produce for sale"
                                   icon={<Tractor size={32} color={selectedRole === 'FARMER' ? '#fff' : '#006B44'} />}
                                   selected={selectedRole === 'FARMER'}
                                   onPress={() => handleRoleSelect('FARMER')}
                              />

                              <RoleCard
                                   title="Delivery Partner"
                                   desc="Deliver orders and earn money"
                                   icon={<Truck size={32} color={selectedRole === 'DELIVERY' ? '#fff' : '#006B44'} />}
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
          className={`p-8 rounded-[36px] flex-row items-center border-2 mb-4 ${selected ? 'bg-primary-branding border-primary-branding shadow-premium' : 'bg-neutral-50 border-neutral-100'}`}
          onPress={onPress}
          activeOpacity={0.8}
     >
          <View className={`p-5 rounded-3xl ${selected ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
               {icon}
          </View>
          <View className="flex-1 ml-6">
               <Text className={`text-2xl font-black italic ${selected ? 'text-white' : 'text-neutral-900'}`}>{title.toUpperCase()}</Text>
               <Text className={`${selected ? 'text-white/80' : 'text-neutral-500'} text-xs font-bold mt-1 uppercase tracking-widest`}>{desc}</Text>
          </View>
     </TouchableOpacity>
);
