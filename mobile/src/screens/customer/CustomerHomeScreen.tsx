import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
     Search,
     MapPin,
     Plus,
     LogOut,
     User as UserIcon
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../../utils/constants';

const { width } = Dimensions.get('window');

const BANNERS = [
     {
          id: '1',
          title: '35% OFF',
          subtitle: 'Organic Seeds & Tools',
          cta: 'Shop Now',
          image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&q=80',
          color: '#006B44'
     },
     {
          id: '2',
          title: 'FRESH DEALS',
          subtitle: 'Pure Farm Vegetables',
          cta: 'Browse All',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
          color: '#059669'
     },
     {
          id: '3',
          title: 'EQUIPMENT',
          subtitle: 'Modern Farming Tools',
          cta: 'View More',
          image: 'https://images.unsplash.com/photo-1530519729491-acf5830006f0?w=800&q=80',
          color: '#1E293B'
     },
     {
          id: '4',
          title: 'FERTILIZERS',
          subtitle: 'Maximize Your Yield',
          cta: 'Explore',
          image: 'https://images.unsplash.com/photo-1599307734107-160243058f40?w=800&q=80',
          color: '#065F46'
     },
     {
          id: '5',
          title: 'FRUIT BASKET',
          subtitle: 'Farm Fresh Deliveries',
          cta: 'Order Now',
          image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',
          color: '#15803D'
     },
     {
          id: '6',
          title: 'SMART FARM',
          subtitle: 'IoT Irrigation Kits',
          cta: 'Get Smart',
          image: 'https://images.unsplash.com/photo-1589923188900-85da00a7398b?w=800&q=80',
          color: '#0F172A'
     }
];

const BannerCarousel = () => {
     const flatListRef = useRef<FlatList>(null);
     const [activeIndex, setActiveIndex] = useState(0);
     const timerRef = useRef<any>(null);
     const isPaused = useRef(false);

     const startAutoScroll = () => {
          stopAutoScroll();
          timerRef.current = setInterval(() => {
               if (!isPaused.current) {
                    let nextIndex = (activeIndex + 1) % BANNERS.length;
                    flatListRef.current?.scrollToIndex({
                         index: nextIndex,
                         animated: true
                    });
                    setActiveIndex(nextIndex);
               }
          }, 4000);
     };

     const stopAutoScroll = () => {
          if (timerRef.current) clearInterval(timerRef.current);
     };

     useEffect(() => {
          startAutoScroll();
          return () => stopAutoScroll();
     }, [activeIndex]);

     const renderItem = ({ item }: { item: typeof BANNERS[0] }) => (
          <View style={{ width: width - 48 }} className="mx-6">
               <View
                    style={{ backgroundColor: item.color }}
                    className="rounded-[40px] overflow-hidden flex-row items-center p-8 h-48 shadow-premium"
               >
                    <View className="flex-1 z-10">
                         <Text className="text-white text-3xl font-black italic tracking-tighter uppercase">{item.title}</Text>
                         <Text className="text-white/80 text-[10px] font-bold mb-5 uppercase tracking-widest">{item.subtitle}</Text>
                         <TouchableOpacity className="bg-white self-start px-6 py-2.5 rounded-2xl shadow-sm">
                              <Text style={{ color: item.color }} className="text-[10px] font-black uppercase tracking-wider">{item.cta}</Text>
                         </TouchableOpacity>
                    </View>
                    <Image
                         source={{ uri: item.image }}
                         className="w-32 h-full rounded-3xl absolute right-4 opacity-80"
                         resizeMode="cover"
                    />
               </View>
          </View>
     );

     return (
          <View className="mt-6">
               <FlatList
                    ref={flatListRef}
                    data={BANNERS}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={width}
                    decelerationRate="fast"
                    contentContainerStyle={{ paddingHorizontal: 0 }}
                    onScrollBeginDrag={() => { isPaused.current = true; }}
                    onScrollEndDrag={() => { isPaused.current = false; }}
                    keyExtractor={(item) => item.id}
                    getItemLayout={(_, index) => ({
                         length: width,
                         offset: width * index,
                         index,
                    })}
                    onMomentumScrollEnd={(event) => {
                         const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                         setActiveIndex(newIndex);
                    }}
               />

               {/* Indicators */}
               <View className="flex-row justify-center mt-4">
                    {BANNERS.map((_, index) => (
                         <View
                              key={index}
                              className={`h-1.5 mx-1 rounded-full ${activeIndex === index ? 'w-6 bg-primary-branding' : 'w-2 bg-neutral-200'}`}
                         />
                    ))}
               </View>
          </View>
     );
};

