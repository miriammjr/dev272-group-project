import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name='index' />
      <Stack.Screen
        name='Auth'
        options={{
          title: 'Auth',
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack>
  );
}
