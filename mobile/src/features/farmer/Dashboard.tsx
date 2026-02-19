import React from 'react';
import { View, Text } from 'react-native';

export const FarmerDashboard = () => {
  return (
    <View className="flex-1 justify-center items-center bg-green-50">
      <Text className="text-2xl font-bold text-green-800">Farmer Dashboard</Text>
      <Text>Manage your crops and orders here.</Text>
    </View>
  );
};
