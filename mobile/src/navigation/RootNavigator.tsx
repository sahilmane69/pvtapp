import React, { useEffect, useState } from 'react';
console.log('--- RootNavigator Module Loaded ---');
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { FarmerStack } from './FarmerStack';
import { DeliveryStack } from './DeliveryStack';
import { AdminStack } from './AdminStack';
import { CustomerStack } from './CustomerStack';
import { ActivityIndicator, View } from 'react-native';

export const RootNavigator = () => {
     const { userRole, isLoading } = useAuth();

     if (isLoading) {
          return (
               <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#006B44" />
               </View>
          );
     }

     return (
          <NavigationContainer>
               {userRole === 'CUSTOMER' ? (
                    <CustomerStack />
               ) : userRole === 'FARMER' ? (
                    <FarmerStack />
               ) : userRole === 'DELIVERY' ? (
                    <DeliveryStack />
               ) : userRole === 'ADMIN' ? (
                    <AdminStack />
               ) : (
                    <AuthStack />
               )}
          </NavigationContainer>
     );
};
