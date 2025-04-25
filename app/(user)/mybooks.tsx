import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useRouter, useFocusEffect} from 'expo-router';
import { useAuth } from '@/context/AuthContext';

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
}


const MyBooks = () => {
  const [empruntsSansDateRetour, setempruntsSansDateRetour] = useState<Emprunt[]>([]);
  const [empruntsAvecDateRetour, setempruntsAvecDateRetour] = useState<Emprunt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token, user } = useAuth();

  const fetchEmprunts = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:5000/api/emprunts/byuser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error('Erreur de récupération des emprunts');
      }

      const data = await response.json();
      
      if (data.empruntsSansDateRetour && data.empruntsAvecDateRetour) {
        setempruntsSansDateRetour(data.empruntsSansDateRetour);
        setempruntsAvecDateRetour(data.empruntsAvecDateRetour);
      } else {
        console.error('Structure de données invalide:', data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des emprunts:', error);
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
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
  const handleReturnBook = async (empruntId: number) => {
    try {
      const dateRetour = new Date(); 

      const response = await fetch(`http://10.0.2.2:5000/api/emprunts/return/${empruntId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ dateRetour }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors du retour du livre');
      }
  
      // Récupérer l'objet de l'emprunt retourné
      const updatedEmprunt = empruntsSansDateRetour.find((e) => e.id === empruntId);
      if (!updatedEmprunt) return; // Sécurité au cas où l'objet est introuvable
  
      const updatedEmpruntWithDate = { ...updatedEmprunt, dateRetour: new Date().toISOString() };
  
      // Mettre à jour les états
      
      fetchEmprunts();
      // setempruntsSansDateRetour((prev) => prev.filter((e) => e.id !== empruntId));
      // setempruntsAvecDateRetour((prev) => [...prev, updatedEmpruntWithDate]);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const renderBook = ({ item }: { item: Emprunt }) => (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.bookTitle}>{item.livre.titre} - {item.livre.categorie}</Text>
          <Text variant="bodyMedium" style={styles.bookAuthor}>{item.livre.auteur}</Text>
          <Text style={styles.date} variant="bodyMedium">{`Emprunté le : ${formatDate(item.dateEmprunt)}`}</Text>
          {item.dateRetour ? (
            <Text style={styles.date} variant="bodyMedium">{`Rendu le : ${formatDate(item.dateRetour)}`}</Text>
          ) : (
            <TouchableOpacity onPress={() => handleReturnBook(item.id)} style={styles.returnButton}>
              <Text style={styles.returnButtonText}>Rendre</Text>
            </TouchableOpacity>
          )}
          <Text variant="bodySmall" style={item.livre.disponible ? styles.available : styles.unavailable}>
            {item.livre.disponible ? 'Disponible' : 'Indisponible'}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  // Ajouter le bloc conditionnel pour afficher un message si aucun livre n'est disponible
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Livres Empruntés</Text>

      {/* Livres sans date de retour */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Livres empruntés non rendus</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
        ) : empruntsSansDateRetour.length === 0 ? (
          <Text style={styles.noBooksText}>Aucun livre emprunté non rendu.</Text>
        ) : (
          <FlatList
            data={empruntsSansDateRetour}
            renderItem={renderBook}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        )}
      </View>

      {/* Livres avec date de retour */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Livres empruntés rendus</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
        ) : empruntsAvecDateRetour.length === 0 ? (
          <Text style={styles.noBooksText}>Aucun livre emprunté rendu.</Text>
        ) : (
          <FlatList
            data={empruntsAvecDateRetour}
            renderItem={renderBook}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#555',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 8,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
  noBooksText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 16,
  },
  list: {
    paddingBottom: 16,
  },
  returnButton: {
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    position: 'absolute',
    top: 90,
    left: 290, 
  },
  returnButtonText: {
    color: 'rgb(0,0,0)',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyBooks;
