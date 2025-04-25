# application-mobile-gestion-livres-emprunts

Application Mobile de Gestion des Livres et des Emprunts avec une API REST

Ce projet consiste à créer une application destinée à la **gestion des emprunts de livres** au sein de structures éducatives ou associatives. Il comporte deux interfaces : une pour les **utilisateurs (lecteurs)** et une pour les **administrateurs**.

---

## Fonctionnalités

### Pour l’utilisateur (Lecteur)

- Inscription et connexion sécurisées via JWT
- Consultation des livres disponibles
- Visualisation des détails d’un livre
- Emprunt d’un livre
- Historique des emprunts (livres rendus et non rendus)
- Retour d’un livre
- Consultation du profil
- Déconnexion

### Pour l’administrateur

- Connexion sécurisée
- Gestion complète des livres :
  - Ajouter un nouveau livre
  - Modifier les informations d’un livre
  - Supprimer un livre
  - Visualiser la liste des livres avec leur statut (disponible ou emprunté)
- Gestion des emprunts :
  - Consulter tous les livres empruntés
  - Suivre les livres rendus et non rendus
- Gestion des utilisateurs :
  - Modifier un utilisateur existant
  - Supprimer un utilisateur
  - Visualiser la liste des utilisateurs
- Consultation du profil administrateur
- Déconnexion

---

## Technologies utilisées

- **Backend** :
  - Express.js
  - Prisma ORM
  - JSON Web Token (JWT)
- **Frontend mobile** :
  - React Native
  - Expo

---

##  Comment l'utiliser

### 1. Cloner le dépôt
  ```bash
     git clone https://github.com/AsmaaAchkal/application-mobile-gestion-livres-emprunts.git
     cd library
  ```
### 2.Créer la base de données
   Créer une base de données .
   Assure-toi que le fichier .env contient une URL correcte pour ta base de données (PostgreSQL, MySQL, SQLite, etc.).

### 3. Lancer le Frontend (React Native avec Expo)
  ```bash
      cd libraryapp
      npm install
      npx expo start
  ```

### 4. Lancer le Backend (Express + Prisma)
  ```bash
     cd backend
     npm install
     npx prisma generate
     npx prisma migrate dev --name init
     node seed.js
     cd src
     node server.js
```
