import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.0.101:5000';

interface Product {
     id: string;
     name: string;
     category: string;
     price: number;
     quantityAvailable: number;
}

export const ProductListScreen = () => {
     const navigation = useNavigation<any>();
     const [products, setProducts] = useState<Product[]>([]);
     const [isLoading, setIsLoading] = useState(true);
     const [isRefreshing, setIsRefreshing] = useState(false);

     const fetchProducts = async () => {
          try {
               const response = await fetch(`${API_URL}/products`);
               const data = await response.json();
               setProducts(data);
          } catch (error) {
               console.error('Failed to load products', error);
          } finally {
               setIsLoading(false);
               setIsRefreshing(false);
          }
     };

     useEffect(() => {
          fetchProducts();
     }, []);

     if (isLoading) {
          return (
               <View className="flex-1 justify-center items-center bg-gray-50">
                    <ActivityIndicator size="large" color="#22c55e" />
                    <Text className="mt-4 text-stone-500">Loading fresh products...</Text>
               </View>
          );
     }

     return (
          <View className="flex-1 bg-gray-50 p-4">
               <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                         <RefreshControl
                              refreshing={isRefreshing}
                              onRefresh={() => {
                                   setIsRefreshing(true);
                                   fetchProducts();
                              }}
                         />
                    }
                    renderItem={({ item }) => (
                         <View className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-100 flex-row justify-between items-center">
                              <View>
                                   <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
                                   <Text className="text-green-600 font-bold mt-1">₹{item.price.toFixed(2)}</Text>
                                   <Text className="text-gray-500 text-sm">{item.category}</Text>
                              </View>

                              <TouchableOpacity
                                   className="bg-blue-500 px-4 py-2 rounded-md active:bg-blue-600"
                                   onPress={() => navigation.navigate('ProductDetail', { product: item })}
                              >
                                   <Text className="text-white font-medium">View</Text>
                              </TouchableOpacity>
                         </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
               />
          </View>
     );
};
