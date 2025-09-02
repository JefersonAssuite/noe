import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { NativeBaseProvider } from 'native-base';
import { useEffect, useState } from 'react';
import { auth } from '../services/FirebaseConfig';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
   const inAuthGroup = segments[0] === 'auth';

    if (isAuth === false && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (isAuth === true && inAuthGroup) {
      
    }
  }, [isAuth, segments]);

  if (!loaded || isAuth === null) {
    return null; 
  }

  return (
    <NativeBaseProvider>
      <Stack>
        {/* Tabs (área principal após login) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="auth/registerrole" options={{ headerShown: false }} />
        <Stack.Screen name="auth/cadastrotutor" options={{ headerShown: false }} />
        <Stack.Screen name="auth/cadastrocuidador" options={{ headerShown: false }} />
        <Stack.Screen name="auth/formcuidador" options={{ headerShown: false }} />
        <Stack.Screen name="locais/index" options={{ headerShown: false }} />
        <Stack.Screen name="estabelecimentos/index" options={{ headerShown: false }} />
        <Stack.Screen name="faleconosco/index" options={{ headerShown: false }} />
        <Stack.Screen name="favoritos/index" options={{ headerShown: false }} />
        <Stack.Screen name="profissionais/index" options={{ headerShown: false }} />
        <Stack.Screen name="meus-pets/index" options={{ headerShown: false }} />
        {/* Página de erro padrão */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </NativeBaseProvider>
  );
}