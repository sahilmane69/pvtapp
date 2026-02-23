import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Plus, Trash2, ChevronLeft, LayoutDashboard, Tag, IndianRupee, Layers } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  _id?: string;
  name: string;
  category: string;
  price: number;
  quantityAvailable: number;
}

export const AddProductScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products?farmerId=${user?.id}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
      Alert.alert('Error', 'Could not load products');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user?.id]);

  const handleAddProduct = async () => {
    if (!name.trim() || !category.trim() || !price.trim() || !quantity.trim()) {
      Alert.alert('Incomplete Form', 'Please fill in all product details');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim(),
          price: Number(price),
          quantityAvailable: Number(quantity),
          farmerId: user?.id,
          image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&q=80' // Default placeholder
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Product listed successfully');
        setName('');
        setCategory('');
        setPrice('');
        setQuantity('');
        fetchProducts();
      } else {
        Alert.alert('Error', data.message || 'Failed to add product');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    Alert.alert('Remove Listing', 'Are you sure you want to remove this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
              setProducts(prev => prev.filter(p => (p.id || p._id) !== id));
            }
          } catch (e) { Alert.alert('Error', 'Delete failed'); }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-stone-50">
      <SafeAreaView edges={['top']} className="bg-white shadow-sm">
        <View className="px-6 py-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#44403C" />
          </TouchableOpacity>
          <Text className="text-emerald-900 text-xl font-black italic">PRODUCT MANAGER</Text>
          <View className="w-6" />
        </View>
      </SafeAreaView>

      <FlatList
        data={products}
        keyExtractor={(item) => (item.id || item._id || Math.random().toString())}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchProducts()} />}
        ListHeaderComponent={
          <View className="p-6">
            <View className="bg-white p-6 rounded-[32px] shadow-card border border-neutral-100 mb-8">
              <Text className="text-neutral-900 text-lg font-black mb-6 italic uppercase">List New Product</Text>

              <InputField icon={<Tag size={18} color="#059669" />} placeholder="Product Name (e.g. Fresh Tomatoes)" value={name} onChange={setName} />
              <InputField icon={<Layers size={18} color="#059669" />} placeholder="Category" value={category} onChange={setCategory} />
              <InputField icon={<IndianRupee size={18} color="#059669" />} placeholder="Price per unit" value={price} onChange={setPrice} keyboardType="numeric" />
              <InputField icon={<Package size={18} color="#059669" />} placeholder="Stock Quantity" value={quantity} onChange={setQuantity} keyboardType="numeric" />

              <TouchableOpacity
                className={`bg-emerald-700 py-4 rounded-2xl items-center shadow-md mt-4 ${isSubmitting ? 'opacity-50' : ''}`}
                onPress={handleAddProduct}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator color="white" /> : <Text className="text-white font-black uppercase italic tracking-widest">Publish Listing</Text>}
              </TouchableOpacity>
            </View>

            <Text className="text-neutral-900 text-lg font-black mb-4 italic uppercase">Your Active Listings</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mx-6 bg-white p-4 rounded-3xl mb-4 flex-row items-center shadow-sm border border-neutral-100">
            <View className="bg-neutral-50 p-3 rounded-2xl mr-4">
              <Package size={24} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="font-black text-neutral-900 text-base italic" numberOfLines={1}>{item.name}</Text>
              <Text className="text-neutral-400 text-[10px] font-bold uppercase">{item.category}</Text>
              <Text className="text-emerald-700 font-black text-sm mt-1">₹{item.price} • {item.quantityAvailable} in stock</Text>
            </View>
            <TouchableOpacity
              className="bg-red-50 p-3 rounded-2xl"
              onPress={() => handleDeleteProduct(item.id || item._id || '')}
            >
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center py-10">
              <LayoutDashboard size={48} color="#D1D5DB" strokeWidth={1} />
              <Text className="text-neutral-400 font-medium mt-4">No products listed yet.</Text>
            </View>
          ) : null
        }
        ListFooterComponent={<View className="h-20" />}
      />
    </View>
  );
};

const InputField = ({ icon, ...props }: any) => (
  <View className="flex-row items-center bg-stone-50 rounded-2xl px-4 py-3 mb-4 border border-stone-100">
    <View className="mr-3">{icon}</View>
    <TextInput className="flex-1 text-neutral-900 font-bold" placeholderTextColor="#94A3B8" {...props} />
  </View>
);
