"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cartApi } from "@/lib/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface CartItem {
  food: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  restaurant: any;
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (foodId: string, restaurantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (foodId: string, quantity: number) => Promise<void>;
  removeFromCart: (foodId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    if (!isLoggedIn || !user?.id) {
      setCart({ items: [], totalPrice: 0 });
      setLoading(false);
      return;
    }

    try {
      const res = await cartApi.getByUser(user.id);
      setCart(res.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user?.id, isLoggedIn]);

  const addToCart = async (foodId: string, restaurantId: string, quantity: number = 1) => {
    if (!isLoggedIn || !user?.id) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const res = await cartApi.addItem({ userId: user.id, foodId, quantity, restaurantId });
      setCart(res.data);
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const updateQuantity = async (foodId: string, quantity: number) => {
    if (!user?.id) return;
    try {
      const res = await cartApi.updateQuantity({ userId: user.id, foodId, quantity });
      setCart(res.data);
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (foodId: string) => {
    if (!user?.id) return;
    try {
      const res = await cartApi.removeItem(user.id, foodId);
      setCart(res.data);
      toast.success("Removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!user?.id) return;
    try {
      await cartApi.clear(user.id);
      setCart({ items: [], totalPrice: 0 });
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      refreshCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
