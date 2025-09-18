import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  

  return (
    <Tabs
       screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
         }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color,focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={28}  color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
