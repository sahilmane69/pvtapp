import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';

export const ProductDetailScreen = () => {
     const navigation = useNavigation<any>();
     const route = useRoute<any>();
     const { addToCart } = useCart();
     const { product } = route.params;

     const handleAddToCart = () => {
          addToCart(product);
          Alert.alert('Success', 'Product added to cart!');
     };

     return (
          <ScrollView className="flex-1 bg-white">
               <View className="bg-green-50 p-8 items-center justify-center">
                    <View className="w-32 h-32 bg-green-200 rounded-full items-center justify-center mb-4">
                         <Text className="text-4xl">🌾</Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-800 text-center">{product.name}</Text>
                    <Text className="text-green-700 text-lg mt-2 font-semibold">₹{product.price.toFixed(2)}</Text>
               </View>

               <View className="p-6">
                    <View className="mb-6">
                         <Text className="text-gray-500 mb-1 font-medium">Category</Text>
                         <Text className="text-lg text-gray-800 capitalize bg-gray-100 self-start px-3 py-1 rounded">{product.category}</Text>
                    </View>

                    <View className="mb-8">
                         <Text className="text-gray-500 mb-1 font-medium">Availability</Text>
                         <Text className="text-lg text-gray-800">{product.quantityAvailable} units in stock</Text>
                    </View>

                    <View className="space-y-4">
                         <TouchableOpacity
                              className="bg-green-600 py-4 rounded-xl items-center shadow-lg active:bg-green-700"
                              onPress={handleAddToCart}
                         >
                              <Text className="text-white font-bold text-lg">Add to Cart</Text>
                         </TouchableOpacity>

                         <TouchableOpacity
                              className="bg-white border-2 border-green-600 py-4 rounded-xl items-center active:bg-green-50"
                              onPress={() => navigation.navigate('Cart')}
                         >
                              <Text className="text-green-700 font-bold text-lg">Go to Cart</Text>
                         </TouchableOpacity>
                    </View>
               </View>
          </ScrollView>
     );
};
