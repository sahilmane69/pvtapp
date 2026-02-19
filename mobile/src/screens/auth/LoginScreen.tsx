import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import clsx from 'clsx';
// Replace with your local IP if testing on physical device, e.g., 'http://192.168.1.5:5000'
const API_URL = 'http://192.168.0.104:5000';

export const LoginScreen = () => {
     const { userRole, setUserRole } = useAuth();
     const navigation = useNavigation<any>();
     const [phone, setPhone] = useState('');
     const [isLoading, setIsLoading] = useState(false);

     const handleLogin = async () => {
          if (!phone.trim()) {
               Alert.alert('Error', 'Please enter a phone number');
               return;
          }

          if (!userRole) {
               Alert.alert('Error', 'No role selected. Please go back and select a role.');
               return;
          }

          setIsLoading(true);
          try {
               const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         phone: phone,
                         role: userRole.toLowerCase(), // API expects lowercase 'farmer' or 'delivery'
                    }),
               });

               const data = await response.json();

               if (response.ok) {
                    // setUserRole is already set from RoleSelection, but we reaffirm it here 
                    // and potentially save other user data if we had a user object in context
                    Alert.alert('Success', `Welcome back, ${data.user.role}!`);

                    // Navigation is handled automatically by RootNavigator listening to userRole
                    // But just in case we need to trigger something else:
                    // navigation.navigate(userRole === 'FARMER' ? 'FarmerStack' : 'DeliveryStack');
               } else {
                    Alert.alert('Login Failed', data.message || 'Something went wrong');
               }
          } catch (error) {
               console.error(error);
               Alert.alert('Error', 'Could not connect to server');
          } finally {
               setIsLoading(false);
          }
     };

     const isFarmer = userRole === 'FARMER';
     const primaryColor = isFarmer ? 'bg-emerald-600' : 'bg-orange-600';
     const primaryColorActive = isFarmer ? 'active:bg-emerald-700' : 'active:bg-orange-700';
     const textColor = isFarmer ? 'text-emerald-700' : 'text-orange-700';
     const borderColor = isFarmer ? 'focus:border-emerald-500' : 'focus:border-orange-500';

     return (
          <View className="flex-1 justify-center p-8 bg-stone-50">
               <View className="mb-10">
                    <Text className="text-4xl font-bold text-stone-800 mb-2">Login</Text>
                    <Text className="text-stone-500 text-lg">
                         Welcome back,
                         <Text className={`font-bold ${textColor}`}> {isFarmer ? 'Farmer' : 'Delivery Partner'}</Text>
                    </Text>
               </View>

               <View className="space-y-6">
                    <View>
                         <Text className="text-stone-600 mb-2 font-medium ml-1">Phone Number</Text>
                         <TextInput
                              className={`w-full bg-white border border-stone-200 rounded-2xl p-5 text-lg text-stone-800 ${borderColor}`}
                              placeholder="Enter 10-digit number"
                              placeholderTextColor="#a8a29e"
                              keyboardType="phone-pad"
                              value={phone}
                              onChangeText={setPhone}
                              maxLength={10}
                         />
                    </View>

                    <TouchableOpacity
                         className={clsx(
                              "w-full py-5 rounded-2xl items-center shadow-sm",
                              isLoading ? "bg-stone-300" : `${primaryColor} ${primaryColorActive}`
                         )}
                         onPress={handleLogin}
                         disabled={isLoading}
                         activeOpacity={0.8}
                    >
                         {isLoading ? (
                              <ActivityIndicator color="white" />
                         ) : (
                              <Text className="text-white font-bold text-xl">Continue</Text>
                         )}
                    </TouchableOpacity>

                    <TouchableOpacity
                         className="mt-4 items-center py-2"
                         onPress={() => setUserRole(null)}
                         activeOpacity={0.6}
                    >
                         <Text className="text-stone-400 font-medium">Change Role</Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
};
