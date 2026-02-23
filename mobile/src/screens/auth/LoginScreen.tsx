import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, Dimensions, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../../utils/constants';

import { useLocationStore } from '../../store/useLocationStore';

const { height, width } = Dimensions.get('window');

export const LoginScreen = () => {
     const { setUser, setUserRole } = useAuth();
     const detectLocation = useLocationStore(state => state.detectLocation);
     const navigation = useNavigation<any>();
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const [isLoading, setIsLoading] = useState(false);

     const handleLogin = async () => {
          if (!username.trim() || !password.trim()) {
               Alert.alert('Error', 'Please enter username and password');
               return;
          }

          setIsLoading(true);
          try {
               const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username.trim(), password }),
               });

               let data;
               try {
                    data = await response.json();
               } catch (e) {
                    Alert.alert('Server Error', 'Invalid response from server');
                    return;
               }

               if (response.ok) {
                    // Trigger location fetch instantly
                    detectLocation();

                    const backendRole = data.user.role as 'admin' | 'farmer' | 'delivery' | 'customer' | null;
                    const mappedRole = backendRole === 'admin' ? 'ADMIN' :
                         backendRole === 'farmer' ? 'FARMER' :
                              backendRole === 'delivery' ? 'DELIVERY' :
                                   backendRole === 'customer' ? 'CUSTOMER' : null;

                    await setUser({ id: data.user.id, username: data.user.username, role: mappedRole });
                    if (mappedRole) await setUserRole(mappedRole);

                    if (!mappedRole) {
                         navigation.navigate('RoleSelection');
                    } else {
                         Alert.alert('Success', `Welcome back!`);
                    }
               } else {
                    Alert.alert('Login Failed', data?.message || 'Something went wrong');
               }
          } catch (error) {
               console.error(error);
               Alert.alert('Error', 'Could not connect to server');
          } finally {
               setIsLoading(false);
          }
     };

     return (
          <View className="flex-1 bg-primary-light">
               <SafeAreaView className="flex-1">
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                         {/* Top Illustration Section */}
                         <View className="items-center justify-center pt-10 pb-6 px-10" style={{ height: height * 0.4 }}>
                              <Image
                                   source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3588/3588658.png' }} // Modern login illustration
                                   className="w-full h-full"
                                   resizeMode="contain"
                              />
                         </View>

                         {/* Login Hero Text */}
                         <View className="items-center pb-8">
                              <Text className="text-primary-branding text-3xl font-black italic tracking-widest">LOGIN HERE</Text>
                         </View>

                         {/* Form Container */}
                         <View className="flex-1 bg-white rounded-t-5xl px-8 pt-10 shadow-premium">
                              <View className="items-center mb-8">
                                   <Text className="text-neutral-900 text-lg font-bold">Welcome Please Login To Continue</Text>
                              </View>

                              <View className="space-y-6">
                                   <View className="bg-neutral-100 rounded-2xl px-4 py-1 border border-neutral-100">
                                        <Text className="text-neutral-500 text-[10px] uppercase font-bold mt-2 ml-1">Username / Email</Text>
                                        <TextInput
                                             className="w-full p-2 text-neutral-900 text-base font-medium"
                                             placeholder="Enter email or username"
                                             placeholderTextColor="#94A3B8"
                                             autoCapitalize="none"
                                             value={username}
                                             onChangeText={setUsername}
                                        />
                                   </View>

                                   <View className="bg-neutral-100 rounded-2xl px-4 py-1 border border-neutral-100">
                                        <Text className="text-neutral-500 text-[10px] uppercase font-bold mt-2 ml-1">Password</Text>
                                        <TextInput
                                             className="w-full p-2 text-neutral-900 text-base font-medium"
                                             placeholder="Enter password"
                                             placeholderTextColor="#94A3B8"
                                             secureTextEntry
                                             value={password}
                                             onChangeText={setPassword}
                                        />
                                   </View>
                              </View>

                              <TouchableOpacity
                                   className={`w-full mt-10 py-5 rounded-full items-center shadow-lg ${isLoading ? 'bg-neutral-400' : 'bg-primary-branding'}`}
                                   onPress={handleLogin}
                                   disabled={isLoading}
                                   activeOpacity={0.9}
                              >
                                   {isLoading ? (
                                        <ActivityIndicator color="white" />
                                   ) : (
                                        <Text className="text-white font-black text-xl tracking-widest uppercase">LOGIN</Text>
                                   )}
                              </TouchableOpacity>

                              <View className="flex-row justify-center mt-8 pb-10">
                                   <Text className="text-neutral-500 font-medium">Don&apos;t Have Account? </Text>
                                   <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                        <Text className="text-primary-branding font-black">Register</Text>
                                   </TouchableOpacity>
                              </View>
                         </View>
                    </ScrollView>
               </SafeAreaView>
          </View>
     );
};
