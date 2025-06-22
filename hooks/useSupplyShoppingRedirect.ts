// hooks/useSupplyShoppingRedirect.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

interface SupplyItem {
  name: string;
  imageUri?: string;
}

export function useSupplyShoppingRedirect() {
  const router = useRouter();

  const saveSupply = async (supply: SupplyItem) => {
    try {
      const existing = await AsyncStorage.getItem('supplies');
      const supplies: SupplyItem[] = existing ? JSON.parse(existing) : [];
      const updated = [...supplies, supply];
      await AsyncStorage.setItem('supplies', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving supply to AsyncStorage:', error);
    }
  };

  const promptAndRedirect = async (productName: string) => {
    Alert.alert(
      'Buy a Product?',
      'Do you want to buy a specific product?',
      [
        {
          text: 'No',
          onPress: async () => {
            await saveSupply({ name: productName });
            router.push('/shop');
          },
        },
        {
          text: 'Yes',
          onPress: async () => {
            const permission =
              await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
              Alert.alert('Camera permission is required.');
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 0.5,
            });

            if (!result.canceled && result.assets?.length > 0) {
              const imageUri = result.assets[0].uri;
              await saveSupply({ name: productName, imageUri });
              router.push('/shop');
            } else {
              await saveSupply({ name: productName });
              router.push('/shop');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return { promptAndRedirect };
}
