import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

const API_URL = 'http://192.168.0.101:5000';

export const DeliveryOrdersScreen = () => {
     const [orders, setOrders] = useState<any[]>([]);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          fetchOrders();
     }, []);

     const fetchOrders = async () => {
          try {
               const response = await fetch(`${API_URL}/orders/delivery`);
               const data = await response.json();
               setOrders(data);
          } catch (error) {
               console.error(error);
               Alert.alert('Error', 'Failed to fetch orders');
          } finally {
               setIsLoading(false);
          }
     };

     const handleAcceptOrder = async (orderId: string) => {
          setIsLoading(true);
          try {
               // Assuming a dummy delivery partner ID for now since we don't have user ID in AuthContext yet
               const dummyPartnerId = '65cb8f8d6e9f1a0012349999';

               const response = await fetch(`${API_URL}/orders/${orderId}/accept`, {
                    method: 'PATCH',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         deliveryPartnerId: dummyPartnerId
                    }),
               });

               const data = await response.json();

               if (response.ok) {
                    Alert.alert('Success', 'You have accepted the order!');
                    // Remove the accepted order from the local list
                    setOrders(prev => prev.filter(order => order._id !== orderId));
               } else {
                    Alert.alert('Error', data.message || 'Failed to accept order');
               }
          } catch (error) {
               console.error(error);
               Alert.alert('Error', 'Could not connect to server');
          } finally {
               setIsLoading(false);
          }
     };

     if (isLoading) {
          return (
               <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
               </View>
          );
     }

     return (
          <View className="flex-1 bg-gray-50 p-4">
               <Text className="text-2xl font-bold text-gray-800 mb-4">Pending Orders</Text>

               {orders.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                         <Text className="text-gray-500 text-lg">No pending orders available.</Text>
                    </View>
               ) : (
                    <FlatList
                         data={orders}
                         keyExtractor={(item) => item._id}
                         renderItem={({ item }) => (
                              <View className="bg-white p-4 mb-4 rounded-xl shadow-sm border border-gray-100">
                                   <View className="flex-row justify-between items-center mb-2">
                                        <Text className="font-bold text-lg text-gray-800">
                                             Order #{item._id.slice(-6).toUpperCase()}
                                        </Text>
                                        <View className="bg-yellow-100 px-2 py-1 rounded">
                                             <Text className="text-yellow-800 text-xs font-bold uppercase">{item.status}</Text>
                                        </View>
                                   </View>

                                   <Text className="text-gray-600 mb-2">
                                        Items: <Text className="font-bold">{item.items.length}</Text>
                                   </Text>
                                   <Text className="text-gray-600 mb-4">
                                        Total: <Text className="font-bold text-green-700">₹{item.totalAmount?.toFixed(2)}</Text>
                                   </Text>

                                   <TouchableOpacity
                                        className="bg-blue-600 py-3 rounded-lg items-center active:bg-blue-700"
                                        onPress={() => handleAcceptOrder(item._id)}
                                   >
                                        <Text className="text-white font-bold">Accept Order</Text>
                                   </TouchableOpacity>
                              </View>
                         )}
                    />
               )}
          </View>
     );
};
