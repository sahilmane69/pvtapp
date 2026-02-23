import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, RegisterScreen, RoleSelectionScreen, SplashScreen } from '../screens/auth';

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
     return (
          <Stack.Navigator initialRouteName="Splash">
               <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
               <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
               <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
               <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
     );
};
