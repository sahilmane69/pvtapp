/**
 * RouteMapScreen — standalone status view used in the Delivery tab.
 * Replaced MapView with a detailed status dashboard to avoid Google Maps API dependencies.
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { API_URL } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Truck, MapPin, Clock, Package, CheckCircle } from 'lucide-react-native';

export const RouteMapScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderId } = route.params || {};

  const [locationDenied, setLocationDenied] = useState(false);
  const [eta, setEta] = useState(12);
  const [status, setStatus] = useState('on_the_way');

  // Location permission (still useful for tracking distance/ETA logic)
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') setLocationDenied(true);
      } catch {
        setLocationDenied(true);
      }
    })();
  }, []);

  // Socket for live updates
  useEffect(() => {
    if (!orderId) return;
    const socket = io(API_URL, { transports: ['websocket'] });
    socket.on('connect', () => socket.emit('join_order', orderId));
    socket.on('driver_location', () => {
      setEta(e => Math.max(1, e - 1));
    });
    return () => { socket.disconnect(); };
  }, [orderId]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', marginLeft: 16, color: '#1E293B' }}>
            Delivery Status
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 24 }}>
          {/* Status Hero Card */}
          <View style={{ 
            backgroundColor: '#006B44', 
            borderRadius: 32, 
            padding: 32, 
            alignItems: 'center',
            marginBottom: 24,
            shadowColor: '#006B44', shadowOpacity: 0.3, shadowRadius: 15, elevation: 8
          }}>
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 30, marginBottom: 16 }}>
                 <Truck size={40} color="#006B44" />
            </View>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', fontStyle: 'italic' }}>
              {eta} MINS AWAY
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 4 }}>
              Order #{(orderId??"DEMO").slice(-6).toUpperCase()}
            </Text>
          </View>

          {/* Timeline */}
          <View style={{ backgroundColor: '#F8FAFC', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#E2E8F0' }}>
            <TimelineItem icon={<Package size={18} color="#006B44" />} title="Picked up from Farmer" status="Done" active />
            <TimelineItem icon={<Truck size={18} color="#006B44" />} title="On the way to customer" status="Heading your way" active current />
            <TimelineItem icon={<MapPin size={18} color="#94A3B8" />} title="Delivery to Drop-off" status="Pending" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const TimelineItem = ({ icon, title, status, active, current }: any) => (
    <View style={{ flexDirection: 'row', marginBottom: 24 }}>
        <View style={{ alignItems: 'center', marginRight: 16 }}>
            <View style={{ 
                width: 40, height: 40, borderRadius: 20, 
                backgroundColor: active ? '#E2F2E9' : '#F1F5F9',
                alignItems: 'center', justifyContent: 'center',
                borderWidth: current ? 2 : 0, borderColor: '#006B44'
            }}>
                {icon}
            </View>
            <View style={{ width: 2, flex: 1, backgroundColor: '#E2E8F0', marginTop: 4 }} />
        </View>
        <View style={{ flex: 1, paddingTop: 4 }}>
            <Text style={{ fontWeight: '800', fontSize: 16, color: active ? '#1E293B' : '#94A3B8' }}>{title}</Text>
            <Text style={{ color: active ? '#006B44' : '#94A3B8', fontWeight: '600', fontSize: 12 }}>{status}</Text>
        </View>
    </View>
);
