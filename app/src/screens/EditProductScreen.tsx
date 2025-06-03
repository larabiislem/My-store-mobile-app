"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"
import { useAuth } from "../contexts/AuthContext"

type EditProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "EditProduct">
type EditProductScreenRouteProp = RouteProp<RootStackParamList, "EditProduct">

interface Props {
  navigation: EditProductScreenNavigationProp
  route: EditProductScreenRouteProp
}

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

const EditProductScreen: React.FC<Props> = ({ navigation, route }) => {
  const { id } = route.params
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  })
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login")
      return
    }
    fetchProduct()
    fetchCategories()
  }, [id, user, navigation])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`)
      const product: Product = await response.json()

      setFormData({
        title: product.title,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        image: product.image,
      })
    } catch (error) {
      console.error("Error fetching product:", error)
      Alert.alert("Erreur", "Erreur lors du chargement du produit")
    } finally {
      setIsLoadingProduct(false)
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

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.description || !formData.category || !formData.image) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          price: Number.parseFloat(formData.price),
          description: formData.description,
          image: formData.image,
          category: formData.category,
        }),
      })

      if (response.ok) {
        Alert.alert("Succès", "Produit modifié avec succès!", [
          { text: "OK", onPress: () => navigation.navigate("ProductDetail", { id }) },
        ])
      } else {
        Alert.alert("Erreur", "Erreur lors de la modification du produit")
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur de connexion. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (isLoadingProduct) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Chargement du produit...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.title}>Modifier le Produit</Text>
          <Text style={styles.subtitle}>Modifiez les informations du produit</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Titre du produit</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez le titre du produit"
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Prix ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={formData.price}
              onChangeText={(value) => handleInputChange("price", value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Catégorie</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionnez une catégorie" value="" />
                {categories.map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>URL de l'image</Text>
            <TextInput
              style={styles.input}
              placeholder="https://exemple.com/image.jpg"
              value={formData.image}
              onChangeText={(value) => handleInputChange("image", value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Décrivez le produit..."
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Modifier le produit</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate("ProductDetail", { id })}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#8B5CF6",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default EditProductScreen
