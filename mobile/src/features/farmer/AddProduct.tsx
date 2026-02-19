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
} from 'react-native';

const API_URL = 'http://192.168.0.101:5000';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantityAvailable: number;
}

export const AddProductScreen = () => {
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
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
      Alert.alert('Error', 'Could not load products from server');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!name.trim() || !category.trim() || !price.trim() || !quantity.trim()) {
      Alert.alert('Missing fields', 'Please fill all fields');
      return;
    }

    const numericPrice = Number(price);
    const numericQty = Number(quantity);

    if (isNaN(numericPrice) || isNaN(numericQty)) {
      Alert.alert('Invalid input', 'Price and quantity must be numbers');
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
          price: numericPrice,
          quantityAvailable: numericQty,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Product added');
        setName('');
        setCategory('');
        setPrice('');
        setQuantity('');
        setProducts((prev) => [data.product, ...prev]);
      } else {
        Alert.alert('Error', data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Failed to add product', error);
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    Alert.alert('Delete product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/products/${id}`, {
              method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok) {
              setProducts((prev) => prev.filter((p) => p.id !== id));
            } else {
              Alert.alert('Error', data.message || 'Failed to delete product');
            }
          } catch (error) {
            console.error('Failed to delete product', error);
            Alert.alert('Error', 'Could not connect to server');
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-stone-50 p-4">
      <Text className="text-2xl font-bold text-stone-800 mb-4">Admin Product Panel</Text>

      <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-stone-100">
        <Text className="text-stone-600 font-semibold mb-2">Add new product</Text>

        <TextInput
          className="bg-stone-50 rounded-xl px-3 py-2 mb-2 border border-stone-200"
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="bg-stone-50 rounded-xl px-3 py-2 mb-2 border border-stone-200"
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          className="bg-stone-50 rounded-xl px-3 py-2 mb-2 border border-stone-200"
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <TextInput
          className="bg-stone-50 rounded-xl px-3 py-2 mb-3 border border-stone-200"
          placeholder="Quantity available"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <TouchableOpacity
          className={`w-full py-3 rounded-xl items-center ${
            isSubmitting ? 'bg-stone-300' : 'bg-emerald-600'
          }`}
          onPress={handleAddProduct}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold">Add Product</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <Text className="text-stone-600 font-semibold mb-2">Existing products</Text>
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchProducts();
                }}
              />
            }
            renderItem={({ item }) => (
              <View className="bg-white p-4 mb-2 rounded-xl flex-row justify-between items-center border border-stone-100">
                <View>
                  <Text className="font-semibold text-stone-800">{item.name}</Text>
                  <Text className="text-sm text-stone-500">{item.category}</Text>
                  <Text className="text-sm text-emerald-700 font-bold">
                    ₹{item.price.toFixed(2)} · {item.quantityAvailable} units
                  </Text>
                </View>
                <TouchableOpacity
                  className="px-3 py-2 rounded-lg bg-red-500"
                  onPress={() => handleDeleteProduct(item.id)}
                >
                  <Text className="text-white font-semibold text-sm">Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};
