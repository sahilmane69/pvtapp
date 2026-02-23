import '../global.css';
import React from 'react';
import { RootNavigator } from './navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';

export default function AppIndex() {
     return (
          <NavigationContainer>
               <SafeAreaProvider>
                    <AuthProvider>
                         <CartProvider>
                              <StatusBar style="auto" />
                              <RootNavigator />
                         </CartProvider>
                    </AuthProvider>
               </SafeAreaProvider>
          </NavigationContainer>
     );
}
