import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { Card, Text } from 'react-native-paper';

import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from "expo-router";

interface Emprunt {
  id: number;
  livreId: number;
  userId: number;
  dateEmprunt: string;
  dateRetour?: string;
  livre: {
    id: string;
    titre: string;
    auteur: string;
    categorie: string;
    datePublication: string;
    description: string;
    isbn: string;
    langue: string;
    nbPages: number;
    disponible: boolean;
  };
  user: {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    role: string;
  };
}

const Emprunts: React.FC = () => {
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();

  // Charger les emprunts
  const fetchEmprunts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://10.0.2.2:5000/api/emprunts`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEmprunts(data);
    } catch (error) {
      console.error("Erreur lors du chargement des emprunts :", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchEmprunts();
  // }, []);
  useFocusEffect(
      useCallback(() => {
        fetchEmprunts();
      }, [])
    );

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fonction pour afficher chaque emprunt sous forme de carte
  const renderEmprunt = ({ item }: { item: Emprunt }) => (
    <View>
      <Card style={styles.card}>
        <Text style={styles.title}>{item.livre.titre} - {item.livre.categorie}</Text>
        <Text style={styles.author}>Auteur: {item.livre.auteur}</Text>
        <Text style={styles.date}>Emprunté le: {formatDate(item.dateEmprunt)}</Text>
        <Text 
            style={[styles.date, !item.dateRetour && styles.missingReturnDate]}>
            Date de retour: {item.dateRetour ? formatDate(item.dateRetour) : "Non retourné"}
        </Text>
        <Text style={styles.date}>Emprunteur: {item.user.nom} {item.user.prenom}</Text>
        <Text style={styles.date}>Email: {item.user.email}</Text>
        <Text variant="bodySmall" style={item.livre.disponible ? styles.available : styles.unavailable}>
            {item.livre.disponible ? 'Disponible' : 'Indisponible'}
        </Text>
      </Card>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Emprunts</Text>

        {loading ? (
              <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
            ) : emprunts.length === 0 ? (
              <Text style={styles.noBooksText}>Aucun emprunt disponible.</Text>
            ) : (
              <FlatList 
              data={emprunts} 
              renderItem={renderEmprunt} 
              keyExtractor={(item) => item.id.toString()} 
              contentContainerStyle={styles.list}
            />
            )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
  },
  card: { 
    backgroundColor: "#fff", 
    marginBottom: 16,
    borderRadius: 12, 
    elevation: 5, 
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
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
  missingReturnDate: {
    color: 'red', 
    fontWeight: 'bold',
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

export default Emprunts;
