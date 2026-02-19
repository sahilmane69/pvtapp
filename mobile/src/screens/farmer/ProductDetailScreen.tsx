import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export const ProductDetailScreen = () => {
     const navigation = useNavigation<any>();
     const route = useRoute<any>();
     const { addToCart } = useCart();
     const { product } = route.params;

     return (
          <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
               {/* Back Button */}
               <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full shadow-lg"
               >
                    <ArrowLeft size={24} color="#333" />
               </TouchableOpacity>

               <ScrollView>
                    <Image
                         source={{ uri: product.image || 'https://via.placeholder.com/400' }}
                         className="w-full h-80 bg-stone-200"
                         resizeMode="cover"
                    />
                    <View className="p-6 -mt-6 bg-white rounded-t-3xl shadow-lg">
                         <View className="flex-row justify-between items-start mb-4">
                              <View className="flex-1 mr-4">
                                   <Text className="text-2xl font-bold text-stone-800 mb-1">{product.name}</Text>
                                   <Text className="text-stone-500 font-medium">{product.category}</Text>
                              </View>
                              <View className="bg-emerald-50 px-4 py-2 rounded-xl">
                                   <Text className="text-emerald-700 font-bold text-xl">₹{product.price}</Text>
                              </View>
                         </View>

                         <Text className="text-stone-600 leading-6 mb-6">
                              {product.description || "Fresh and high quality product directly from the best sources. Perfect for your farming needs."}
                         </Text>
                    </View>
               </ScrollView>

               <View className="p-4 border-t border-stone-100 bg-white pb-8">
                    <TouchableOpacity
                         className="bg-emerald-600 w-full py-4 rounded-2xl items-center shadow-lg active:bg-emerald-700"
                         onPress={() => {
                              addToCart(product);
                              Alert.alert('Added to Cart', `${product.name} is now in your cart`);
                         }}
                    >
                         <Text className="text-white font-bold text-xl">Add to Cart</Text>
                    </TouchableOpacity>
               </View>
          </SafeAreaView>
     );
};
