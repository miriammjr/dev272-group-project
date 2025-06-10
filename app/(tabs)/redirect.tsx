import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const redirect = () => {
  return (
    <View style={styles.container}>
      <Text>redirect</Text>
    </View>
  );
};

export default redirect;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
});
