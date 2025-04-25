import React, { useEffect } from "react";
import { Tabs, router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '@/context/AuthContext';

export default function UserLayout() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
    }
  }, [user]);
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // tabBarStyle: { backgroundColor: '#fff' },
        // tabBarActiveTintColor: '#4CAF50',
        // tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Livres',
          tabBarIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mybooks"
        options={{
          title: 'Mes Emprunts',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="library-books" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <AntDesign name="user" size={size} color={color} />, // Ajout de l'icône
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="bookDetails" options={{ href: null }} />
    </Tabs>
  );
}
