"use client"

import { useState, useEffect } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { Ionicons } from "@expo/vector-icons"

type ProductDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "ProductDetail">
type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, "ProductDetail">

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

const ProductDetailScreen = () => {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>()
  const route = useRoute<ProductDetailScreenRouteProp>()
  const { id } = route.params
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { user } = useAuth()
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error("Error fetching product:", error)
      Alert.alert("Erreur", "Impossible de charger le produit")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)
    try {
      await addToCart(product)
      Alert.alert("Succès", "Produit ajouté au panier", [
        { text: "Continuer", style: "default" },
        { text: "Voir le panier", onPress: () => navigation.navigate("Cart") },
      ])
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter le produit au panier")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleDelete = () => {
    Alert.alert("Confirmer la suppression", "Êtes-vous sûr de vouloir supprimer ce produit ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
              method: "DELETE",
            })
            if (response.ok) {
              Alert.alert("Succès", "Produit supprimé avec succès")
              navigation.navigate("Products")
            }
          } catch (error) {
            Alert.alert("Erreur", "Impossible de supprimer le produit")
          }
        },
      },
    ])
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Chargement du produit...</Text>
      </View>
    )
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Produit non trouvé</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>

          <Text style={styles.productTitle}>{product.title}</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name="star"
                  size={20}
                  color={i < Math.floor(product.rating.rate) ? "#FCD34D" : "#E5E7EB"}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating.rate} ({product.rating.count} avis)
            </Text>
          </View>

          <Text style={styles.productPrice}>${product.price}</Text>

          <View style={styles.separator} />

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          <View style={styles.separator} />

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.addToCartButton, isAddingToCart && styles.buttonDisabled]}
              onPress={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="cart" size={24} color="#fff" />
                  <Text style={styles.addToCartText}>Ajouter au Panier</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color="#8B5CF6" />
              <Text style={styles.favoriteText}>Favoris</Text>
            </TouchableOpacity>
          </View>

          {/* Admin Actions */}
          {user && (
            <View style={styles.adminActions}>
              <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProduct", { id })}>
                <Ionicons name="create-outline" size={20} color="#8B5CF6" />
                <Text style={styles.editButtonText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Product Details */}
          <View style={styles.productDetails}>
            <Text style={styles.detailsTitle}>Informations Produit</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Catégorie:</Text>
              <Text style={styles.detailValue}>{product.category}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Note:</Text>
              <Text style={styles.detailValue}>{product.rating.rate}/5</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nombre d'avis:</Text>
              <Text style={styles.detailValue}>{product.rating.count}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  errorText: {
    fontSize: 18,
    color: "#64748B",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    backgroundColor: "#fff",
    padding: 20,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  productInfo: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 8,
  },
  categoryBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
    lineHeight: 32,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#64748B",
  },
  productPrice: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B5CF6",
    marginBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 24,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  favoriteButton: {
    borderWidth: 1,
    borderColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  favoriteText: {
    color: "#8B5CF6",
    fontSize: 18,
    fontWeight: "600",
  },
  adminActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  productDetails: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: "#64748B",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
})

export default ProductDetailScreen
