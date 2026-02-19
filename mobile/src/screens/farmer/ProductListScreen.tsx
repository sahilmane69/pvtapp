import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://192.168.0.101:5000';

interface Product {
     _id: string; // MongoDB uses _id
     name: string;
     category: string;
     price: number;
     quantityAvailable: number;
     image?: string;
}

export const ProductListScreen = () => {
     const navigation = useNavigation<any>();
     const route = useRoute<any>();
     const { category } = route.params || {};

     const [products, setProducts] = useState<Product[]>([]);
     const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
     const [isLoading, setIsLoading] = useState(true);
     const [isRefreshing, setIsRefreshing] = useState(false);

     const fetchProducts = async (isRef = false) => {
          if (!isRef) setIsLoading(true);
          try {
               const response = await fetch(`${API_URL}/products`);
               const data = await response.json();
               setProducts(data);
               if (category) {
                    setFilteredProducts(data.filter((p: Product) => p.category === category));
               } else {
                    setFilteredProducts(data);
               }
          } catch (error) {
               console.error('Failed to load products', error);
          } finally {
               setIsLoading(false);
               setIsRefreshing(false);
          }
     };

     useEffect(() => {
          fetchProducts();
     }, [category]);

     if (isLoading && !isRefreshing) {
          return (
               <View className="flex-1 justify-center items-center bg-stone-50">
                    <ActivityIndicator size="large" color="#059669" />
                    <Text className="mt-4 text-stone-500 font-medium">Loading fresh products...</Text>
               </View>
          );
     }

     return (
          <SafeAreaView className="flex-1 bg-stone-50" edges={['top', 'left', 'right']}>
               <View className="flex-1 p-4">
                    {category && (
                         <Text className="text-2xl font-bold text-stone-800 mb-4 ml-1">{category}</Text>
                    )}
                    <FlatList
                         data={filteredProducts}
                         keyExtractor={(item) => item._id}
                         refreshControl={
                              <RefreshControl
                                   refreshing={isRefreshing}
                                   onRefresh={() => {
                                        setIsRefreshing(true);
                                        fetchProducts(true);
                                   }}
                                   colors={['#059669']}
                              />
                         }
                         renderItem={({ item }) => (
                              <TouchableOpacity
                                   className="bg-white p-3 mb-4 rounded-2xl shadow-sm border border-stone-100 flex-row items-center"
                                   activeOpacity={0.7}
                                   onPress={() => navigation.navigate('ProductDetail', { product: item })}
                              >
                                   <Image
                                        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                                        className="w-24 h-24 rounded-xl bg-stone-200"
                                        resizeMode="cover"
                                   />
                                   <View className="flex-1 ml-4 h-24 justify-between py-1">
                                        <View>
                                             <Text className="text-lg font-bold text-stone-800 numberOfLines={2}">{item.name}</Text>
                                             <Text className="text-stone-500 text-xs uppercase font-medium mt-1">{item.category}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-end">
                                             <Text className="text-emerald-700 font-bold text-lg">₹{item.price}</Text>
                                             <View className="bg-emerald-50 px-3 py-1 rounded-full">
                                                  <Text className="text-emerald-700 font-medium text-xs">Add +</Text>
                                             </View>
                                        </View>
                                   </View>
                              </TouchableOpacity>
                         )}
                         contentContainerStyle={{ paddingBottom: 20 }}
                         showsVerticalScrollIndicator={false}
                         ListEmptyComponent={
                              <View className="items-center mt-20">
                                   <Text className="text-stone-400">No products found</Text>
                              </View>
                         }
                    />
               </View>
          </SafeAreaView>
     );
};
