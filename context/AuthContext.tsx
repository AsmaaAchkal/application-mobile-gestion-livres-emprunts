import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("auth-token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données d'authentification :", error);
      }
    };

    loadAuthData();
  }, []);

  useEffect(() => {
    const saveAuthData = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem("user");
        }

        if (token) {
          await AsyncStorage.setItem("auth-token", token);
        } else {
          await AsyncStorage.removeItem("auth-token");
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des données d'authentification :", error);
      }
    };

    saveAuthData();
  }, [user, token]);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("auth-token");
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const updateUser = async (updatedData: Partial<User>) => {
    try {
      const response = await fetch(`http://10.0.2.2:5000/api/users/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) throw new Error('Échec de la mise à jour');
  
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };  

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
