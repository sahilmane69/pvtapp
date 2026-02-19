import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Tractor, Truck } from 'lucide-react-native';

export const RoleSelectionScreen = () => {
     const [selectedRole, setSelectedRole] = useState<string | null>(null);
     const { setUserRole } = useAuth();

     const handleRoleSelect = (role: any) => {
          setSelectedRole(role);
          setUserRole(role);
          console.log(`Role selected: ${role}`);
     };

     return (
          <View className="flex-1 justify-center items-center bg-stone-50 p-6">
               <View className="mb-12 items-center">
                    <Text className="text-3xl font-bold text-stone-800 mb-2">Welcome to Farmingo</Text>
                    <Text className="text-stone-500 text-lg">Choose your role to continue</Text>
               </View>

               <View className="w-full space-y-6">
                    <TouchableOpacity
                         className={`p-6 rounded-2xl border-2 flex-row items-center space-x-4 ${selectedRole === 'FARMER'
                                   ? 'bg-emerald-50 border-emerald-500 shadow-md'
                                   : 'bg-white border-stone-100 shadow-sm'
                              }`}
                         onPress={() => handleRoleSelect('FARMER')}
                         activeOpacity={0.7}
                    >
                         <View className={`p-3 rounded-full ${selectedRole === 'FARMER' ? 'bg-emerald-100' : 'bg-stone-100'}`}>
                              <Tractor size={32} color={selectedRole === 'FARMER' ? '#059669' : '#78716c'} />
                         </View>
                         <View className="flex-1">
                              <Text className={`text-xl font-bold ${selectedRole === 'FARMER' ? 'text-emerald-800' : 'text-stone-800'}`}>
                                   Farmer
                              </Text>
                              <Text className="text-stone-500 mt-1">
                                   I grow and sell produce
                              </Text>
                         </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                         className={`p-6 rounded-2xl border-2 flex-row items-center space-x-4 ${selectedRole === 'DELIVERY'
                                   ? 'bg-orange-50 border-orange-500 shadow-md'
                                   : 'bg-white border-stone-100 shadow-sm'
                              }`}
                         onPress={() => handleRoleSelect('DELIVERY')}
                         activeOpacity={0.7}
                    >
                         <View className={`p-3 rounded-full ${selectedRole === 'DELIVERY' ? 'bg-orange-100' : 'bg-stone-100'}`}>
                              <Truck size={32} color={selectedRole === 'DELIVERY' ? '#ea580c' : '#78716c'} />
                         </View>
                         <View className="flex-1">
                              <Text className={`text-xl font-bold ${selectedRole === 'DELIVERY' ? 'text-orange-800' : 'text-stone-800'}`}>
                                   Delivery Partner
                              </Text>
                              <Text className="text-stone-500 mt-1">
                                   I deliver orders to customers
                              </Text>
                         </View>
                    </TouchableOpacity>
               </View>
          </View>
     );
};
