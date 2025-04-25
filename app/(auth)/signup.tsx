import React, { useState } from 'react';
import { View, StyleSheet  } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Link, router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setErrorMessage('');
    if (!prenom || !nom || !email || !password) {
      setErrorMessage('Tous les champs sont requis.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, prenom, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Échec de l'inscription.");
      }

      // 🔹 Redirection après succès
      router.push('/signin');
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Bienvenue à la Bibliothèque</Text>
      <Text style={styles.subtitle}>Créez votre compte lecteur</Text>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TextInput
        label="Prénom"
        value={prenom}
        onChangeText={setPrenom}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} color="#1E3A8A" />} />}
      />

      <TextInput
        label="Nom"
        value={nom}
        onChangeText={setNom}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon={() => <MaterialIcons name="badge" size={20} color="#1E3A8A" />} />}
      />
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        left={<TextInput.Icon icon={() => <MaterialIcons name="email" size={20} color="#1E3A8A" />} />}
      />
      
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        left={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={20} color="#1E3A8A" />} />}
      />
      
      <Button
        mode="contained"
        onPress={handleRegister}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        S'inscrire
      </Button>

      <Button 
         mode="text" 
         onPress={() => router.push("/signin")} 
         style={styles.link}
         labelStyle={styles.linkText}
      >
        
        <AntDesign name="login" size={18} color="#1E3A8A" /> Déjà un compte ? Se connecter
      </Button>
      
      {/* <Link href="/signin" asChild>
        <Button mode="text" style={styles.link}>
        <AntDesign name="login" size={18} color="#1E3A8A" /> Déjà un compte ? Se connecter
        </Button>
      </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#F4F7FA", // Fond doux
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    color: '#4A5568',
    fontStyle: 'italic',
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
    backgroundColor: "#1E3A8A", // Bleu moderne
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    color: "#D32F2F", // Rouge plus doux
    textAlign: "center",
    marginBottom: 16,
    backgroundColor: 'rgba(254, 215, 215, 0.8)',
    padding: 8,
    borderRadius: 4,
    overflow: 'hidden',
    fontWeight: "bold",
  },
});

