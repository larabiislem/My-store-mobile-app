"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { Ionicons } from "@expo/vector-icons"

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const { user } = useAuth()
  const { getTotalItems } = useCart()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="bag" size={24} color="#fff" />
            </View>
            <Text style={styles.logoText}>My StoreFire</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
              <Ionicons name="cart" size={24} color="#8B5CF6" />
              {getTotalItems() > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{getTotalItems()}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Image source={{ uri: "https://via.placeholder.com/400x200?text=My+StoreFire" }} style={styles.heroImage} />
          <Text style={styles.heroTitle}>Bienvenue sur My StoreFire</Text>
          <Text style={styles.heroSubtitle}>
            Découvrez notre collection exceptionnelle de produits avec une expérience d'achat mobile intuitive.
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Products")}>
              <Text style={styles.primaryButtonText}>Voir les Produits</Text>
            </TouchableOpacity>
            {!user && (
              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.secondaryButtonText}>Se Connecter</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.sectionTitle}>Nos fonctionnalités</Text>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="cube" size={32} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>Gestion des Produits</Text>
            <Text style={styles.featureDescription}>
              Ajoutez, modifiez et supprimez des produits facilement avec notre interface intuitive.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={32} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>Authentification Sécurisée</Text>
            <Text style={styles.featureDescription}>
              Système d'authentification robuste pour protéger vos données et gérer les autorisations.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="trending-up" size={32} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>Performance Optimisée</Text>
            <Text style={styles.featureDescription}>
              Application rapide et responsive avec des temps de chargement optimisés.
            </Text>
          </View>
        </View>

        {/* User Section */}
        {user && (
          <View style={styles.userSection}>
            <Text style={styles.welcomeText}>Bonjour, {user.username}!</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Products")}>
              <Text style={styles.primaryButtonText}>Gérer les Produits</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
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
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
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
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B5CF6",
    textAlign: "center",
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  heroButtons: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#8B5CF6",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "600",
  },
  features: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  featureIcon: {
    width: 64,
    height: 64,
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  userSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    marginTop: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 16,
  },
})

export default HomeScreen
