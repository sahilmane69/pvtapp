import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { FarmerStack } from './FarmerStack';
import { DeliveryStack } from './DeliveryStack';
import { AdminStack } from './AdminStack';
import { CustomerStack } from './CustomerStack';
import { TrackingScreen } from '../screens/farmer/TrackingScreen';
import { PaymentScreen } from '../screens/farmer/PaymentScreen';
import { MockPaymentAppScreen } from '../screens/farmer/MockPaymentAppScreen';
import { OrderReceiptScreen } from '../screens/farmer/OrderReceiptScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { View, ActivityIndicator } from 'react-native';
const RootStack = createNativeStackNavigator();

// Inline loading component — kept simple, no extra deps
const LoadingScreen = () => (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E2F2E9' }}>
          <ActivityIndicator size="large" color="#006B44" />
     </View>
);

export const RootNavigator = () => {
     const { userRole, isLoading } = useAuth();

     // Show minimal loading while AsyncStorage resolves — usually < 100ms
     if (isLoading) return <LoadingScreen />;

     return (
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
               {userRole === 'CUSTOMER' ? (
                    <RootStack.Screen name="CustomerRoot" component={CustomerStack} />
               ) : userRole === 'FARMER' ? (
                    <RootStack.Screen name="FarmerRoot" component={FarmerStack} />
               ) : userRole === 'DELIVERY' ? (
                    <RootStack.Screen name="DeliveryRoot" component={DeliveryStack} />
               ) : userRole === 'ADMIN' ? (
                    <RootStack.Screen name="AdminRoot" component={AdminStack} />
               ) : (
                    <RootStack.Screen name="AuthRoot" component={AuthStack} />
               )}
               {/* Global screen accessible from any nested stack via navigation.navigate('ScreenName') */}
               <RootStack.Screen name="Tracking" component={TrackingScreen} />
               <RootStack.Screen name="Payment" component={PaymentScreen} />
               <RootStack.Screen name="MockPaymentApp" component={MockPaymentAppScreen} />
               <RootStack.Screen name="OrderReceipt" component={OrderReceiptScreen} />
          </RootStack.Navigator>
     );
};
