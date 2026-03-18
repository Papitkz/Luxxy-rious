import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, type CartData } from '@/lib/firebase';
import type { Product } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export const MAX_CART_ITEMS = 150;

interface CartContextType {
  cart: CartData | null;
  isLoaded: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<{ success: boolean; message: string }>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: (productId: string) => number;
  canAddToCart: (product: Product, quantity?: number) => { canAdd: boolean; reason?: string };
  MAX_CART_ITEMS: number;
  cartTotal: number;
  cartItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Subscribe to cart changes
  useEffect(() => {
    if (!user?.uid) {
      setCart(null);
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    const unsubscribe = cartService.subscribeToCart(user.uid, (cartData) => {
      setCart(cartData);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const cartTotal = cart?.totalPrice || 0;
  const cartItemsCount = cart?.totalItems || 0;

  const addToCart = useCallback(async (product: Product, quantity: number = 1): Promise<{ success: boolean; message: string }> => {
    if (!user?.uid) {
      return { success: false, message: 'Please login to add items to cart' };
    }

    const currentQuantity = cart?.items.find(item => item.productId === product.id)?.quantity || 0;
    const newTotalItems = (cart?.totalItems || 0) + quantity;

    if (newTotalItems > MAX_CART_ITEMS) {
      return { success: false, message: `Cart limit is ${MAX_CART_ITEMS} items` };
    }

    if (currentQuantity + quantity > product.inventory) {
      return { success: false, message: 'Not enough inventory available' };
    }

    try {
      await cartService.addToCart(user.uid, product, quantity);
      return { success: true, message: 'Item added to cart' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to add to cart' };
    }
  }, [user?.uid, cart]);

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!user?.uid) return;
    try {
      await cartService.removeFromCart(user.uid, itemId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  }, [user?.uid]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!user?.uid) return;
    if (quantity < 1) return;

    try {
      await cartService.updateQuantity(user.uid, itemId, quantity);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quantity');
    }
  }, [user?.uid]);

  const clearCart = useCallback(async () => {
    if (!user?.uid) return;
    try {
      await cartService.clearCart(user.uid);
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear cart');
    }
  }, [user?.uid]);

  const getItemCount = useCallback((productId: string) => {
    return cart?.items.find(item => item.productId === productId)?.quantity || 0;
  }, [cart]);

  const canAddToCart = useCallback((product: Product, quantity: number = 1): { canAdd: boolean; reason?: string } => {
    const currentQuantity = cart?.items.find(item => item.productId === product.id)?.quantity || 0;
    const newTotalItems = (cart?.totalItems || 0) + quantity;

    if (newTotalItems > MAX_CART_ITEMS) {
      return { canAdd: false, reason: `Cart limit is ${MAX_CART_ITEMS} items` };
    }

    if (currentQuantity + quantity > product.inventory) {
      return { canAdd: false, reason: 'Not enough inventory available' };
    }

    return { canAdd: true };
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoaded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        canAddToCart,
        MAX_CART_ITEMS,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
