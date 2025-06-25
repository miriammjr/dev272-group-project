// jest.setup.js
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import '@testing-library/jest-native/extend-expect';

process.env.EXPO_PUBLIC_SUPABASE_URL = 'http://localhost';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'fake-key';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('@/utils/supabase');
