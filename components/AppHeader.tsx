// components/AppHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

export default function AppHeader() {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <ThemedText type='title'>🏡 Resupply</ThemedText>
      <TouchableOpacity
        onPress={() => router.push('/settings')}
        accessibilityLabel='Settings'
      >
        <Ionicons name='settings-outline' size={24} color='#374151' />
      </TouchableOpacity>
    </View>
  );
}
