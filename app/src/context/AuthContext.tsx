"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Types
interface User {
  username: string
  token: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}

// Provider du contexte
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Charger l'utilisateur depuis le stockage au démarrage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Fonction de connexion
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const userData = { username, token: data.token }

        await AsyncStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        return true
      }
      return false
    } catch (error) {
      console.error("Erreur de connexion:", error)
      return false
    }
  }

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Erreur de déconnexion:", error)
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}
