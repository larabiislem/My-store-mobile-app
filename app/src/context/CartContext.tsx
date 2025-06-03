"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Types
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

// Création du contexte
const CartContext = createContext<CartContextType | undefined>(undefined)

// Hook personnalisé pour utiliser le contexte
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider")
  }
  return context
}

// Provider du contexte
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartProduct[]>([])

  // Charger le panier depuis le stockage au démarrage
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await AsyncStorage.getItem("cart")
        if (cartData) {
          setCartItems(JSON.parse(cartData))
        }
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error)
      }
    }

    loadCart()
  }, [])

  // Sauvegarder le panier dans le stockage
  const saveCart = async (items: CartProduct[]) => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier:", error)
    }
  }

  // Ajouter un produit au panier
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

  // Mettre à jour la quantité d'un produit
  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    const updatedCart = cartItems.map((item) => (item.id === productId ? { ...item, quantity } : item))

    setCartItems(updatedCart)
    await saveCart(updatedCart)
  }

  // Supprimer un produit du panier
  const removeFromCart = async (productId: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId)
    setCartItems(updatedCart)
    await saveCart(updatedCart)
  }

  // Calculer le prix total
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Calculer le nombre total d'articles
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Vider le panier
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
