"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { useAuth } from "../context/AuthContext"
import { Ionicons } from "@expo/vector-icons"

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs")
      return
    }

    setIsLoading(true)
    try {
      const success = await login(username, password)
      if (success) {
        navigation.navigate("Products")
      } else {
        Alert.alert("Erreur", "Nom d'utilisateur ou mot de passe incorrect")
      }
    } catch (error) {
      Alert.alert("Erreur", "Erreur de connexion. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="bag" size={32} color="#fff" />
          </View>
          <Text style={styles.logoText}>My StoreFire</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Connexion Administrateur</Text>
          <Text style={styles.subtitle}>Connectez-vous pour gérer l'application</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom d'utilisateur</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre nom d'utilisateur"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Entrez votre mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Se connecter</Text>}
          </TouchableOpacity>

          <View style={styles.testAccount}>
            <Text style={styles.testAccountTitle}>Compte de test :</Text>
            <Text style={styles.testAccountText}>Username: mor_2314</Text>
            <Text style={styles.testAccountText}>Password: 83r5^_</Text>
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.backButtonText}>Retour à l'accueil</Text>
          </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
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
    color: "#1E293B",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  loginButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  testAccount: {
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  testAccountTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  testAccountText: {
    fontSize: 14,
    color: "#64748B",
    fontFamily: "monospace",
  },
  backButton: {
    alignItems: "center",
  },
  backButtonText: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default LoginScreen
