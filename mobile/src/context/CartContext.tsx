import React, {
     createContext,
     useContext,
     useState,
     useCallback,
     useMemo,
     ReactNode,
} from 'react';

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
     const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
