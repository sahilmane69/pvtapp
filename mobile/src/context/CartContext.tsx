import React, { createContext, useContext, useState, ReactNode } from 'react';

// Product type inferred from our earlier mock data
interface Product {
     id: string;
     _id?: string;
     name: string;
     category: string;
     price: number;
     quantityAvailable: number;
     image?: string;
     description?: string;
}

export interface CartItem extends Product {
     quantity: number;
}

interface CartContextType {
     cartItems: CartItem[];
     addToCart: (product: Product) => void;
     removeFromCart: (productId: string) => void;
     getCartTotal: () => number;
     clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
     const [cartItems, setCartItems] = useState<CartItem[]>([]);

     const addToCart = (product: Product) => {
          setCartItems((prevItems) => {
               const existingItem = prevItems.find((item) => item.id === product.id);
               if (existingItem) {
                    return prevItems.map((item) =>
                         item.id === product.id
                              ? { ...item, quantity: item.quantity + 1 }
                              : item
                    );
               }
               return [...prevItems, { ...product, quantity: 1 }];
          });
     };

     const removeFromCart = (productId: string) => {
          setCartItems((prevItems) =>
               prevItems.filter((item) => item.id !== productId)
          );
     };

     const getCartTotal = () => {
          return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
     };

     const clearCart = () => {
          setCartItems([]);
     };

     return (
          <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getCartTotal, clearCart }}>
               {children}
          </CartContext.Provider>
     );
};

export const useCart = () => {
     const context = useContext(CartContext);
     if (!context) {
          throw new Error('useCart must be used within a CartProvider');
     }
     return context;
};
