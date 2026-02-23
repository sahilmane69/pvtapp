import * as Location from 'expo-location';
import { create } from 'zustand';

interface LocationState {
     coords: { latitude: number; longitude: number } | null;
     address: string | null;
     permissionStatus: string | null;
     isLoading: boolean;
     detectLocation: () => Promise<void>;
     initializeLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set, get) => ({
     coords: null,
     address: null,
     permissionStatus: null,
     isLoading: false,

     detectLocation: async () => {
          set({ isLoading: true });
          try {
               const { status } = await Location.requestForegroundPermissionsAsync();
               set({ permissionStatus: status });

               if (status !== 'granted') {
                    console.log('Location permission denied, using fallback');
                    set({
                         coords: { latitude: 18.5204, longitude: 73.8567 }, // Pune fallback
                         address: 'Pune, Maharashtra (Default)',
                         isLoading: false
                    });
                    return;
               }

               const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
               });

               const coords = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
               };

               set({ coords });

               // Reverse geocode
               const [addressResult] = await Location.reverseGeocodeAsync(coords);
               if (addressResult) {
                    const addr = `${addressResult.name || ''} ${addressResult.street || ''}, ${addressResult.city || ''}`.trim();
                    set({ address: addr || 'Current Location' });
               }
          } catch (error) {
               console.error('Error detecting location:', error);
               set({
                    coords: { latitude: 18.5204, longitude: 73.8567 },
                    address: 'Pune (Fallback)'
               });
          } finally {
               set({ isLoading: false });
          }
     },

     initializeLocation: async () => {
          const { coords } = get();
          if (!coords) {
               await get().detectLocation();
          }
     },
}));
