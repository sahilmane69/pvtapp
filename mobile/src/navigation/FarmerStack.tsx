import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FarmerHomeScreen } from '../screens/farmer/FarmerHomeScreen';
import { ProductListScreen } from '../screens/farmer/ProductListScreen';
import { ProductDetailScreen } from '../screens/farmer/ProductDetailScreen';
import { CartScreen } from '../screens/farmer/CartScreen';
import { OrderConfirmationScreen } from '../screens/farmer/OrderConfirmationScreen';
import { AddProductScreen } from '../features/farmer/AddProduct';

const Stack = createNativeStackNavigator();

export const FarmerStack = () => {
     return (
          <Stack.Navigator>
               <Stack.Screen
                    name="FarmerHome"
                    component={FarmerHomeScreen}
                    options={{ title: 'Welcome Farmer' }}
               />
               <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Available Products' }} />
               <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
               <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'My Cart' }} />
               <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ headerShown: false }} />
               <Stack.Screen name="AddProduct" component={AddProductScreen} />
          </Stack.Navigator>
     );
};
