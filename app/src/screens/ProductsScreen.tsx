"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"

type ProductsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Products">

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

const ProductsScreen = () => {
  const navigation = useNavigation<ProductsScreenNavigationProp>()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      Alert.alert("Erreur", "Impossible de charger les produits")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  const deleteProduct = async (id: number) => {
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
              setProducts(products.filter((product) => product.id !== id))
              Alert.alert("Succès", "Produit supprimé avec succès")
            }
          } catch (error) {
            console.error("Error deleting product:", error)
            Alert.alert("Erreur", "Impossible de supprimer le produit")
          }
        },
      },
    ])
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail", { id: item.id.toString() })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FCD34D" />
          <Text style={styles.ratingText}>
            {item.rating.rate} ({item.rating.count})
          </Text>
        </View>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>

      {user && (
        <View style={styles.productActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProduct", { id: item.id.toString() })}
          >
            <Ionicons name="create-outline" size={20} color="#8B5CF6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProduct(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Chargement des produits...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produits</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="cart" size={24} color="#8B5CF6" />
            {getTotalItems() > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
          {user && (
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddProduct")}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedCategory} onValueChange={setSelectedCategory} style={styles.picker}>
            <Picker.Item label="Toutes les catégories" value="all" />
            {categories.map((category) => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>
        </View>
      </View>

      {/* User Info */}
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Bonjour, {user.username}</Text>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun produit trouvé</Text>
          </View>
        }
      />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartButton: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  picker: {
    height: 50,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#EEF2FF",
  },
  welcomeText: {
    fontSize: 16,
    color: "#1E293B",
  },
  logoutText: {
    fontSize: 16,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  productsList: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
  productInfo: {
    padding: 12,
  },
  categoryBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  productActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
  },
})

export default ProductsScreen
