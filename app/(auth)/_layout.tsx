import { Stack } from 'expo-router';

export default function AuthLayout() {
  

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signin" options={{ title: "Se connecter" }} />
      <Stack.Screen name="signup" options={{ title: "S'inscrire" }} />      
    </Stack>
  );
}

