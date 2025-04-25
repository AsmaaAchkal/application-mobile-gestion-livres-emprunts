import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace(user.role === "ADMIN" ? "/books" : "/home");
    }
  }, [user]);

  const handleSignIn = async () => { 
    setErrorMessage("");
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Échec de la connexion.");
      }

      const { user, token } = data;

      login(user, token); 
      console.log("token:", token)
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
       <Text variant="headlineMedium" style={styles.title}>Bienvenue à la Bibliothèque</Text>
       <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

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
         onPress={handleSignIn} 
         loading={isLoading} 
         disabled={isLoading} 
         style={styles.button}
         labelStyle={styles.buttonText}
      >
        Se connecter
      </Button>

      <Button 
         mode="text" 
         onPress={() => router.push("/signup")} 
         style={styles.link}
         labelStyle={styles.linkText}
      >
        
        <AntDesign name="adduser" size={18} color="#1E3A8A" /> Créer un compte
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#F4F7FA", // Fond clair et doux
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
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
    backgroundColor: '#1E3A8A',
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
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(254, 215, 215, 0.8)',
    padding: 8,
    borderRadius: 4,
    overflow: 'hidden',
    fontWeight: "bold",
  },
});