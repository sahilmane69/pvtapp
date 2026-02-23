import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FarmerHomeScreen } from '../screens/farmer/FarmerHomeScreen';
import { FarmerDashboardScreen } from '../screens/farmer/FarmerDashboardScreen';
import { ProductListScreen } from '../screens/farmer/ProductListScreen';
import { ProductDetailScreen } from '../screens/farmer/ProductDetailScreen';
import { CartScreen } from '../screens/farmer/CartScreen';
import { OrderConfirmationScreen } from '../screens/farmer/OrderConfirmationScreen';
import { AddProductScreen } from '../features/farmer/AddProduct';
import { FarmerOrdersScreen } from '../screens/farmer/FarmerOrdersScreen';
import { PaymentScreen } from '../screens/farmer/PaymentScreen';

const Stack = createNativeStackNavigator();

export const FarmerStack = () => {
     return (
          <Stack.Navigator>
               <Stack.Screen
                    name="FarmerHome"
                    component={FarmerDashboardScreen}
                    options={{ headerShown: false }}
               />
               <Stack.Screen
                    name="FarmerShop"
                    component={FarmerHomeScreen}
                    options={{ title: 'Shop Inputs' }}
               />
               <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Available Products' }} />
               <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
               <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'My Cart' }} />
               <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ headerShown: false }} />
               <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Manage My Products' }} />
               <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
               <Stack.Screen name="FarmerOrders" component={FarmerOrdersScreen} options={{ title: 'My Sales' }} />
          </Stack.Navigator>
     );
};
