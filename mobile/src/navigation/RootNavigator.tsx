import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { FarmerStack } from './FarmerStack';
import { DeliveryStack } from './DeliveryStack';
import { AdminStack } from './AdminStack';
import { ActivityIndicator, View } from 'react-native';

export const RootNavigator = () => {
     const { userRole, isLoading } = useAuth();

     if (isLoading) {
          return (
               <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
               </View>
          );
     }

     return (
          <NavigationContainer>
               {userRole === 'FARMER' ? (
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
