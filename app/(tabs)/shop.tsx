import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { generateStoreLinks } from '@/utils/GenerateStoreLink';
import { styles as sharedStyles } from '@/styles/styles';

interface Supply {
  name: string;
  imageUri?: string;
}

export default function ShopScreen() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSupplies = async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem('supplies');
      setSupplies(data ? JSON.parse(data) : []);
    } catch (error) {
      console.error('Failed to load supplies from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSupply = async (index: number) => {
    Alert.alert('Delete Supply', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedSupplies = [...supplies];
            updatedSupplies.splice(index, 1);
            await AsyncStorage.setItem(
              'supplies',
              JSON.stringify(updatedSupplies),
            );
            setSupplies(updatedSupplies);
          } catch (error) {
            console.error('Failed to delete supply:', error);
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      loadSupplies();
    }, []),
  );

  return (
    <ScrollView
      style={Platform.OS === 'web' ? sharedStyles.scrollContainer : undefined}
      contentContainerStyle={
        Platform.OS === 'web' ? sharedStyles.scrollContent : undefined
      }
    >
      <View style={sharedStyles.section}>
        {loading ? (
          <ActivityIndicator
            size='large'
            color='#555'
            style={{ marginTop: 20 }}
          />
        ) : supplies.length === 0 ? (
          <Text style={sharedStyles.shopEmptyText}>No supplies added yet.</Text>
        ) : (
          supplies.map((supply, index) => {
            const storeLinks = generateStoreLinks(supply.name);

            return (
              <View key={index} style={sharedStyles.shopCard}>
                <View style={sharedStyles.headerRow}>
                  <Text style={sharedStyles.title}>{supply.name}</Text>
                  <TouchableOpacity onPress={() => deleteSupply(index)}>
                    <Text style={sharedStyles.deleteText}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                {supply.imageUri && (
                  <Image
                    source={{ uri: supply.imageUri }}
                    style={sharedStyles.image}
                    resizeMode='cover'
                  />
                )}

                {storeLinks.map(link => (
                  <TouchableOpacity
                    key={link.name}
                    onPress={() => Linking.openURL(link.url)}
                    style={sharedStyles.linkButton}
                  >
                    <Text style={sharedStyles.linkText}>
                      Search on {link.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
