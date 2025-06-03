import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { useCart } from "../context/CartContext"
import { Ionicons } from "@expo/vector-icons"

type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Cart">

const CartScreen = () => {
  const navigation = useNavigation<CartScreenNavigationProp>()
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart()

  const handleQuantityChange = (productId: number, change: number) => {
    const item = cartItems.find((item) => item.id === productId)
    if (item) {
      const newQuantity = item.quantity + change
      if (newQuantity > 0) {
        updateQuantity(productId, newQuantity)
      }
    }
  }

  const handleRemoveItem = (productId: number) => {
    Alert.alert("Supprimer l'article", "Êtes-vous sûr de vouloir supprimer cet article du panier ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => removeFromCart(productId) },
    ])
  }

  const handleCheckout = () => {
    Alert.alert("Commande confirmée", `Total: $${getTotalPrice().toFixed(2)}\n\nMerci pour votre commande !`, [
      {
        text: "OK",
        onPress: () => {
          clearCart()
          navigation.navigate("Products")
        },
      },
    ])
  }

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(item.id, -1)}>
          <Ionicons name="remove" size={20} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(item.id, 1)}>
          <Ionicons name="add" size={20} color="#8B5CF6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id)}>
          <Ionicons name="trash" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  )

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart" size={80} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptySubtitle}>Découvrez nos produits et ajoutez-les à votre panier</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate("Products")}>
            <Text style={styles.shopButtonText}>Voir les produits</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <View style={styles.itemCount}>
          <Text style={styles.itemCountText}>
            {getTotalItems()} article{getTotalItems() > 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sous-total</Text>
          <Text style={styles.summaryValue}>${getTotalPrice().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Livraison</Text>
          <Text style={styles.summaryValue}>Gratuite</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${getTotalPrice().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Procéder au paiement</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  itemCount: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  itemCountText: {
    fontSize: 14,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: "contain",
    backgroundColor: "#F8FAFC",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
    lineHeight: 22,
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
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  quantityControls: {
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  shopButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  summary: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#64748B",
  },
  summaryValue: {
    fontSize: 16,
    color: "#1E293B",
  },
  separator: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  checkoutButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
})

export default CartScreen

