import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AppProvider, useApp } from '../contexts/AppContext';
import { UserRole } from '../types';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NavigationWrapper />
      </ThemeProvider>
    </AppProvider>
  );
}

function NavigationWrapper() {
  const { currentUser, authUser, isLoading } = useApp();
  const segments = useSegments();
  const isClient = currentUser.role === UserRole.CLIENT;

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#1E2875" />
      </View>
    );
  }

  // Определяем текущую группу маршрутов
  const inAuthGroup = segments[0] === '(auth)';
  const inClientGroup = segments[0] === '(client)';
  const inDrawerGroup = segments[0] === '(drawer)';

  // Редиректы на основе auth состояния
  if (!authUser && !inAuthGroup) {
    // Не авторизован и не на странице авторизации -> редирект на логин
    return <Redirect href="/(auth)/login" />;
  }

  if (authUser && inAuthGroup) {
    // Авторизован но на странице авторизации -> редирект в приложение
    if (isClient) {
      return <Redirect href="/(client)" />;
    } else {
      return <Redirect href="/(drawer)" />;
    }
  }

  if (authUser && isClient && inDrawerGroup) {
    // Клиент пытается попасть в drawer рекрутера -> редирект в клиентский кабинет
    return <Redirect href="/(client)" />;
  }

  if (authUser && !isClient && inClientGroup) {
    // Рекрутер пытается попасть в клиентский кабинет -> редирект в drawer
    return <Redirect href="/(drawer)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(client)" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
