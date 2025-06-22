import { generateStoreLinks } from '@/utils/GenerateStoreLink';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🛒 Supply Shopping</Text>

      {loading ? (
        <ActivityIndicator
          size='large'
          color='#555'
          style={{ marginTop: 20 }}
        />
      ) : supplies.length === 0 ? (
        <Text style={styles.emptyText}>No supplies added yet.</Text>
      ) : (
        supplies.map((supply, index) => {
          const storeLinks = generateStoreLinks(supply.name);

          return (
            <View key={index} style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>{supply.name}</Text>
                <TouchableOpacity onPress={() => deleteSupply(index)}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              {supply.imageUri && (
                <Image
                  source={{ uri: supply.imageUri }}
                  style={styles.image}
                  resizeMode='cover'
                />
              )}

              {storeLinks.map(link => (
                <TouchableOpacity
                  key={link.name}
                  onPress={() => Linking.openURL(link.url)}
                  style={styles.linkButton}
                >
                  <Text style={styles.linkText}>Search on {link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  deleteText: {
    fontSize: 20,
    color: '#DC2626',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginVertical: 10,
  },
  linkButton: {
    paddingVertical: 6,
  },
  linkText: {
    color: '#2563EB',
    fontSize: 16,
  },
});
