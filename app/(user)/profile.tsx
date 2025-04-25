import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import { useAuth } from '@/context/AuthContext';

export default function Profil() {
  const { user, logout, updateUser } = useAuth(); 

  // État local pour stocker les valeurs modifiées
  const [formData, setFormData] = useState({
    id: user?.id,
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    telephone: user?.telephone || '',
    email: user?.email || '',
  });

  const [loading, setLoading] = useState(false);

  // Fonction pour gérer les changements dans les champs
  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };  

  // Fonction pour sauvegarder les modifications
  const handleSave = async () => {
    try {
      if (!formData.id) {
        alert('❌ L\'identifiant de l\'utilisateur est manquant.');
        return;
      }
      setLoading(true);
      await updateUser(formData); // Met à jour les infos de l'utilisateur via le contexte
      alert('✅ Informations mises à jour avec succès !');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "❌ Erreur lors de la mise à jour";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    logout();
    router.replace("/signin") ;
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Profil</Text>

      <TextInput
        label="Nom"
        value={formData.nom}
        onChangeText={(text) => handleChange('nom', text)}
        style={styles.input}
        left={<TextInput.Icon icon={() => <AntDesign name="user" size={20} color="#555" />} />}
      />

      <TextInput
        label="Prénom"
        value={formData.prenom}
        onChangeText={(text) => handleChange('prenom', text)}
        style={styles.input}
        left={<TextInput.Icon icon={() => <AntDesign name="idcard" size={20} color="#555" />} />}
      />

      <TextInput
        label="Téléphone"
        value={formData.telephone}
        onChangeText={(text) => handleChange('telephone', text)}
        keyboardType="phone-pad"
        style={styles.input}
        left={<TextInput.Icon icon={() => <AntDesign name="phone" size={20} color="#555" />} />}
      />

      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        style={styles.input}
        left={<TextInput.Icon icon={() => <MaterialIcons name="email" size={20} color="#555" />} />}
      />

      <View style={styles.info}>
        <Text variant="titleMedium">Rôle:</Text>
        <Text variant="bodyLarge" style={styles.role}>
          {user?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        style={styles.saveButton}
      >
        Enregistrer
      </Button>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutButtonText}>Se déconnecter</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    marginBottom: 16,
  },
  info: {
    marginBottom: 16,
  },
  role: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#1E3A8A',
  },
  logoutButton: {
    color: '#1E3A8A',
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#1E3A8A',
    fontWeight: 'bold',
    fontSize: 14,
    alignItems: 'center',
  },
});
