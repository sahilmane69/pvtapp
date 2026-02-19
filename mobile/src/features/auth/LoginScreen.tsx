import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';

export const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const login = useAuthStore((state) => state.login);

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-xl font-bold mb-8">Role Separation Demo</Text>

      <View className="w-full space-y-4">
        <Button
          title="Login as Farmer"
          onPress={() => login('FARMER')}
          color="#16a34a" // green-600
        />
        <View style={{ height: 16 }} />
        <Button
          title="Login as Delivery"
          onPress={() => login('DELIVERY')}
          color="#2563eb" // blue-600
        />
        <View style={{ height: 16 }} />
        <Button
          title="Register New Account"
          onPress={() => navigation.navigate('Register', { role: 'FARMER' })}
          color="#4b5563"
        />
      </View>
    </View>
  );
};
