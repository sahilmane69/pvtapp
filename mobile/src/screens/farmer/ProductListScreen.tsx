import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { products } from '../../data/products';

export const ProductListScreen = () => {
     const navigation = useNavigation<any>();

     return (
          <View className="flex-1 bg-gray-50 p-4">
               <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
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
