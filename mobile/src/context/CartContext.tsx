import React, {
     createContext,
     useContext,
     useState,
     useCallback,
     useMemo,
     ReactNode,
     useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

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
     cartTotal: number;          // pre-computed, not a function call
     cartCount: number;          // total item count badge
     addToCart: (product: Product) => void;
     removeFromCart: (productId: string) => void;
     updateQuantity: (productId: string, quantity: number) => void;
     clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const resolveId = (item: Pick<Product, 'id' | '_id'>) =>
     item.id || item._id || '';

export const CartProvider = ({ children }: { children: ReactNode }) => {
     const { user } = useAuth();
     const [cartItems, setCartItems] = useState<CartItem[]>([]);
     const userId = user?.id || 'guest';
     const CART_STORAGE_KEY = `cart_${userId}`;

     // Load cart on user change (e.g. login/logout or switch)
     useEffect(() => {
          let cancelled = false;
          const loadPersistedCart = async () => {
               try {
                    const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
                    if (!cancelled && stored) {
                         const items = JSON.parse(stored);
                         setCartItems(items);
                    } else if (stored === null) {
                        setCartItems([]); // clean start for new user session
                    }
               } catch { /* silence */ }
          };
          loadPersistedCart();
          return () => { cancelled = true; };
     }, [CART_STORAGE_KEY]);

     // Save cart on every update
     useEffect(() => {
          AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
               .catch(() => { /* silent fail */ });
     }, [cartItems, CART_STORAGE_KEY]);

     const addToCart = useCallback((product: Product) => {
          const itemId = resolveId(product);
          setCartItems(prev => {
               const existing = prev.find(i => resolveId(i) === itemId);
               if (existing) {
                    return prev.map(i =>
                         resolveId(i) === itemId ? { ...i, quantity: i.quantity + 1 } : i
                    );
               }
               return [...prev, { ...product, id: itemId, quantity: 1 }];
          });
     }, []);

     const removeFromCart = useCallback((productId: string) => {
          setCartItems(prev => prev.filter(i => resolveId(i) !== productId));
     }, []);

     const updateQuantity = useCallback((productId: string, quantity: number) => {
          if (quantity <= 0) {
               setCartItems(prev => prev.filter(i => resolveId(i) !== productId));
               return;
          }
          setCartItems(prev =>
               prev.map(i => resolveId(i) === productId ? { ...i, quantity } : i)
          );
     }, []);

     const clearCart = useCallback(() => setCartItems([]), []);

     // Memoized derived values — avoid recomputing on every consumer render
     const cartTotal = useMemo(
          () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
          [cartItems]
     );

     const cartCount = useMemo(
          () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
          [cartItems]
     );

     const value = useMemo<CartContextType>(
          () => ({ cartItems, cartTotal, cartCount, addToCart, removeFromCart, updateQuantity, clearCart }),
          [cartItems, cartTotal, cartCount, addToCart, removeFromCart, updateQuantity, clearCart]
     );

     return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
     const context = useContext(CartContext);
     if (!context) throw new Error('useCart must be used within a CartProvider');
     return context;
};
