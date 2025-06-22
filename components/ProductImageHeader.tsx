import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function ProductImageHeader({ uri }: { uri: string }) {
  if (!uri) return null;

  return (
    <View style={styles.wrapper}>
      <Image source={{ uri }} style={styles.image} resizeMode='cover' />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
});
