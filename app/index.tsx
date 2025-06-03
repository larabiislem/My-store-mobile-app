import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { AuthProvider } from "./src/context/AuthContext"
import { CartProvider } from "./src/context/CartContext"

// Écrans
import HomeScreen from "./src/screens/HomeScreen"
import LoginScreen from "./src/screens/LoginScreen"
import ProductsScreen from "./src/screens/ProductsScreen"
import ProductDetailScreen from "./src/screens/ProductDetailScreen"
import CartScreen from "./src/screens/CartScreen"
import AddProductScreen from "./src/screens/AddProductScreen"
import EditProductScreen from "./src/screens/EditProductScreen"

// Types pour la navigation
export type RootStackParamList = {
  Home: undefined
  Login: undefined
  Products: undefined
  ProductDetail: { id: string }
  Cart: undefined
  AddProduct: undefined
  EditProduct: { id: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
         
            <StatusBar style="auto" />
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#8B5CF6",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: "My StoreFire" }} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Connexion" }} />
              <Stack.Screen name="Products" component={ProductsScreen} options={{ title: "Produits" }} />
              <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{ title: "Détail du produit" }}
              />
              <Stack.Screen name="Cart" component={CartScreen} options={{ title: "Panier" }} />
              <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: "Ajouter un produit" }} />
              <Stack.Screen
                name="EditProduct"
                component={EditProductScreen}
                options={{ title: "Modifier le produit" }}
              />
            </Stack.Navigator>
      
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
