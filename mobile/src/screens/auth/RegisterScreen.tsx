import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.0.101:5000';

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
                    body: JSON.stringify({
                         username: username.trim(),
                         password,
                         phone: phone.trim(),
                    }),
               });

               const data = await response.json();

               if (response.ok) {
                    Alert.alert('Account created', 'You can now log in', [
                         {
                              text: 'OK',
                              onPress: () => navigation.navigate('Login'),
                         },
                    ]);
               } else {
                    Alert.alert('Register failed', data.message || 'Something went wrong');
               }
          } catch (error) {
               console.error(error);
               Alert.alert('Error', 'Could not connect to server');
          } finally {
               setIsLoading(false);
          }
     };

     return (
          <View className="flex-1 bg-stone-50 p-8 justify-center">
               <Text className="text-3xl font-bold text-stone-800 mb-6">Create account</Text>

               <View className="space-y-4 mb-6">
                    <View>
                         <Text className="text-stone-600 mb-1">Username</Text>
                         <TextInput
                              className="bg-white border border-stone-200 rounded-2xl px-4 py-3 text-stone-800"
                              placeholder="Choose a username"
                              placeholderTextColor="#a8a29e"
                              value={username}
                              onChangeText={setUsername}
                         />
                    </View>
                    <View>
                         <Text className="text-stone-600 mb-1">Phone (optional)</Text>
                         <TextInput
                              className="bg-white border border-stone-200 rounded-2xl px-4 py-3 text-stone-800"
                              placeholder="Phone number"
                              placeholderTextColor="#a8a29e"
                              keyboardType="phone-pad"
                              value={phone}
                              onChangeText={setPhone}
                         />
                    </View>
                    <View>
                         <Text className="text-stone-600 mb-1">Password</Text>
                         <TextInput
                              className="bg-white border border-stone-200 rounded-2xl px-4 py-3 text-stone-800"
                              placeholder="Password"
                              placeholderTextColor="#a8a29e"
                              secureTextEntry
                              value={password}
                              onChangeText={setPassword}
                         />
                    </View>
                    <View>
                         <Text className="text-stone-600 mb-1">Confirm password</Text>
                         <TextInput
                              className="bg-white border border-stone-200 rounded-2xl px-4 py-3 text-stone-800"
                              placeholder="Confirm password"
                              placeholderTextColor="#a8a29e"
                              secureTextEntry
                              value={confirmPassword}
                              onChangeText={setConfirmPassword}
                         />
                    </View>
               </View>

               <TouchableOpacity
                    className={`w-full py-4 rounded-2xl items-center ${isLoading ? 'bg-stone-300' : 'bg-emerald-600'}`}
                    onPress={handleRegister}
                    disabled={isLoading}
               >
                    {isLoading ? (
                         <ActivityIndicator color="white" />
                    ) : (
                         <Text className="text-white font-bold text-lg">Sign up</Text>
                    )}
               </TouchableOpacity>

               <TouchableOpacity
                    className="mt-4 items-center"
                    onPress={() => navigation.navigate('Login')}
               >
                    <Text className="text-stone-500">
                         Already have an account? <Text className="font-semibold">Log in</Text>
                    </Text>
               </TouchableOpacity>
          </View>
     );
};

