import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import AppHeader from '@/components/AppHeader';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarLabelPosition: 'below-icon',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarLabelPosition: 'below-icon',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="calendar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="forecast"
          options={{
            title: 'Forecast',
            tabBarLabelPosition: 'below-icon',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="calendar.badge.clock" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: 'Shop',
            tabBarLabelPosition: 'below-icon',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="cart" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
