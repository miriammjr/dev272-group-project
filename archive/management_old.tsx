import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type TaskItem = {
  id: string;
  name: string;
  frequency: number;
  createdAt: number;
  lastCompletedAt?: number | null;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const TaskSupplyManagementScreen = () => {
  const [chores, setChores] = useState<TaskItem[]>([]);
  const [supplies, setSupplies] = useState<TaskItem[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState<TaskItem | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemFrequency, setItemFrequency] = useState('');

  const openModal = (type: string, item: TaskItem | null = null) => {
    setModalType(type);
    if (item) {
      setCurrentItem(item);
      setItemName(item.name);
      setItemFrequency(item.frequency.toString());
    } else {
      setCurrentItem(null);
      setItemName('');
      setItemFrequency('');
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setItemName('');
    setItemFrequency('');
    setCurrentItem(null);
  };

  const validateInput = () => {
    if (!itemName.trim()) {
      Alert.alert('Validation Error', 'Item name cannot be empty.');
      return false;
    }
    if (
      !itemFrequency.trim() ||
      isNaN(Number(itemFrequency)) ||
      Number(itemFrequency) <= 0
    ) {
      Alert.alert('Validation Error', 'Frequency must be a positive number.');
      return false;
    }
    return true;
  };

  const handleSaveItem = () => {
    if (!validateInput()) return;
    const frequency = parseInt(itemFrequency, 10);

    if (modalType === 'addChore') {
      const newChore: TaskItem = {
        id: generateId(),
        name: itemName,
        frequency,
        createdAt: Date.now(),
        lastCompletedAt: null,
      };
      setChores(prev => [...prev, newChore]);
    } else if (modalType === 'editChore' && currentItem) {
      setChores(prev =>
        prev.map(chore =>
          chore.id === currentItem.id
            ? { ...chore, name: itemName, frequency }
            : chore,
        ),
      );
    } else if (modalType === 'addSupply') {
      const newSupply: TaskItem = {
        id: generateId(),
        name: itemName,
        frequency,
        createdAt: Date.now(),
        lastCompletedAt: null,
      };
      setSupplies(prev => [...prev, newSupply]);
    } else if (modalType === 'editSupply' && currentItem) {
      setSupplies(prev =>
        prev.map(supply =>
          supply.id === currentItem.id
            ? { ...supply, name: itemName, frequency }
            : supply,
        ),
      );
    }

    closeModal();
  };

  const removeItem = (id: string, type: 'chore' | 'supply') => {
    Alert.alert(
      `Remove ${type === 'chore' ? 'Chore' : 'Supply'}`,
      `Are you sure you want to remove this ${type}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (type === 'chore') {
              setChores(prev => prev.filter(chore => chore.id !== id));
            } else {
              setSupplies(prev => prev.filter(supply => supply.id !== id));
            }
          },
        },
      ],
    );
  };
  useEffect(() => {
    AsyncStorage.setItem('chores', JSON.stringify(chores));
  }, [chores]);

  useEffect(() => {
    AsyncStorage.setItem('supplies', JSON.stringify(supplies));
  }, [supplies]);

  const renderItem = (
    { item }: { item: TaskItem },
    type: 'chore' | 'supply',
  ) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemFrequency}>
          Frequency: Every {item.frequency} day{item.frequency > 1 ? 's' : ''}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          onPress={() =>
            openModal(type === 'chore' ? 'editChore' : 'editSupply', item)
          }
          style={styles.actionButton}
        >
          <Ionicons name='pencil-outline' size={22} color='#007AFF' />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => removeItem(item.id, type)}
          style={styles.actionButton}
        >
          <Ionicons name='trash-outline' size={22} color='#FF3B30' />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* chores section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Household Chores</Text>
          <Button title='Add Chore' onPress={() => openModal('addChore')} />
        </View>
        {chores.length === 0 ? (
          <Text style={styles.emptyListText}>
            No chores added yet. Add some to get started!
          </Text>
        ) : (
          <FlatList
            data={chores}
            renderItem={props => renderItem(props, 'chore')}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* supplies section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Household Supplies</Text>
          <Button title='Add Supply' onPress={() => openModal('addSupply')} />
        </View>
        {supplies.length === 0 ? (
          <Text style={styles.emptyListText}>
            No supplies added yet. Get tracking!
          </Text>
        ) : (
          <FlatList
            data={supplies}
            renderItem={props => renderItem(props, 'supply')}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Modal */}
      <Modal
        animationType='slide'
        transparent
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType.includes('add') ? 'Add New' : 'Edit'}{' '}
              {modalType.includes('Chore') ? 'Chore' : 'Supply'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder='Name (e.g., Vacuuming, Paper Towels)'
              value={itemName}
              onChangeText={setItemName}
            />
            <TextInput
              style={styles.input}
              placeholder='Frequency in days (e.g., 7)'
              value={itemFrequency}
              onChangeText={setItemFrequency}
              keyboardType='numeric'
            />
            <View style={styles.modalButtons}>
              <Button title='Cancel' onPress={closeModal} color='#FF3B30' />
              <Button title='Save' onPress={handleSaveItem} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  sectionContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  emptyListText: { color: '#888', paddingVertical: 12 },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemTextContainer: {},
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemFrequency: { color: '#666' },
  itemActions: { flexDirection: 'row' },
  actionButton: { marginHorizontal: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '60%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 18,
    padding: 6,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default TaskSupplyManagementScreen;
