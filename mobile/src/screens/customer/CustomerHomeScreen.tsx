import React, {
     useEffect, useState, useRef,
     useCallback, useMemo, memo,
} from 'react';
import {
     View, Text, TouchableOpacity, Image,
     ScrollView, TextInput, Dimensions, FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../context/DrawerContext';
import { Search, MapPin, Plus, User as UserIcon, ShoppingBag } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../../utils/constants';
import { DUMMY_PRODUCTS, STOCK_STATUS_COLORS } from '../../data/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

// ── Banner data (defined outside component — never recreated) ────
const BANNERS = [
     {
          id: '1', title: '35% OFF', subtitle: 'Organic Seeds & Tools', cta: 'Shop Now',
          image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&q=80',
          color: '#006B44',
     },
     {
          id: '2', title: 'FRESH DEALS', subtitle: 'Pure Farm Vegetables', cta: 'Browse All',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
          color: '#059669',
     },
     {
          id: '3', title: 'EQUIPMENT', subtitle: 'Modern Farming Tools', cta: 'View More',
          image: 'https://images.unsplash.com/photo-1530519729491-acf5830006f0?w=800&q=80',
          color: '#1E293B',
     },
     {
          id: '4', title: 'FERTILIZERS', subtitle: 'Maximize Your Yield', cta: 'Explore',
          image: 'https://images.unsplash.com/photo-1599307734107-160243058f40?w=800&q=80',
          color: '#065F46',
     },
     {
          id: '5', title: 'FRUIT BASKET', subtitle: 'Farm Fresh Deliveries', cta: 'Order Now',
          image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',
          color: '#15803D',
     },
     {
          id: '6', title: 'SMART FARM', subtitle: 'IoT Irrigation Kits', cta: 'Get Smart',
          image: 'https://images.unsplash.com/photo-1589923188900-85da00a7398b?w=800&q=80',
          color: '#0F172A',
     },
];
const CATEGORIES = ['All', 'Seeds', 'Fertilizers', 'Tools'];
const BANNER_WIDTH = width; // each page = full width

// ── Banner item (pure — memoized entirely) ───────────────────────
const BannerItem = memo(({ item }: { item: typeof BANNERS[0] }) => (
     <View style={{ width: BANNER_WIDTH, paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: item.color }}
               className="rounded-[40px] overflow-hidden flex-row items-center p-8 h-48 shadow-premium">
               <View className="flex-1 z-10">
                    <Text className="text-white text-3xl font-black italic tracking-tighter uppercase">{item.title}</Text>
                    <Text className="text-white/80 text-[10px] font-bold mb-5 uppercase tracking-widest">{item.subtitle}</Text>
                    <TouchableOpacity className="bg-white self-start px-6 py-2.5 rounded-2xl shadow-sm">
                         <Text style={{ color: item.color }} className="text-[10px] font-black uppercase tracking-wider">{item.cta}</Text>
                    </TouchableOpacity>
               </View>
               <Image source={{ uri: item.image }}
                    className="w-32 h-full rounded-3xl absolute right-4 opacity-80"
                    resizeMode="cover" />
          </View>
     </View>
));

// ── Banner Carousel (fixed stale-closure bug in auto-scroll) ─────
const BannerCarousel = memo(() => {
     const flatListRef = useRef<FlatList>(null);
     const activeIndexRef = useRef(0);       // ← ref instead of state to avoid stale closures
     const [dotIndex, setDotIndex] = useState(0); // separate state just for dots
     const isPaused = useRef(false);

     // Stable render function — never recreated
     const renderItem = useCallback(({ item }: { item: typeof BANNERS[0] }) => (
          <BannerItem item={item} />
     ), []);

     const keyExtractor = useCallback((item: typeof BANNERS[0]) => item.id, []);

     const getItemLayout = useCallback(
          (_: any, index: number) => ({ length: BANNER_WIDTH, offset: BANNER_WIDTH * index, index }),
          []
     );

     const onMomentumScrollEnd = useCallback((e: any) => {
          const newIdx = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
          activeIndexRef.current = newIdx;
          setDotIndex(newIdx);
     }, []);

     // Auto-scroll reads from ref — no stale closure issue
     useEffect(() => {
          const id = setInterval(() => {
               if (isPaused.current) return;
               const next = (activeIndexRef.current + 1) % BANNERS.length;
               flatListRef.current?.scrollToIndex({ index: next, animated: true });
               activeIndexRef.current = next;
               setDotIndex(next);
          }, 4000);
          return () => clearInterval(id);
     }, []); // runs once — safe because we read from ref

     return (
          <View className="mt-6">
               <FlatList
                    ref={flatListRef}
                    data={BANNERS}
                    renderItem={renderItem}
                    horizontal pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="start"
                    snapToInterval={BANNER_WIDTH}
                    decelerationRate="fast"
                    keyExtractor={keyExtractor}
                    getItemLayout={getItemLayout}
                    onScrollBeginDrag={() => { isPaused.current = true; }}
                    onScrollEndDrag={() => { isPaused.current = false; }}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    initialNumToRender={2}
                    maxToRenderPerBatch={2}
                    windowSize={3}
                    removeClippedSubviews
               />
               {/* Dot indicators */}
               <View className="flex-row justify-center mt-4">
                    {BANNERS.map((_, i) => (
                         <View key={i}
                              className={`h-1.5 mx-1 rounded-full ${dotIndex === i ? 'w-6 bg-primary-branding' : 'w-2 bg-neutral-200'}`}
                         />
                    ))}
               </View>
          </View>
     );
});

// ── Product Card (memoized so grid items don't re-render on search) ─
const ProductCard = memo(({ item }: { item: any }) => {
     const mrp = item.mrp || Math.round(item.price * 1.3);
     const discount = item.discount || Math.round((1 - item.price / mrp) * 100);
     const stock = item.stockStatus || 'In Stock';
     const sColor = STOCK_STATUS_COLORS[stock] || '#059669';

     return (
          <TouchableOpacity
               activeOpacity={0.92}
               className="bg-white rounded-[32px] p-4 mb-5 shadow-card border border-neutral-100"
               style={{ width: CARD_WIDTH }}
          >
               {discount > 0 && (
                    <View className="absolute top-4 right-4 z-10 bg-primary-branding px-2 py-0.5 rounded-lg">
                         <Text className="text-white text-[9px] font-black">-{discount}%</Text>
                    </View>
               )}
               <View className="items-center mb-3 bg-neutral-50 rounded-3xl p-3 h-[120px] justify-center overflow-hidden">
                    <Image
                         source={{ uri: item.image || DUMMY_PRODUCTS[0].image }}
                         className="w-full h-full"
                         resizeMode="contain"
                    />
                    <TouchableOpacity className="absolute bottom-[-10px] right-[-10px] bg-primary-branding p-2.5 rounded-2xl shadow-premium">
                         <Plus size={18} color="#fff" />
                    </TouchableOpacity>
               </View>
               <View className="mt-2">
                    <Text className="text-neutral-900 font-black text-sm" numberOfLines={2}>{item.name}</Text>
                    <View className="flex-row items-center mt-1">
                         <View style={{ backgroundColor: sColor + '22' }} className="px-2 py-0.5 rounded-lg">
                              <Text style={{ color: sColor }} className="text-[9px] font-black uppercase">{stock}</Text>
                         </View>
                    </View>
                    <View className="flex-row items-baseline mt-2">
                         <Text className="text-primary-branding font-black text-lg">₹{item.price}</Text>
                         <Text className="text-neutral-400 text-xs line-through ml-2">₹{mrp}</Text>
                    </View>
               </View>
          </TouchableOpacity>
     );
});

// ── Main Screen ──────────────────────────────────────────────────
export const CustomerHomeScreen = () => {
     const navigation = useNavigation<any>();
     const { openDrawer } = useDrawer();

     const [products, setProducts] = useState<any[]>(DUMMY_PRODUCTS);
     const [activeCategory, setActiveCategory] = useState('All');
     const [searchText, setSearchText] = useState('');

     // Fetch real products once — no dependency needed
     useEffect(() => {
          let cancelled = false;
          fetch(`${API_URL}/products`)
               .then(res => res.ok ? res.json() : null)
               .then(data => {
                    if (!cancelled && data?.length > 0) setProducts(data);
               })
               .catch(() => { /* keep dummy */ });
          return () => { cancelled = true; };
     }, []);

     // Derive filtered list — recomputes only when inputs change
     const filtered = useMemo(() => {
          let result = products;
          if (activeCategory !== 'All') {
               result = result.filter((p: any) => p.category === activeCategory);
          }
          if (searchText.trim()) {
               const q = searchText.toLowerCase();
               result = result.filter((p: any) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
               );
          }
          return result;
     }, [products, activeCategory, searchText]);

     return (
          <View className="flex-1 bg-background">
               {/* ── Header ─────────────────────────────────────────────── */}
               <SafeAreaView edges={['top']} className="bg-white pb-4 shadow-sm">
                    <View className="px-6 pt-4 flex-row justify-between items-center">
                         <View className="flex-1">
                              <Text className="text-primary-branding text-2xl font-black italic tracking-tighter">FarminGo</Text>
                              <TouchableOpacity className="flex-row items-center mt-1">
                                   <MapPin size={12} color="#64748B" />
                                   <Text className="text-neutral-500 text-xs font-bold ml-1" numberOfLines={1}>
                                        Maharashtra Housing Board Pune
                                   </Text>
                              </TouchableOpacity>
                         </View>
                         <TouchableOpacity
                              onPress={openDrawer}
                              activeOpacity={0.75}
                              className="w-12 h-12 bg-neutral-100 rounded-2xl items-center justify-center border border-neutral-200"
                         >
                              <UserIcon size={24} color="#64748B" />
                         </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View className="px-6 mt-5">
                         <View className="bg-neutral-100 rounded-[24px] flex-row items-center px-5 py-4 border border-neutral-200">
                              <Search size={20} color="#94A3B8" />
                              <TextInput
                                   placeholder='Search seeds, fertilizers, tools...'
                                   className="flex-1 text-neutral-900 text-base font-medium ml-3"
                                   placeholderTextColor="#94A3B8"
                                   value={searchText}
                                   onChangeText={setSearchText}
                                   returnKeyType="search"
                                   clearButtonMode="while-editing"
                              />
                         </View>
                    </View>
               </SafeAreaView>

               <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* ── Banner Carousel ─────────────────────────────────── */}
                    <BannerCarousel />

                    {/* ── Category Tabs ───────────────────────────────────── */}
                    <View className="mt-6 px-6">
                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                              <View className="flex-row">
                                   {CATEGORIES.map((cat) => (
                                        <TouchableOpacity
                                             key={cat}
                                             onPress={() => setActiveCategory(cat)}
                                             className={`mr-3 px-5 py-2.5 rounded-2xl border ${activeCategory === cat
                                                  ? 'bg-primary-branding border-primary-branding'
                                                  : 'bg-white border-neutral-200'
                                                  }`}
                                        >
                                             <Text className={`text-xs font-black uppercase tracking-widest ${activeCategory === cat ? 'text-white' : 'text-neutral-500'}`}>
                                                  {cat}
                                             </Text>
                                        </TouchableOpacity>
                                   ))}
                              </View>
                         </ScrollView>
                    </View>

                    {/* ── Product Grid ─────────────────────────────────────── */}
                    <View className="px-6 mt-6 mb-24">
                         <View className="flex-row justify-between items-center mb-6">
                              <View>
                                   <Text className="text-2xl font-black text-neutral-900 italic tracking-tighter">
                                        {activeCategory === 'All' ? 'ALL PRODUCTS' : activeCategory.toUpperCase()}
                                   </Text>
                                   <Text className="text-neutral-400 text-xs font-bold mt-1 uppercase tracking-widest">
                                        {filtered.length} items found
                                   </Text>
                              </View>
                              <View className="bg-primary-light px-4 py-2 rounded-2xl">
                                   <Text className="text-primary-branding text-[10px] font-black uppercase tracking-widest">
                                        Best Prices
                                   </Text>
                              </View>
                         </View>

                         {filtered.length === 0 ? (
                              <View className="items-center py-20">
                                   <ShoppingBag size={48} color="#CBD5E1" />
                                   <Text className="text-neutral-400 font-bold mt-4 uppercase tracking-widest text-xs">
                                        No products found
                                   </Text>
                              </View>
                         ) : (
                              <View className="flex-row flex-wrap justify-between">
                                   {filtered.map((item: any) => (
                                        <ProductCard key={item._id} item={item} />
                                   ))}
                              </View>
                         )}
                    </View>
               </ScrollView>
          </View>
     );
};
