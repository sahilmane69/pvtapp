import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Sprout } from 'lucide-react-native';

export const SplashScreen = () => {
     const navigation = useNavigation<any>();

     // useRef so Animated.Value is created once and never recreated on re-render
     const fadeAnim = useRef(new Animated.Value(0)).current;
     const slideAnim = useRef(new Animated.Value(30)).current;
     const scaleAnim = useRef(new Animated.Value(0.85)).current;

     useEffect(() => {
          // Entrance animation
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

          const timer = setTimeout(() => navigation.replace('Login'), 2200);
          return () => clearTimeout(timer);
     }, []); // empty deps — intentional, runs once on mount

     return (
          <View style={{ flex: 1, backgroundColor: '#E2F2E9', alignItems: 'center', justifyContent: 'center' }}>
               <Animated.View style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                    alignItems: 'center',
               }}>
                    {/* Logo mark */}
                    <View style={{
                         width: 100, height: 100, borderRadius: 36,
                         backgroundColor: '#006B44',
                         alignItems: 'center', justifyContent: 'center',
                         marginBottom: 24,
                         shadowColor: '#006B44', shadowOpacity: 0.4,
                         shadowRadius: 24, shadowOffset: { width: 0, height: 12 },
                         elevation: 16,
                    }}>
                         <Sprout size={52} color="#fff" />
                    </View>

                    {/* App name */}
                    <Text style={{
                         fontSize: 40, fontWeight: '900', fontStyle: 'italic',
                         color: '#006B44', letterSpacing: -1.5,
                    }}>
                         FarminGo
                    </Text>

                    <Text style={{
                         fontSize: 12, fontWeight: '700', color: '#64748B',
                         letterSpacing: 3, textTransform: 'uppercase', marginTop: 8,
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
                         Powered by PVT App
                    </Text>
               </View>
          </View>
     );
};
