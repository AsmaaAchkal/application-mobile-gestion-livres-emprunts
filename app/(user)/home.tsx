import React, { useState, useEffect, useCallback} from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useRouter, useFocusEffect} from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface Book {
  id: string;
  titre: string;
  auteur: string;
  categorie: string;
  datePublication: string;
  disponible: boolean;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { token } = useAuth();
  
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:5000/api/livres/disponibles', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Données reçues de l\'API:', data);
      setBooks(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des livres:', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchBooks();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity 
      onPress={() => router.push({
        pathname: '/bookDetails',
        params: { book: JSON.stringify(item) }
      })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.bookTitle}>{item.titre} - {item.categorie}</Text>
          <Text variant="bodyMedium" style={styles.bookAuthor}>{item.auteur}</Text>
          <Text style={styles.date} variant="bodyMedium">{`Publié le : ${formatDate(item.datePublication)}`}</Text>
          <Text variant="bodySmall" style={item.disponible ? styles.available : styles.unavailable}>
            {item.disponible ? 'Disponible' : 'Indisponible'}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Library Books</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
      ) : books.length === 0 ? (
        <Text style={styles.noBooksText}>Aucun livre disponible.</Text>
      ) : (
        <FlatList
          data={books} 
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

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
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
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
  noBooksText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  list: {
    paddingBottom: 16,
  },
});
