import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.0.101:5000';

export const LoginScreen = () => {
     const { setUser, setUserRole } = useAuth();
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
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         username: username.trim(),
                         password,
                    }),
               });

               const data = await response.json();

               if (response.ok) {
                    const backendRole = data.user.role as 'admin' | 'farmer' | 'delivery' | null;
                    const mappedRole =
                         backendRole === 'admin'
                              ? 'ADMIN'
                              : backendRole === 'farmer'
                              ? 'FARMER'
                              : backendRole === 'delivery'
                              ? 'DELIVERY'
                              : null;

                    await setUser({
                         id: data.user.id,
                         username: data.user.username,
                         role: mappedRole,
                    });

                    if (mappedRole) {
                         await setUserRole(mappedRole);
                    }

                    if (!mappedRole || mappedRole === null) {
                         navigation.navigate('RoleSelection');
                    } else {
                         Alert.alert('Success', `Welcome back, ${data.user.username}!`);
                    }
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

     return (
          <View className="flex-1 justify-center p-8 bg-stone-50">
               <View className="mb-10">
                    <Text className="text-4xl font-bold text-stone-800 mb-2">Welcome to Farmingo</Text>
                    <Text className="text-stone-500 text-lg">Sign in to continue</Text>
               </View>

               <View className="space-y-5 mb-6">
                    <View>
                         <Text className="text-stone-600 mb-1 font-medium ml-1">Username</Text>
                         <TextInput
                              className="w-full bg-white border border-stone-200 rounded-2xl p-4 text-lg text-stone-800"
                              placeholder="Enter username"
                              placeholderTextColor="#a8a29e"
                              autoCapitalize="none"
                              value={username}
                              onChangeText={setUsername}
                         />
                    </View>
                    <View>
                         <Text className="text-stone-600 mb-1 font-medium ml-1">Password</Text>
                         <TextInput
                              className="w-full bg-white border border-stone-200 rounded-2xl p-4 text-lg text-stone-800"
                              placeholder="Enter password"
                              placeholderTextColor="#a8a29e"
                              secureTextEntry
                              value={password}
                              onChangeText={setPassword}
                         />
                    </View>
               </View>

               <TouchableOpacity
                    className={`w-full py-5 rounded-2xl items-center ${isLoading ? 'bg-stone-300' : 'bg-emerald-600'}`}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.8}
               >
                    {isLoading ? (
                         <ActivityIndicator color="white" />
                    ) : (
                         <Text className="text-white font-bold text-xl">Login</Text>
                    )}
               </TouchableOpacity>

               <TouchableOpacity
                    className="mt-4 items-center py-2"
                    onPress={() => navigation.navigate('Register')}
               >
                    <Text className="text-stone-500">
                         New to Farmingo? <Text className="font-semibold">Create account</Text>
                    </Text>
               </TouchableOpacity>
          </View>
     );
};
