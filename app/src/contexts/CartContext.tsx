"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface CartItem {
  productId: number
  quantity: number
}

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

interface CartProduct extends Product {
  quantity: number
}

interface CartContextType {
  cartItems: CartProduct[]
  addToCart: (product: Product, quantity?: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  getTotalPrice: () => number
  getTotalItems: () => number
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartProduct[]>([])

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cart")
      if (cartData) {
        setCartItems(JSON.parse(cartData))
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    }
  }

  const saveCart = async (items: CartProduct[]) => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  }

  const addToCart = async (product: Product, quantity = 1) => {
    const existingItem = cartItems.find((item) => item.id === product.id)
    let updatedCart: CartProduct[]

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
      )
    } else {
      updatedCart = [...cartItems, { ...product, quantity }]
    }

    setCartItems(updatedCart)
    await saveCart(updatedCart)
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    const updatedCart = cartItems.map((item) => (item.id === productId ? { ...item, quantity } : item))

    setCartItems(updatedCart)
    await saveCart(updatedCart)
  }

  const removeFromCart = async (productId: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId)
    setCartItems(updatedCart)
    await saveCart(updatedCart)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const clearCart = async () => {
    setCartItems([])
    await AsyncStorage.removeItem("cart")
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        getTotalPrice,
        getTotalItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
