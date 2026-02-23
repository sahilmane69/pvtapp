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
          <View className="flex-1 bg-primary-light">
               <SafeAreaView className="flex-1">
                    <View className="flex-1 justify-center px-8">
                         <View className="items-center mb-10">
                              <Image
                                   source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3588/3588616.png' }}
                                   className="w-32 h-32 mb-6"
                                   resizeMode="contain"
                              />
                              <Text className="text-primary-branding text-3xl font-black italic">CHOOSE YOUR PATH</Text>
                              <Text className="text-neutral-500 font-medium mt-2">How would you like to use FarminGo?</Text>
                         </View>

                         <View className="space-y-6">
                              <RoleCard
                                   title="Customer"
                                   desc="I want to buy fresh seeds & tools"
                                   icon={<ShoppingBag size={28} color="#006B44" />}
                                   selected={selectedRole === 'CUSTOMER'}
                                   onPress={() => handleRoleSelect('CUSTOMER')}
                                   color="bg-white"
                              />

                              <RoleCard
                                   title="Farmer"
                                   desc="I want to sell my produce"
                                   icon={<Tractor size={28} color="#006B44" />}
                                   selected={selectedRole === 'FARMER'}
                                   onPress={() => handleRoleSelect('FARMER')}
                                   color="bg-white"
                              />

                              <RoleCard
                                   title="Delivery Partner"
                                   desc="I want to deliver and earn"
                                   icon={<Truck size={28} color="#006B44" />}
                                   selected={selectedRole === 'DELIVERY'}
                                   onPress={() => handleRoleSelect('DELIVERY')}
                                   color="bg-white"
                              />
                         </View>
                    </View>
               </SafeAreaView>
          </View>
     );
};

const RoleCard = ({ title, desc, icon, selected, onPress, color }: any) => (
     <TouchableOpacity
          className={`${color} p-6 rounded-3xl flex-row items-center border ${selected ? 'border-primary-branding border-2 shadow-premium' : 'border-neutral-100 shadow-card'}`}
          onPress={onPress}
          activeOpacity={0.9}
     >
          <View className={`p-4 rounded-2xl ${selected ? 'bg-primary-light' : 'bg-neutral-50'}`}>
               {icon}
          </View>
          <View className="flex-1 ml-5">
               <Text className={`text-xl font-black italic ${selected ? 'text-primary-branding' : 'text-neutral-900'}`}>{title}</Text>
               <Text className="text-neutral-500 text-xs font-medium mt-1">{desc}</Text>
          </View>
          <ChevronRight size={20} color={selected ? "#006B44" : "#94A3B8"} />
     </TouchableOpacity>
);
