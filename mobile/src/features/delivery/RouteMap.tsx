/**
 * RouteMapScreen — standalone route-map used in the Delivery tab.
 * Shows driver's live position (from socket) + customer drop-off with polyline.
 * Uses expo-location for permission, falls back to Pune dummy coords.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Alert,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { API_URL } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Navigation, Truck, MapPin, AlertCircle } from 'lucide-react-native';

const FALLBACK_DRIVER = { latitude: 18.5204, longitude: 73.8567 };
const FALLBACK_CUSTOMER = { latitude: 18.5074, longitude: 73.8077 };

const DriverMarkerView = () => (
  <View style={{
    backgroundColor: '#006B44', padding: 8, borderRadius: 20,
    borderWidth: 3, borderColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 6,
  }}>
    <Truck size={18} color="#fff" />
  </View>
);

const CustomerMarkerView = () => (
  <View style={{
    backgroundColor: '#2563EB', padding: 8, borderRadius: 20,
    borderWidth: 3, borderColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 6,
  }}>
    <MapPin size={18} color="#fff" />
  </View>
);

export const RouteMapScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderId, deliveryLocation } = route.params || {};

  const [driverCoord, setDriverCoord] = useState(FALLBACK_DRIVER);
  const [customerCoord, setCustomerCoord] = useState(
    deliveryLocation?.lat && deliveryLocation?.lng
      ? { latitude: deliveryLocation.lat, longitude: deliveryLocation.lng }
      : FALLBACK_CUSTOMER
  );
  const [locationDenied, setLocationDenied] = useState(false);
  const [eta, setEta] = useState(12);

  const mapRef = useRef<MapView>(null);

  const fitMap = useCallback(() => {
    mapRef.current?.fitToCoordinates(
      [driverCoord, customerCoord],
      { edgePadding: { top: 80, right: 60, bottom: 80, left: 60 }, animated: true }
    );
  }, [driverCoord, customerCoord]);

  // Location permission
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setDriverCoord({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        } else {
          setLocationDenied(true);
        }
      } catch {
        setLocationDenied(true);
      }
    })();
  }, []);

  // Socket for live driver updates
  useEffect(() => {
    if (!orderId) {
      return; // explicit void return, no cleanup needed
    }
    const socket = io(API_URL, { transports: ['websocket'] });
    socket.on('connect', () => socket.emit('join_order', orderId));
    socket.on('driver_location', (d: { latitude: number; longitude: number }) => {
      setDriverCoord({ latitude: d.latitude, longitude: d.longitude });
      setEta(e => Math.max(1, e - 1));
      setTimeout(() => fitMap(), 100);
    });
    return () => { socket.disconnect(); };
  }, [orderId]);

  // Demo movement simulation
  useEffect(() => {
    const id = setInterval(() => {
      setDriverCoord(prev => ({
        latitude: prev.latitude + (customerCoord.latitude - prev.latitude) * 0.04,
        longitude: prev.longitude + (customerCoord.longitude - prev.longitude) * 0.04,
      }));
      setEta(e => Math.max(1, e - 1));
    }, 5000);
    return () => clearInterval(id);
  }, [customerCoord]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        showsUserLocation={!locationDenied}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        onMapReady={fitMap}
        initialRegion={{
          latitude: (driverCoord.latitude + customerCoord.latitude) / 2,
          longitude: (driverCoord.longitude + customerCoord.longitude) / 2,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
      >
        <Polyline
          coordinates={[driverCoord, customerCoord]}
          strokeColor="#006B44"
          strokeWidth={4}
          lineDashPattern={[8, 4]}
        />
        <Marker coordinate={driverCoord} tracksViewChanges={false} anchor={{ x: 0.5, y: 0.5 }}>
          <DriverMarkerView />
        </Marker>
        <Marker coordinate={customerCoord} tracksViewChanges={false} anchor={{ x: 0.5, y: 1 }}>
          <CustomerMarkerView />
        </Marker>
      </MapView>

      {/* Top bar */}
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between',
          paddingHorizontal: 16, paddingTop: 8,
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: '#fff', padding: 10, borderRadius: 16,
              shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
            }}
          >
            <ArrowLeft size={20} color="#1e293b" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={fitMap}
            style={{
              backgroundColor: '#fff', padding: 10, borderRadius: 16,
              shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
            }}
          >
            <Navigation size={20} color="#006B44" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ETA chip */}
      <View style={{
        position: 'absolute', bottom: 32, left: 24, right: 24,
        backgroundColor: '#fff', borderRadius: 24, padding: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, elevation: 8,
      }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#1E293B', fontStyle: 'italic' }}>
            {eta} min away
          </Text>
          {orderId && (
            <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
              Order #{(orderId as string).slice(-6).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={{
          backgroundColor: '#E2F2E9', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16,
        }}>
          <Text style={{ color: '#006B44', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' }}>
            On the way
          </Text>
        </View>
      </View>

      {/* Permission denied badge */}
      {locationDenied && (
        <View style={{
          position: 'absolute', top: 80, left: 16, right: 16,
          backgroundColor: '#FFF7ED', borderRadius: 16, padding: 12,
          flexDirection: 'row', alignItems: 'center',
          borderWidth: 1, borderColor: '#FED7AA',
        }}>
          <AlertCircle size={15} color="#EA580C" />
          <Text style={{ marginLeft: 8, color: '#9A3412', fontSize: 11, fontWeight: '700', flex: 1 }}>
            Location permission denied — using demo coordinates.
          </Text>
        </View>
      )}
    </View>
  );
};
