import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomerHomeScreen } from '../screens/customer/CustomerHomeScreen';
import { CustomerOrdersScreen } from '../screens/customer/CustomerOrdersScreen';
import { CartScreen } from '../screens/farmer/CartScreen';
import { View, Text } from 'react-native';
import { Home, ShoppingCart, LayoutGrid, ClipboardList, Zap } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ name }: { name: string }) => (
     <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-xl font-bold text-neutral-900">{name} Screen</Text>
          <Text className="text-neutral-500 mt-2">Coming Soon!</Text>
     </View>
);

export const CustomerStack = () => {
     return (
          <Tab.Navigator
               screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                         height: 85,
                         paddingTop: 12,
                         paddingBottom: 25,
                         borderTopLeftRadius: 30,
                         borderTopRightRadius: 30,
                         backgroundColor: '#E2F2E9', // Match light green from image
                         position: 'absolute',
                         borderTopWidth: 0,
                         elevation: 10,
                         shadowColor: '#000',
                         shadowOffset: { width: 0, height: -4 },
                         shadowOpacity: 0.1,
                         shadowRadius: 10,
                    },
                    tabBarActiveTintColor: '#006B44',
                    tabBarInactiveTintColor: '#94A3B8',
                    tabBarLabelStyle: {
                         fontWeight: 'bold',
                         fontSize: 10,
                         marginTop: 4,
                    },
                    tabBarIcon: ({ color, size, focused }) => {
                         let icon;
                         if (route.name === 'Home') icon = <Home size={size} color={color} />;
                         else if (route.name === 'Cart') icon = <ShoppingCart size={size} color={color} />;
                         else if (route.name === 'Categories') icon = <LayoutGrid size={size} color={color} />;
                         else if (route.name === 'Orders') icon = <ClipboardList size={size} color={color} />;
                         else if (route.name === 'Quiz') icon = <Zap size={size} color={color} />;
                         return icon;
                    },
               })}
          >
               <Tab.Screen name="Home" component={CustomerHomeScreen} />
               <Tab.Screen name="Cart" component={CartScreen} />
               <Tab.Screen name="Categories" component={() => <PlaceholderScreen name="Categories" />} />
               <Tab.Screen name="Orders" component={CustomerOrdersScreen} />
               <Tab.Screen name="Quiz" component={() => <PlaceholderScreen name="Quiz" />} />
          </Tab.Navigator>
     );
};
