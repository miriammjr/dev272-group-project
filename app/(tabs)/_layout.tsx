import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  console.log(colorScheme);
  return (
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
        name='home'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarLabelPosition: 'below-icon',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='house.fill' color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='management'
        options={{
          title: 'Manage',
          headerShown: false,
          tabBarLabelPosition: 'below-icon',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='square.and.pencil' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='forecast'
        options={{
          title: 'Forecast',
          headerShown: false,
          tabBarLabelPosition: 'below-icon',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='calendar.badge.clock' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='calendar'
        options={{
          title: 'Calendar',
          headerShown: false,
          tabBarLabelPosition: 'below-icon',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='calendar' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='todolist'
        options={{
          title: 'Todo List',
          tabBarLabelPosition: 'below-icon',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='checklist' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='shop'
        options={{
          title: 'Shop',
          headerShown: false,
          tabBarLabelPosition: 'below-icon',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='cart' color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
