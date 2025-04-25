import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator} from "react-native";
import { Card, Text } from 'react-native-paper';
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from "expo-router";

interface User {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  newPassword: string;
  role: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userEnModification, setUserEnModification] = useState<User | null>(null);
  const [formValues, setFormValues] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();

  // Charger les users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://10.0.2.2:5000/api/users`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
      console.log(users);
    } catch (error) {
      console.error("Erreur lors du chargement des users :", error);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchUsers();
  // }, []);
  useFocusEffect(
      useCallback(() => {
        fetchUsers();
      }, [])
    );

  // Supprimer un users
  const supprimerUser = async (id: number) => {
    Alert.alert(
      "Suppression d'utilisateur",
      "⚠️ Si vous supprimez cet utilisateur, tous les emprunts associés seront également supprimés. Voulez-vous continuer ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await fetch(`http://10.0.2.2:5000/api/users/${id}`, { 
                method: "DELETE",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });
              setUsers(users.filter((user) => user.id !== id));
            } catch (error) {
              console.error("Erreur lors de la suppression de l'utilisateur :", error);
            }
          }
        }
      ]
    );
  };

  // Enregistrer les modifications d un user
  const modifierUser = async () => {
    if (!formValues) return;

    try {
      await fetch(`http://10.0.2.2:5000/api/users/${formValues.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });

      setUsers(users.map((user) => (user.id === formValues.id ? formValues : user)));
      setUserEnModification(null);

      Alert.alert("Succès", "Les informations de l'utilisateur ont été mises à jour avec succès !");
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du user :", error);
    }
  };

  // affichage du formulaire de modification 
  const afficherFormulaire = (user: User) => {
    setUserEnModification(user);
    setFormValues(user);
  };

  // Fermer le formulaire
  const fermerFormulaire = () => {
    setUserEnModification(null);
    setFormValues(null);
  };

  // Gérer le changement de valeur dans le formulaire
  const handleChange = (key: keyof User, value: string | number | boolean) => {
    if (formValues) {
      setFormValues({ ...formValues, [key]: value });
    }
  };

  // Fonction pour afficher chaque livre sous forme de carte
  const renderBook = ({ item }: { item: User }) => (
    <Card style={styles.card}>
    <Card.Content>
      <Text variant="titleLarge" style={styles.nom}>{item.nom} {item.prenom}</Text>
      <Text variant="bodyMedium" style={styles.infos}>{item.email}</Text>
      <Text variant="bodyMedium" style={styles.infos}>{item.telephone}</Text>
      <Text variant="bodyMedium" style={styles.infos}>{item.role}</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => afficherFormulaire(item)}>
           <AntDesign name="edit" size={20} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => supprimerUser(item.id)}>
           <MaterialIcons name="delete" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </Card.Content>
  </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Utilisateurs </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
      ) : users.length === 0 ? (
        <Text style={styles.noBooksText}>Aucun utilisaeur disponible.</Text>
      ) : (
        <FlatList 
         data={users} 
         renderItem={renderBook} 
         keyExtractor={(item) => item.id.toString()} 
         contentContainerStyle={styles.list}
       />
      )}

      {/* Formulaire de modification */}
      {userEnModification && (
        <View style={styles.form}>

          <TouchableOpacity onPress={fermerFormulaire} style={styles.backButton}>
            <AntDesign name="close" size={24} color="#1a1a1a" />
          </TouchableOpacity>

         <Text style={styles.formTitle}>Modifier l'utilisaeur</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={formValues?.nom}
            onChangeText={(text) => handleChange("nom", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Prenom"
            value={formValues?.prenom}
            onChangeText={(text) => handleChange("prenom", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="email"
            value={formValues?.email}
            onChangeText={(text) => handleChange("email", text)}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="telephone"
            value={formValues?.telephone}
            onChangeText={(text) => handleChange("telephone", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            onChangeText={(text) => handleChange("newPassword", text)}
          />  
          <TextInput
            style={styles.input}
            placeholder="role (ADMIN ou USER)"
            value={formValues?.role}
            onChangeText={(text) => handleChange("role", text)}
          />
          
          <TouchableOpacity style={styles.saveButton} onPress={modifierUser}>
             <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
  },
  card: { 
    backgroundColor: "#fff", 
    marginBottom: 16,
    borderRadius: 12, 
    elevation: 5, 
    borderColor: '#ddd',
    borderWidth: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    },
  nom: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: '#333',
  },
  infos: { 
    fontSize: 14, 
    color: "#777",
    marginTop: 4,
  },
  available: {
    color: 'green',
    marginTop: 8,
    fontWeight: 'bold',
  },
  unavailable: {
    color: 'red',
    marginTop: 8,
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 16,
  },
  iconContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    bottom: 106,
    left: 145
  },
  addButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    marginLeft: 8 
  },
  addButton: { 
    backgroundColor: "#4CAF50", 
    padding: 8, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 20, 
    flexDirection: "row", 
    justifyContent: "center" },

  form: { 
    padding: 20, 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    elevation: 5, 
    marginTop: 20 
  },
  formTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8, fontSize: 16 },

  saveButton: { backgroundColor: "#1E3A8A", padding: 10, borderRadius: 5, alignItems: "center" },

  saveButtonText: { color: "#fff", fontWeight: "bold" },
  
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 23,
    left: 315,
    zIndex: 1,  
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBooksText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
});

export default Users;
