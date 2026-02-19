import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { RoleSelectionScreen } from '../screens/auth/RoleSelectionScreen';

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
     return (
          <Stack.Navigator>
               <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
               <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create account' }} />
               <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
     );
};
