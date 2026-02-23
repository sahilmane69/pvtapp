import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../../utils/constants';

const { height } = Dimensions.get('window');

export const RegisterScreen = () => {
     const navigation = useNavigation<any>();
     const [username, setUsername] = useState('');
     const [phone, setPhone] = useState('');
     const [password, setPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [isLoading, setIsLoading] = useState(false);

     const handleRegister = async () => {
          if (!username.trim() || !password.trim()) {
               Alert.alert('Error', 'Username and password are required');
               return;
          }
          if (password !== confirmPassword) {
               Alert.alert('Error', 'Passwords do not match');
               return;
          }

          setIsLoading(true);
          try {
               const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username.trim(), password, phone: phone.trim() }),
               });

               let data;
               try {
                    data = await response.json();
               } catch (e) {
                    Alert.alert('Server Error', 'Invalid response from server');
                    return;
               }

               if (response.ok) {
                    Alert.alert('Account created', 'You can now log in', [
                         { text: 'OK', onPress: () => navigation.navigate('Login') },
                    ]);
               } else {
                    Alert.alert('Register failed', data?.message || 'Something went wrong');
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
                         {/* Header */}
                         <View className="items-center pt-8 pb-4" style={{ height: height * 0.25 }}>
                              <Image
                                   source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3588/3588628.png' }}
                                   className="w-40 h-40"
                                   resizeMode="contain"
                              />
                         </View>

                         <View className="items-center pb-6">
                              <Text className="text-primary-branding text-3xl font-black italic tracking-widest">JOIN US</Text>
                         </View>

                         {/* Form */}
                         <View className="flex-1 bg-white rounded-t-5xl px-8 pt-10 shadow-premium">
                              <View className="items-center mb-8">
                                   <Text className="text-neutral-900 text-lg font-bold">Create Your FarminGo Account</Text>
                              </View>

                              <View className="space-y-5">
                                   <View className="bg-neutral-100 rounded-2xl px-4 py-1 border border-neutral-100">
                                        <Text className="text-neutral-500 text-[10px] uppercase font-bold mt-2 ml-1">Username</Text>
                                        <TextInput
                                             className="w-full p-2 text-neutral-900 text-base font-medium"
                                             placeholder="Choose username"
                                             placeholderTextColor="#94A3B8"
                                             value={username}
                                             onChangeText={setUsername}
                                        />
                                   </View>

                                   <View className="bg-neutral-100 rounded-2xl px-4 py-1 border border-neutral-100">
                                        <Text className="text-neutral-500 text-[10px] uppercase font-bold mt-2 ml-1">Phone</Text>
                                        <TextInput
                                             className="w-full p-2 text-neutral-900 text-base font-medium"
                                             placeholder="Your phone number"
                                             placeholderTextColor="#94A3B8"
                                             keyboardType="phone-pad"
                                             value={phone}
                                             onChangeText={setPhone}
                                        />
                                   </View>

                                   <View className="bg-neutral-100 rounded-2xl px-4 py-1 border border-neutral-100">
                                        <Text className="text-neutral-500 text-[10px] uppercase font-bold mt-2 ml-1">Password</Text>
                                        <TextInput
                                             className="w-full p-2 text-neutral-900 text-base font-medium"
                                             placeholder="Create password"
                                             placeholderTextColor="#94A3B8"
                                             secureTextEntry
                                             value={password}
                                             onChangeText={setPassword}
                                        />
                                   </View>

                                   <View className="bg-neutral-100 rounded-2xl px-4 py-1 border border-neutral-100">
                                        <Text className="text-neutral-500 text-[10px] uppercase font-bold mt-2 ml-1">Confirm Password</Text>
                                        <TextInput
                                             className="w-full p-2 text-neutral-900 text-base font-medium"
                                             placeholder="Repeat password"
                                             placeholderTextColor="#94A3B8"
                                             secureTextEntry
                                             value={confirmPassword}
                                             onChangeText={setConfirmPassword}
                                        />
                                   </View>
                              </View>

                              <TouchableOpacity
                                   className={`w-full mt-10 py-5 rounded-full items-center shadow-lg ${isLoading ? 'bg-neutral-400' : 'bg-primary-branding'}`}
                                   onPress={handleRegister}
                                   disabled={isLoading}
                                   activeOpacity={0.9}
                              >
                                   {isLoading ? (
                                        <ActivityIndicator color="white" />
                                   ) : (
                                        <Text className="text-white font-black text-xl tracking-widest uppercase">SIGN UP</Text>
                                   )}
                              </TouchableOpacity>

                              <View className="flex-row justify-center mt-8 pb-10">
                                   <Text className="text-neutral-500 font-medium">Already Have Account? </Text>
                                   <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text className="text-primary-branding font-black">Login</Text>
                                   </TouchableOpacity>
                              </View>
                         </View>
                    </ScrollView>
               </SafeAreaView>
          </View>
     );
};
