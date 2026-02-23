import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
     ShoppingCart,
     Search,
     MapPin,
     ChevronRight,
     ChevronLeft,
     Package,
     Tractor,
     Leaf,
     Wrench,
     Sprout,
     ShoppingBag,
     Plus
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../../utils/constants';

const { width } = Dimensions.get('window');

const CATEGORIES = [
     { id: '1', name: 'Seeds', icon: Sprout, color: '#DCFCE7' },
     { id: '2', name: 'Fertilizers', icon: Leaf, color: '#FEF9C3' },
     { id: '3', name: 'Tools', icon: Wrench, color: '#DBEAFE' },
     { id: '4', name: 'Equipment', icon: Tractor, color: '#FFEDD5' },
];

export const CustomerHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { user } = useAuth();
     const [featuredProducts, setFeaturedProducts] = useState([]);

     useEffect(() => {
          console.log('Fetching products from:', `${API_URL}/products`);
          fetch(`${API_URL}/products`)
               .then(res => {
                    if (!res.ok) {
                         console.error('Server returned error:', res.status);
                         return [];
                    }
                    return res.json();
               })
               .then(data => {
                    console.log('Fetched products count:', data?.length);
                    setFeaturedProducts(data.slice(0, 10));
               })
               .catch(err => console.error('Product fetch error:', err));
     }, []);

     return (
          <View className="flex-1 bg-white">
               {/* Dynamic Header */}
               <SafeAreaView edges={['top']} className="bg-primary-light pb-4">
                    <View className="px-5 pt-4 flex-row justify-between items-center bg-primary-light">
                         <View>
                              <Text className="text-primary-branding text-xl font-black">Get in 15 Minutes</Text>
                              <TouchableOpacity className="flex-row items-center mt-1">
                                   <MapPin size={14} color="#006B44" />
                                   <Text className="text-neutral-500 text-xs font-bold ml-1">Maharashtra Housing Board Pune</Text>
                              </TouchableOpacity>
                         </View>
                         <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm">
                              <Image
                                   source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80' }}
                                   className="w-10 h-10 rounded-full"
                              />
                         </View>
                    </View>

                    {/* Search Bar matching image */}
                    <View className="px-5 mt-6">
                         <View className="bg-white rounded-2xl flex-row items-center px-5 py-4 shadow-sm border border-neutral-100">
                              <TextInput
                                   placeholder='Search "seeds"'
                                   className="flex-1 text-neutral-900 text-lg font-medium"
                                   placeholderTextColor="#94A3B8"
                              />
                              <Search size={24} color="#1E293B" />
                         </View>
                    </View>
               </SafeAreaView>

               <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Hero Banner Section */}
                    <View className="px-5 mt-6">
                         <View className="bg-primary-light rounded-[32px] overflow-hidden flex-row items-center p-6 h-48 border border-neutral-50">
                              <View className="flex-1">
                                   <Text className="text-primary-branding text-2xl font-black">Happiness</Text>
                                   <Text className="text-neutral-500 text-xs font-bold mb-3 italic">is having more plants...</Text>
                                   <View className="bg-primary-branding self-start px-3 py-1.5 rounded-lg shadow-sm">
                                        <Text className="text-white text-xs font-bold">Get up to 35% OFF</Text>
                                   </View>
                                   <TouchableOpacity className="mt-4 bg-white/50 self-start px-4 py-1 rounded-full border border-primary-branding/20">
                                        <Text className="text-primary-branding text-[10px] font-black uppercase">Shop Now</Text>
                                   </TouchableOpacity>
                              </View>
                              <Image
                                   source={{ uri: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&q=80' }}
                                   className="w-32 h-full rounded-2xl"
                                   resizeMode="cover"
                              />
                              {/* Arrows */}
                              <TouchableOpacity className="absolute left-2 top-1/2 -mt-4 bg-white/40 p-1 rounded-full">
                                   <ChevronLeft size={16} color="#006B44" />
                              </TouchableOpacity>
                              <TouchableOpacity className="absolute right-2 top-1/2 -mt-4 bg-white/40 p-1 rounded-full">
                                   <ChevronRight size={16} color="#006B44" />
                              </TouchableOpacity>
                         </View>
                         {/* Dots Indicator */}
                         <View className="flex-row justify-center mt-3 space-x-1.5">
                              <View className="w-1.5 h-1.5 rounded-full bg-primary-branding" />
                              <View className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                              <View className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                              <View className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                         </View>
                    </View>

                    {/* Product Grid Area */}
                    <View className="px-5 mt-8 mb-24">
                         <View className="flex-row justify-between items-center mb-6">
                              <Text className="text-2xl font-black text-neutral-900 italic">Fresh Deals</Text>
                              <TouchableOpacity>
                                   <Text className="text-primary-branding font-bold">See All</Text>
                              </TouchableOpacity>
                         </View>

                         <View className="flex-row flex-wrap justify-between">
                              {featuredProducts.map((item: any) => (
                                   <View
                                        key={item._id}
                                        className="bg-white rounded-3xl p-4 mb-6 shadow-card border border-neutral-50"
                                        style={{ width: (width - 50) / 2 }}
                                   >
                                        {/* Badge */}
                                        <View className="absolute top-2 left-2 bg-green-500 px-1.5 py-0.5 rounded-md z-10">
                                             <Text className="text-white text-[8px] font-bold">10% OFF</Text>
                                        </View>

                                        <View className="items-center mb-3">
                                             <Image
                                                  source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                                                  className="w-24 h-24 rounded-2xl bg-neutral-50"
                                                  resizeMode="contain"
                                             />
                                        </View>

                                        <TouchableOpacity className="absolute top-20 right-2 bg-white p-1.5 rounded-xl shadow-premium border border-neutral-100">
                                             <Plus size={20} color="#006B44" />
                                        </TouchableOpacity>

                                        <View>
                                             <Text className="text-neutral-900 font-bold text-sm" numberOfLines={2}>{item.name}</Text>
                                             <Text className="text-neutral-400 text-[10px] mt-0.5">{item.category}</Text>
                                             <View className="flex-row items-center mt-3">
                                                  <Text className="text-neutral-900 font-black text-base">₹{item.price}</Text>
                                                  <Text className="text-neutral-400 text-[10px] line-through ml-2 font-medium">₹{Math.round(item.price * 1.15)}</Text>
                                             </View>
                                        </View>
                                   </View>
                              ))}
                         </View>
                    </View>
               </ScrollView>

               {/* Custom Bottom NavBar Placeholder Logic */}
               {/* Note: This is usually handled by Tab Navigator, but I will style it in navigation config later */}
          </View>
     );
};
