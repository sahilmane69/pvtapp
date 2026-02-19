import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoleSelectionScreen } from '../screens/auth/RoleSelectionScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
     return (
          <Stack.Navigator>
               <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ headerShown: false }} />
               <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
     );
};
