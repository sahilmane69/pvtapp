import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomerHomeScreen } from '../screens/customer/CustomerHomeScreen';
import { CustomerOrdersScreen } from '../screens/customer/CustomerOrdersScreen';
import { CustomerDashboardScreen } from '../screens/customer/CustomerDashboardScreen';
import { CartScreen } from '../screens/farmer/CartScreen';
import { CustomerDrawer } from '../components/CustomerDrawer';
import { DrawerProvider } from '../context/DrawerContext';
import { Home, ShoppingCart, LayoutDashboard, ClipboardList, Zap } from 'lucide-react-native';


const Tab = createBottomTabNavigator();

// Stable component reference — never use inline arrow functions as tab components
const QuizPlaceholder = () => (
     <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-xl font-bold text-neutral-900">Quiz Screen</Text>
          <Text className="text-neutral-500 mt-2">Coming Soon!</Text>
     </View>
);


/** Inner tabs — must be inside DrawerProvider so CustomerDrawer can read context */
const CustomerTabs = () => (
     <Tab.Navigator
          screenOptions={({ route }) => ({
               headerShown: false,
               tabBarStyle: {
                    height: 85,
                    paddingTop: 12,
                    paddingBottom: 25,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    backgroundColor: '#E2F2E9',
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
               tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Home') return <Home size={size} color={color} />;
                    if (route.name === 'Cart') return <ShoppingCart size={size} color={color} />;
                    if (route.name === 'Dashboard') return <LayoutDashboard size={size} color={color} />;
                    if (route.name === 'Orders') return <ClipboardList size={size} color={color} />;
                    if (route.name === 'Quiz') return <Zap size={size} color={color} />;
                    return null;
               },
          })}
     >
          <Tab.Screen name="Home" component={CustomerHomeScreen} />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Dashboard" component={CustomerDashboardScreen} options={{ tabBarLabel: 'Dashboard' }} />
          <Tab.Screen name="Orders" component={CustomerOrdersScreen} />
          <Tab.Screen name="Quiz" component={QuizPlaceholder} />
     </Tab.Navigator>
);

/** Root customer stack: DrawerProvider wraps everything so any screen can open the drawer */
export const CustomerStack = ({ navigation, route }: any) => {
     // Get active route name from the nested navigator state if it exists
     const state = navigation.getState();
     const customerRootRoute = state?.routes.find((r: any) => r.name === 'CustomerRoot');
     const nestedState = customerRootRoute?.state;
     const activeRouteName = nestedState?.routes[nestedState.index]?.name ?? 'Home';

     return (
          <DrawerProvider>
               <View style={{ flex: 1 }}>
                    <CustomerTabs />
                    {/* Pass navigation down to avoid hook issues in sibling components */}
                    <CustomerDrawer navigation={navigation} activeRouteName={activeRouteName} />
               </View>
          </DrawerProvider>
     );
};

