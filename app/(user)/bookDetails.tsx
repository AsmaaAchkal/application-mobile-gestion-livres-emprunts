
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface Book {
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
}

export default function BookDetails() {
  const params = useLocalSearchParams<{ book: string }>();
  const book: Book = JSON.parse(params.book);
  const router = useRouter(); // Hook pour la navigation
  const { user, token } = useAuth();

  // Fonction pour formater la date en YYYY-MM-DD
  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  // Fonction pour emprunter le livre
  const handleBorrow = async () => {
    if (user) {
      try {
        const response = await fetch('http://10.0.2.2:5000/api/emprunts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            livreId: book.id,
          }),
        });

        if (response.ok) {
          alert('Emprunt effectué avec succès!');
          router.push('/home');
        } else {
          alert('Échec de l\'emprunt. Veuillez réessayer.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'emprunt:', error);
      }
    } else {
      alert('Veuillez vous connecter pour emprunter un livre.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesign name="close" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.title}>{book.titre}</Text>
          <Text style={styles.author}>par {book.auteur}</Text>

          <View style={[styles.statusBadge, book.disponible ? styles.availableBadge : styles.unavailableBadge]}>
            <Text style={[styles.statusText, book.disponible ? styles.availableText : styles.unavailableText]}>
              {book.disponible ? 'Disponible' : 'Indisponible'}
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <MaterialIcons name="category" size={20} color="#666" />
            <Text style={styles.infoLabel}>Catégorie</Text>
            <Text style={styles.infoValue}>{book.categorie}</Text>
          </View>

          <View style={styles.infoItem}>
            <MaterialIcons name="language" size={20} color="#666" />
            <Text style={styles.infoLabel}>Langue</Text>
            <Text style={styles.infoValue}>{book.langue}</Text>
          </View>

          <View style={styles.infoItem}>
            <AntDesign name="book" size={20} color="#666" />
            <Text style={styles.infoLabel}>Pages</Text>
            <Text style={styles.infoValue}>{book.nbPages}</Text>
          </View>

          <View style={styles.infoItem}>
            <AntDesign name="copyright" size={20} color="#666" />
            <Text style={styles.infoLabel}>ISBN</Text>
            <Text style={styles.infoValue}>{book.isbn}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date de publication</Text>
          <View style={styles.dateContainer}>
            <MaterialIcons name="access-time" size={20} color="#666" />
            <Text style={styles.dateText}>Le {formatDate(book.datePublication)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{book.description}</Text>
        </View>

        <TouchableOpacity style={styles.borrowButton} onPress={handleBorrow} disabled={!book.disponible}>
          <Text style={styles.borrowButtonText}>
            {book.disponible ? 'Emprunter ce livre' : 'Livre non disponible'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 330,
    zIndex: 1,  
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 12,
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 8,
  },
  availableBadge: {
    backgroundColor: '#e8f5e9',
  },
  unavailableBadge: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  availableText: {
    color: '#2e7d32',
  },
  unavailableText: {
    color: '#c62828',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  borrowButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  borrowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  
});
