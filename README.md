# My Store Mobile App

Bienvenue dans le dépôt **My-store-mobile-app** !  
Ce dépôt contient le code source de l’application mobile pour la gestion d'une boutique en ligne moderne et intuitive, intégrant l’API publique [FakeStoreAPI](https://fakestoreapi.com/).  
Vous trouverez ici toutes les ressources nécessaires pour installer, configurer, exécuter et comprendre les choix techniques ainsi que les processus de développement du projet.

---

## 🚀 Fonctionnalités principales

- **Authentification & Gestion des utilisateurs**
  - Inscription, connexion, déconnexion (stockage local ou via l’API si disponible)
  - Modification du profil utilisateur
- **Catalogue de produits (via [FakeStoreAPI](https://fakestoreapi.com/))**
  - Liste, recherche et filtrage des produits
  - Visualisation détaillée d’un produit
- **Panier d’achats**
  - Ajout/suppression de produits
  - Mise à jour des quantités
- **Système de commande**
  - Passation de commande
  - Suivi du statut de commande (stockage local ou via l’API)
- **Notifications**
  - Alertes pour les promotions/nouveaux produits (si implémenté)
  - Notifications de confirmation de commande (locales)
- **Gestion administrative (si activée côté client)**
  - Ajout, modification, suppression de produits (simulation côté client)
- **Compatibilité multi-plateforme**
  - Application mobile (Android/iOS) développée avec React Native

---

## 🛠️ Prérequis

- [Node.js](https://nodejs.org/) (version recommandée : 18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup) (pour la version mobile)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (si Expo est utilisé)
- [Android Studio](https://developer.android.com/studio) ou [Xcode](https://developer.apple.com/xcode/) (pour l'émulation mobile)

---

## ⚙️ Installation et configuration

### 1. Cloner le dépôt

```bash
git clone https://github.com/larabiislem/My-store-mobile-app.git
cd My-store-mobile-app
```

### 2. Configuration des variables d’environnement

Créez un fichier `.env` à la racine du projet si vous souhaitez définir des URLs spécifiques pour l’API ou gérer des clés (facultatif).  
Exemple :
```env
API_URL=https://fakestoreapi.com
```

### 3. Installation des dépendances

```bash
npm install
# ou
yarn install
```

### 4. Lancement de l’application mobile

- Avec Expo :
  ```bash
  expo start
  ```
- Avec React Native CLI :
  ```bash
  npx react-native run-android
  # ou
  npx react-native run-ios
  ```

---

## 📝 Choix techniques & processus de développement

### Stack technique

- **Frontend Mobile** : React Native (compatibilité Android/iOS)
- **API Produits** : [FakeStoreAPI](https://fakestoreapi.com/)  
  → Tous les produits, catégories et informations sont issus de cette API publique.
- **Gestion d’état** : Redux, Context API ou autres selon le besoin
- **Authentification** : Stockage local (AsyncStorage) ou via les endpoints de FakeStoreAPI si disponible

### Processus de développement

1. **Modélisation & conception** :  
   Analyse des besoins, définition des user stories, création des wireframes.
2. **Développement itératif** :  
   Approche agile, intégration continue via GitHub Actions, tests unitaires et d’intégration.
3. **Revue de code** :  
   Pull requests systématiques, revues de code collaboratives.
4. **Déploiement** :  
   Utilisation de TestFlight/Google Play pour la distribution mobile.
5. **Documentation & support** :  
   Documentation maintenue dans le dépôt, guides d'utilisation et de contribution.

### 🔗 Intégration de FakeStoreAPI

- **Documentation de l’API** : [https://fakestoreapi.com/docs](https://fakestoreapi.com/docs)
- Les appels API sont réalisés via `fetch` ou un client HTTP (axios, etc.).
- Les endpoints utilisés :
  - `/products` : liste des produits
  - `/products/{id}` : détails d’un produit
  - `/carts` : gestion du panier (si utilisé)
  - `/users` : gestion des utilisateurs (si utilisé)
- Les données sensibles (ex : commandes) peuvent être simulées côté client si l’API ne les gère pas.

---

## 🤝 Contribuer

Les contributions sont les bienvenues !  
Merci de lire le fichier [CONTRIBUTING.md](CONTRIBUTING.md) pour connaître le processus de contribution.

---





---
