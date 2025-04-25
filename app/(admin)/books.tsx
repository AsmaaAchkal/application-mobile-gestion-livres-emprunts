import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { Card, Text } from 'react-native-paper';
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from "expo-router";

interface Livre {
  id: number;
  titre: string;
  auteur: string;
  datePublication: string;
  description: string;
  categorie: string;
  isbn: string;
  langue: string;
  nbPages: number;
  disponible: boolean;
}

const Books: React.FC = () => {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [livreEnModification, setLivreEnModification] = useState<Livre | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<Livre | null>(null);
  const { token } = useAuth();

  // Charger les livres
  const fetchLivres = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://10.0.2.2:5000/api/livres`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setLivres(data);
    } catch (error) {
      console.error("Erreur lors du chargement des livres :", error);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchLivres();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      fetchLivres();
    }, [])
  );
  
  // Supprimer un livre
  const supprimerLivre = async (id: number) => {
    Alert.alert(
      "Suppression du livre",
       "⚠️ Si vous supprimez ce livre, tous les emprunts associés seront également supprimés. Voulez-vous continuer ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await fetch(`http://10.0.2.2:5000/api/livres/${id}`, {
                method: "DELETE",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });
              setLivres(livres.filter((livre) => livre.id !== id));
            } catch (error) {
              console.error("Erreur lors de la suppression du livre :", error);
            }
          }
        } 
      ]
    );
  };


  // Enregistrer les modifications d un livre
  const modifierLivre = async () => {
    if (!formValues) return;

    try {
      await fetch(`http://10.0.2.2:5000/api/livres/${formValues.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });

      setLivres(livres.map((livre) => (livre.id === formValues.id ? formValues : livre)));
      setLivreEnModification(null);
      Alert.alert("Succès", "Les informations du livre ont été mises à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre :", error);
    }
  };

  // Ajouter un livre
  const ajouterLivre = async () => {
    if (!formValues) return;

    try {
      const response = await fetch(`http://10.0.2.2:5000/api/livres`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formValues),
      });
      const newLivre = await response.json();
      console.log('livre ajouté: ', newLivre)
      // setLivres([...livres, newLivre]);
      fetchLivres();
      setLivreEnModification(null);
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre :", error);
    }
  };

  // affichage du formulaire de modification 
  const afficherFormulaire = (livre: Livre) => {
    setLivreEnModification(livre);
    setFormValues(livre);
  };

  const afficherFormulaireAjout = () => {
    setFormValues({
      id: 0,
      titre: '',
      auteur: '',
      datePublication: '',
      description: '',
      categorie: '',
      isbn: '',
      langue: '',
      nbPages: 0,
      disponible: true
    });
    setLivreEnModification({} as Livre); // juste pour afficher le formulaire
  };
  

  // Fermer le formulaire
  const fermerFormulaire = () => {
    setLivreEnModification(null);
    setFormValues(null);
  };

  // Gérer le changement de valeur dans le formulaire
  const handleChange = (key: keyof Livre, value: string | number | boolean) => {
    if (formValues) {
      setFormValues({ ...formValues, [key]: value });
    }
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fonction pour afficher chaque livre sous forme de carte
  const renderBook = ({ item }: { item: Livre }) => (
    <Card style={styles.card}>
    <Card.Content>
      <Text variant="titleLarge" style={styles.title}>{item.titre} - {item.categorie}</Text>
      <Text variant="bodyMedium" style={styles.author}>{item.auteur}</Text>
      <Text style={styles.date} variant="bodyMedium">{`Publié le : ${formatDate(item.datePublication)}`}</Text>
      <Text variant="bodySmall" style={item.disponible ? styles.available : styles.unavailable}>
        {item.disponible ? 'Disponible' : 'Indisponible'}
      </Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => afficherFormulaire(item)}>
           <AntDesign name="edit" size={20} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => supprimerLivre(item.id)}>
           <MaterialIcons name="delete" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </Card.Content> 
  </Card>
  );

  return (
    <View style={styles.container}>
       {/* Bouton Ajouter un livre */}
       <TouchableOpacity style={styles.addButton} onPress={afficherFormulaireAjout}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.header}>Livres</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
      ) : livres.length === 0 ? (
        <Text style={styles.noBooksText}>Aucun livre disponible.</Text>
      ): (
        <FlatList 
          data={livres} 
          renderItem={renderBook} 
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          contentContainerStyle={styles.list}
        />
      )
    }
      {/* Formulaire de modification */}
      {livreEnModification && (
        <View style={styles.form}>
          <TouchableOpacity onPress={fermerFormulaire} style={styles.backButton}>
            <AntDesign name="close" size={24} color="#1a1a1a" />
          </TouchableOpacity>

          <Text style={styles.formTitle}>
            {formValues && formValues.id !== 0 ? "Modifier le Livre" : "Ajouter un Livre"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Titre"
            value={formValues?.titre}
            onChangeText={(text) => handleChange("titre", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Auteur"
            value={formValues?.auteur}
            onChangeText={(text) => handleChange("auteur", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Date de publication (YYYY-MM-DD)"
            value={formValues?.datePublication}
            onChangeText={(text) => handleChange("datePublication", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={formValues?.description}
            onChangeText={(text) => handleChange("description", text)}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Catégorie"
            value={formValues?.categorie}
            onChangeText={(text) => handleChange("categorie", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="ISBN"
            value={formValues?.isbn}
            onChangeText={(text) => handleChange("isbn", text)}
          />  
          <TextInput
            style={styles.input}
            placeholder="Langue"
            value={formValues?.langue}
            onChangeText={(text) => handleChange("langue", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre de pages"
            value={formValues?.nbPages !== undefined ? formValues?.nbPages.toString() : ''}  // Vérification de la valeur
            onChangeText={(text) => handleChange("nbPages", Number(text))}
          />
          <View style={styles.switchContainer}>
            <Text>Disponible :</Text>
            <TouchableOpacity onPress={() => handleChange("disponible", !formValues?.disponible)}>
                 <AntDesign name={formValues?.disponible ? "checkcircle" : "closecircle"} size={24} color={formValues?.disponible ? "green" : "red"} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={() => {
            if (formValues?.id === 0) {
              ajouterLivre();
            } else {
              modifierLivre();
            }
          }}>
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
  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: '#333',
  },
  author: { 
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
  date: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 8,
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
    position: 'absolute',
    top: 40,
    right: 20, 
    zIndex: 1, 
    backgroundColor: '#1E3A8A', 
    borderRadius: 30, // Rond
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Pour Android
  },
  form: { 
    padding: 20, backgroundColor: "#fff", borderRadius: 8, elevation: 5, marginTop: 20 
  },
  formTitle: { 
    fontSize: 18, fontWeight: "bold", marginBottom: 10 
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

export default Books;