export const CustomerHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { logout } = useAuth();
     const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

     useEffect(() => {
          fetch(`${API_URL}/products`)
               .then(res => res.ok ? res.json() : [])
               .then(data => {
                    setFeaturedProducts(data.slice(0, 10));
               })
               .catch(err => console.error('Product fetch error:', err));
     }, []);

     return (
          <View className="flex-1 bg-background">
               {/* Dynamic Header */}
               <SafeAreaView edges={['top']} className="bg-white pb-6 shadow-sm">
                    <View className="px-6 pt-4 flex-row justify-between items-center">
                         <View className="flex-1">
                              <Text className="text-primary-branding text-2xl font-black italic tracking-tighter">FarminGo</Text>
                              <TouchableOpacity className="flex-row items-center mt-1">
                                   <MapPin size={12} color="#64748B" />
                                   <Text className="text-neutral-500 text-xs font-bold ml-1" numberOfLines={1}>Maharashtra Housing Board Pune</Text>
                              </TouchableOpacity>
                         </View>
                         <View className="flex-row items-center">
                              <View className="w-12 h-12 bg-neutral-100 rounded-2xl items-center justify-center mr-3 border border-neutral-200">
                                   <UserIcon size={24} color="#64748B" />
                              </View>
                              <TouchableOpacity
                                   className="bg-neutral-100 p-3 rounded-2xl border border-neutral-200"
                                   onPress={() => logout()}
                              >
                                   <LogOut size={20} color="#64748B" />
                              </TouchableOpacity>
                         </View>
                    </View>

                    {/* Improved Search Bar */}
                    <View className="px-6 mt-6">
                         <View className="bg-neutral-100 rounded-[24px] flex-row items-center px-5 py-4 border border-neutral-200">
                              <Search size={20} color="#94A3B8" />
                              <TextInput
                                   placeholder='Search "High quality seeds"'
                                   className="flex-1 text-neutral-900 text-base font-bold ml-3"
                                   placeholderTextColor="#94A3B8"
                              />
                         </View>
                    </View>
               </SafeAreaView>

               <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Hero Banner Section - Now a Carousel */}
                    <BannerCarousel />

                    {/* Product Grid Area */}
                    <View className="px-6 mt-8 mb-24">
                         <View className="flex-row justify-between items-center mb-6">
                              <Text className="text-2xl font-black text-neutral-900 italic tracking-tighter">FRESH DEALS</Text>
                              <TouchableOpacity>
                                   <Text className="text-primary-branding font-black text-xs uppercase tracking-widest">See All</Text>
                              </TouchableOpacity>
                         </View>

                         <View className="flex-row flex-wrap justify-between">
                              {featuredProducts.map((item: any) => (
                                   <View
                                        key={item._id}
                                        className="bg-white rounded-[32px] p-4 mb-6 shadow-card border border-neutral-100"
                                        style={{ width: (width - 60) / 2, height: 260 }}
                                   >
                                        <View className="items-center mb-4 bg-neutral-50 rounded-3xl p-4 h-32 justify-center">
                                             <Image
                                                  source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                                                  className="w-full h-full"
                                                  resizeMode="contain"
                                             />
                                             <TouchableOpacity className="absolute bottom-[-10px] right-[-10px] bg-primary-branding p-3 rounded-2xl shadow-premium">
                                                  <Plus size={20} color="#fff" />
                                             </TouchableOpacity>
                                        </View>

                                        <View className="flex-1 justify-between">
                                             <View>
                                                  <Text className="text-neutral-900 font-black text-sm italic" numberOfLines={2}>{item.name.toUpperCase()}</Text>
                                                  <Text className="text-neutral-400 text-[10px] font-bold uppercase mt-1 tracking-widest">{item.category}</Text>
                                             </View>
                                             <View className="flex-row items-baseline mt-2">
                                                  <Text className="text-neutral-900 font-black text-xl italic">₹{item.price}</Text>
                                                  <Text className="text-neutral-400 text-xs line-through ml-2 font-bold">₹{Math.round(item.price * 1.3)}</Text>
                                             </View>
                                        </View>
                                   </View>
                              ))}
                         </View>
                    </View>
               </ScrollView>
          </View>
     );
};
