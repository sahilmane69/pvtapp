import React from 'react';
import { View, Text } from 'react-native';

export const TaskListScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-blue-50">
      <Text className="text-2xl font-bold text-blue-800">Delivery Tasks</Text>
      <Text>View your assigned deliveries here.</Text>
    </View>
  );
};
