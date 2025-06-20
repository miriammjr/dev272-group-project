// components/AppHeader.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useRouter } from 'expo-router';

export default function AppHeader() {
  const router = useRouter();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
      <ThemedText type="title">🏡 Resupply</ThemedText>
      <TouchableOpacity onPress={() => router.push('/settings')} accessibilityLabel="Settings">
        <Ionicons name="settings-outline" size={24} color="#374151" />
      </TouchableOpacity>
    </View>
  );
}
