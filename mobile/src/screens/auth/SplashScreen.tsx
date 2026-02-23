import React, { useEffect } from 'react';
import { View, Text, Image, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export const SplashScreen = () => {
     const navigation = useNavigation<any>();
     const fadeAnim = new Animated.Value(0);
     const slideAnim = new Animated.Value(20);

     useEffect(() => {
          Animated.parallel([
               Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
               }),
               Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
               }),
          ]).start();

          const timer = setTimeout(() => {
               navigation.replace('Login');
          }, 2500);

          return () => clearTimeout(timer);
     }, []);

     return (
          <View className="flex-1 bg-primary-light items-center justify-center">
               <Animated.View
                    style={{
                         opacity: fadeAnim,
                         transform: [{ translateY: slideAnim }]
                    }}
                    className="items-center"
               >
                    <View className="mb-6">
                         {/* Logo Placeholder - Using a farming themed image from Unsplash */}
                         <View className="w-64 h-64 items-center justify-center">
                              <Image
                                   source={{ uri: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80' }}
                                   className="w-48 h-48 rounded-full"
                                   resizeMode="contain"
                              />
                              <View className="absolute inset-0 items-center justify-center">
                                   {/* Simulated FarminGo Logo text and icons layout */}
                                   <Text className="text-primary-branding text-4xl font-black mt-56">FarminGo</Text>
                              </View>
                         </View>
                    </View>

                    <Text className="text-neutral-500 text-lg font-medium tracking-widest mt-8">
                         Farming Made Easy
                    </Text>
               </Animated.View>

               <View className="absolute bottom-12">
                    <Text className="text-neutral-400 text-xs font-bold uppercase tracking-tighter">
                         Powered by PVT App
                    </Text>
               </View>
          </View>
     );
};
