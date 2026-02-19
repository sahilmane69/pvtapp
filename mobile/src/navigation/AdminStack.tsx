import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { AddProductScreen } from '../features/farmer/AddProduct';

const Stack = createNativeStackNavigator();

export const AdminStack = () => {
     return (
          <Stack.Navigator>
               <Stack.Screen
                    name="AdminHome"
                    component={AdminHomeScreen}
                    options={{ title: 'Admin Dashboard' }}
               />
               <Stack.Screen
                    name="AdminProducts"
                    component={AddProductScreen}
                    options={{ title: 'Manage Products' }}
               />
          </Stack.Navigator>
     );
};

