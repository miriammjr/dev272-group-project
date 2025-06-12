import React, { useEffect, useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Supply {
  id: string;
  name: string;
  storeLinks: { name: string; url: string; price: number }[];
}

const mockSupplies: Supply[] = [
  {
    id: 'supply-1',
    name: 'Toilet Paper',
    storeLinks: [
      { name: 'Amazon', url: 'https://amazon.com', price: 8.99 },
      { name: 'Walmart', url: 'https://walmart.com', price: 7.49 },
    ],
  },
  {
    id: 'supply-2',
    name: 'Dish Soap',
    storeLinks: [
      { name: 'Target', url: 'https://target.com', price: 3.99 },
      { name: 'Amazon', url: 'https://amazon.com', price: 4.29 },
    ],
  },
];

export default function ShopScreen() {
  const [supplies, setSupplies] = useState<Supply[]>([]);

  useEffect(() => {
    // This should ideally load real data
    setSupplies(mockSupplies);
  }, []);

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        🛒 Supply Shopping
      </Text>

      {supplies.map(supply => (
        <View key={supply.id} style={styles.card}>
          <Text style={styles.title}>{supply.name}</Text>
          {supply.storeLinks.map(link => (
            <TouchableOpacity
              key={link.name}
              onPress={() => Linking.openURL(link.url)}
              style={styles.storeLink}
            >
              <Text>
                {link.name} - ${link.price.toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  storeLink: {
    paddingVertical: 4,
  },
});
