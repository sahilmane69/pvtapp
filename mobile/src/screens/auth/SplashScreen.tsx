import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const SplashScreen = () => {
     const navigation = useNavigation<any>();

     const fadeAnim = useRef(new Animated.Value(0)).current;
     const slideAnim = useRef(new Animated.Value(30)).current;
     const scaleAnim = useRef(new Animated.Value(0.85)).current;

     useEffect(() => {
          Animated.parallel([
               Animated.timing(fadeAnim, {
                    toValue: 1, duration: 800, useNativeDriver: true,
               }),
               Animated.spring(slideAnim, {
                    toValue: 0, damping: 18, stiffness: 180, useNativeDriver: true,
               }),
               Animated.spring(scaleAnim, {
                    toValue: 1, damping: 18, stiffness: 180, useNativeDriver: true,
               }),
          ]).start();

          const timer = setTimeout(() => navigation.replace('Login'), 2800);
          return () => clearTimeout(timer);
     }, [navigation, fadeAnim, slideAnim, scaleAnim]);

     return (
          <View style={{ flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}>
               <Animated.View style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                    alignItems: 'center',
               }}>
                    {/* Logo mark */}
                    <View style={{
                         width: 140, height: 140, borderRadius: 40,
                         backgroundColor: '#ffffff',
                         alignItems: 'center', justifyContent: 'center',
                         marginBottom: 10,
                         shadowColor: '#006B44', shadowOpacity: 0.1,
                         shadowRadius: 20, shadowOffset: { width: 0, height: 10 },
                         elevation: 10,
                    }}>
                         <Image 
                              source={require('../../../assets/icon.png')} 
                              style={{ width: '100%', height: '100%' }}
                              resizeMode="contain"
                         />
                    </View>

                    {/* App name */}
                    <Text style={{
                         fontSize: 42, fontWeight: '900', fontStyle: 'italic',
                         color: '#006B44', letterSpacing: -1.5,
                    }}>
                         FarminGo
                    </Text>

                    <Text style={{
                         fontSize: 12, fontWeight: '700', color: '#64748B',
                         letterSpacing: 3, textTransform: 'uppercase', marginTop: 0,
                    }}>
                         Farming Made Easy
                    </Text>
               </Animated.View>

               {/* Footer */}
               <View style={{ position: 'absolute', bottom: 40 }}>
                    <Text style={{
                         fontSize: 10, fontWeight: '700', color: '#94A3B8',
                         letterSpacing: 2, textTransform: 'uppercase',
                    }}>
                         © 2026 FarminGo App
                    </Text>
               </View>
          </View>
     );
};
