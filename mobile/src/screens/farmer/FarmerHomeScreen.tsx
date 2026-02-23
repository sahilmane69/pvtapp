import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Search, MapPin, ChevronRight, Package, Tractor, Leaf, Wrench, Sprout, ShoppingBag } from 'lucide-react-native';

const CATEGORIES = [
     { id: '1', name: 'Seeds', icon: Sprout, image: 'https://images.unsplash.com/photo-1591857177580-dc82b9e4e11c?w=400&q=80', slug: 'Seeds' },
     { id: '2', name: 'Fertilizers', icon: Leaf, image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400&q=80', slug: 'Fertilizers' },
     { id: '3', name: 'Tools', icon: Wrench, image: 'https://images.unsplash.com/photo-1416879115507-1961852e6157?w=400&q=80', slug: 'Tools' },
     { id: '4', name: 'Equipment', icon: Tractor, image: 'https://images.unsplash.com/photo-1530267981375-f0de93cdf5b8?w=400&q=80', slug: 'Equipment' },
     { id: '5', name: 'Pesticides', icon: Package, image: 'https://images.unsplash.com/photo-1589923188900-85dae5233f71?w=400&q=80', slug: 'Pesticides' },
];

import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../../utils/constants';

export const FarmerHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { user } = useAuth();
     const [featuredProducts, setFeaturedProducts] = useState([]);

     useEffect(() => {
          let cancelled = false;
          fetch(`${API_URL}/products`)
               .then(res => res.ok ? res.json() : [])
               .then(data => {
                    if (!cancelled && data?.length > 0) setFeaturedProducts(data.slice(0, 5));
               })
               .catch(() => { /* silently use dummy data */ });
          return () => { cancelled = true; };
     }, []);

     return (
          <View className="flex-1 bg-emerald-700">
               <SafeAreaView edges={['top']} className="bg-emerald-700">
                    <View className="pb-6 px-4 shadow-lg bg-emerald-700">
                         <View className="flex-row justify-between items-center mb-4">
                              <View className="flex-1">
                                   <Text className="text-emerald-100 text-xs font-medium uppercase tracking-wider">Delivering to</Text>
                                   <TouchableOpacity className="flex-row items-center">
                                        <Text className="text-white text-lg font-bold mr-1">Farm House, Village...</Text>
                                        <MapPin size={16} color="#d1fae5" />
                                   </TouchableOpacity>
                              </View>
                              <TouchableOpacity
                                   className="bg-emerald-600 p-2 rounded-full relative"
                                   onPress={() => navigation.navigate('Cart')}
                              >
                                   <ShoppingCart size={24} color="white" />
                                   {/* Badge could go here */}
                              </TouchableOpacity>
                         </View>

                         {/* Search Bar */}
                         <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 shadow-md">
                              <Search size={20} color="#9ca3af" />
                              <TextInput
                                   placeholder="Search 'tomato seeds'..."
                                   className="flex-1 ml-2 text-stone-700 text-base"
                                   placeholderTextColor="#9ca3af"
                              />
                         </View>
                    </View>
               </SafeAreaView>

               <View className="flex-1 bg-stone-50">
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                         {/* Quick Actions */}
                         <View className="flex-row justify-between px-6 -mt-8 mb-6">
                              <TouchableOpacity
                                   className="bg-white p-4 rounded-2xl shadow-lg border border-emerald-50 w-[48%] flex-row items-center justify-center space-x-2"
                                   onPress={() => navigation.navigate('FarmerOrders')}
                                   activeOpacity={0.9}
                              >
                                   <Package size={24} color="#059669" />
                                   <Text className="font-bold text-stone-700">My Orders</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                   className="bg-white p-4 rounded-2xl shadow-lg border border-emerald-50 w-[48%] flex-row items-center justify-center space-x-2"
                                   onPress={() => navigation.navigate('ProductList')}
                                   activeOpacity={0.9}
                              >
                                   <ShoppingCart size={24} color="#059669" />
                                   <Text className="font-bold text-stone-700">All Products</Text>
                              </TouchableOpacity>
                         </View>

                         {/* Categories */}
                         <View className="px-4 mb-6">
                              <View className="flex-row justify-between items-center mb-3">
                                   <Text className="text-xl font-bold text-stone-800">Categories</Text>
                                   <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
                                        <Text className="text-emerald-600 font-semibold">See All</Text>
                                   </TouchableOpacity>
                              </View>
                              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
                                   {CATEGORIES.map((cat) => (
                                        <TouchableOpacity
                                             key={cat.id}
                                             className="mr-4 items-center"
                                             onPress={() => navigation.navigate('ProductList', { category: cat.slug })}
                                        >
                                             <View className="w-16 h-16 rounded-full bg-emerald-50 items-center justify-center border border-emerald-100 mb-2 overflow-hidden">
                                                  <Image source={{ uri: cat.image }} className="w-full h-full opacity-90" resizeMode="cover" />
                                             </View>
                                             <Text className="text-xs font-medium text-stone-600">{cat.name}</Text>
                                        </TouchableOpacity>
                                   ))}
                              </ScrollView>
                         </View>

                         {/* Banner */}
                         <View className="mx-4 mb-8 rounded-2xl overflow-hidden shadow-sm relative h-40 bg-emerald-900 justify-center">
                              <Image
                                   source={{ uri: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80' }}
                                   className="absolute inset-0 w-full h-full opacity-40"
                                   resizeMode="cover"
                              />
                              <View className="px-6">
                                   <Text className="text-yellow-400 font-bold mb-1">SUMMER SALE</Text>
                                   <Text className="text-white text-2xl font-bold mb-2">Up to 50% Off on Tools</Text>
                                   <TouchableOpacity
                                        className="bg-white self-start px-4 py-2 rounded-lg"
                                        onPress={() => navigation.navigate('ProductList', { category: 'Tools' })}
                                   >
                                        <Text className="text-emerald-900 font-bold">Shop Now</Text>
                                   </TouchableOpacity>
                              </View>
                         </View>

                         {/* Featured Products */}
                         <View className="px-4 mb-20">
                              <Text className="text-xl font-bold text-stone-800 mb-3">Featured Products</Text>
                              {featuredProducts.map((item: any) => (
                                   <TouchableOpacity
                                        key={item._id}
                                        className="bg-white mb-4 rounded-2xl p-3 flex-row shadow-sm border border-stone-100"
                                        onPress={() => navigation.navigate('ProductDetail', { product: item })}
                                   >
                                        <Image
                                             source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                                             className="w-24 h-24 rounded-xl bg-stone-200"
                                        />
                                        <View className="flex-1 ml-4 justify-between py-1">
                                             <View>
                                                  <Text className="font-bold text-stone-800 text-lg">{item.name}</Text>
                                                  <Text className="text-stone-500 text-xs">{item.category}</Text>
                                             </View>
                                             <View className="flex-row justify-between items-center">
                                                  <Text className="text-emerald-700 font-bold text-lg">₹{item.price}</Text>
                                                  <View className="bg-emerald-50 p-2 rounded-full">
                                                       <ShoppingBag size={16} color="#059669" />
                                                  </View>
                                             </View>
                                        </View>
                                   </TouchableOpacity>
                              ))}
                         </View>
                    </ScrollView>
               </View>
          </View>
     );
};
