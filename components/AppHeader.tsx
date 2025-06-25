import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';

export default function AppHeader() {
  const router = useRouter();
  const segments = useSegments();

  const currentPage = segments[segments.length - 1] || 'home';
  const capitalizedPage =
    currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    home: 'home-outline',
    calendar: 'calendar-outline',
    forecast: 'cloud-outline',
    shop: 'cart-outline',
    settings: 'settings-outline',
  };

  const iconName = iconMap[currentPage] || 'apps-outline';

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFFFFF',
      }}
      edges={['top']}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThemedText
            type="title"
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons
              name={iconName}
              size={20}
              color="#374151"
              style={{ marginRight: 6 }}
            />
            Resupply : {capitalizedPage}
          </ThemedText>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/settings')}
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
