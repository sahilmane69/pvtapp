import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DeliveryHomeScreen } from '../screens/delivery/DeliveryHomeScreen';
import { DeliveryOrdersScreen } from '../screens/delivery/DeliveryOrdersScreen';

const Stack = createNativeStackNavigator();

export const DeliveryStack = () => {
     return (
          <Stack.Navigator>
               <Stack.Screen
                    name="DeliveryHome"
                    component={DeliveryHomeScreen}
                    options={{ title: 'Welcome Delivery Partner' }}
               />
               <Stack.Screen
                    name="DeliveryOrders"
                    component={DeliveryOrdersScreen}
                    options={{ title: 'Available Orders' }}
               />
          </Stack.Navigator>
     );
};
