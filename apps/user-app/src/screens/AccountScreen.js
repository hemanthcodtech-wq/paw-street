import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { colors } from '../theme/colors';
import SafeScreen from '../components/SafeScreen';

export default function AccountScreen({ navigation }) {
  const { user, isLoggedIn, logout, pets, addPet } = useAuth();
  const { orders } = useOrder();

  const [modalVisible, setModalVisible] = useState(false);
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');

  const handleSavePet = () => {
    if (!petName.trim()) {
      Alert.alert('Required', 'Please enter your pet name');
      return;
    }
    addPet({
      name: petName,
      species,
      breed: breed || 'Companion',
      age: age || '1 Year',
      gender: 'Male',
      weight: '12 kg'
    });
    setPetName('');
    setBreed('');
    setAge('');
    setModalVisible(false);
  };

  return (
    <SafeScreen backgroundColor={colors.background}>
      <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80' }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.name || 'Pet Parent'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'customer@thepawstreet.com'}</Text>
          <Text style={styles.userPhone}>{user?.phone || '+91 98450 11223'}</Text>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => Alert.alert('Profile', 'Profile edit features available in next release')}
        >
          <Ionicons name="pencil" size={16} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Furry Family (My Pets) */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Furry Family ({pets?.length || 0})</Text>
          <TouchableOpacity
            style={styles.addPetBtn}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={14} color="#FFF" />
            <Text style={styles.addPetBtnText}>Add Pet</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.petsList}>
          {pets && pets.map(pet => (
            <View key={pet.id} style={styles.petCard}>
              <Image source={{ uri: pet.avatar }} style={styles.petAvatar} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petSub}>{pet.species} • {pet.breed}</Text>
                <Text style={styles.petSub}>{pet.age} • {pet.weight || '10 kg'}</Text>
              </View>
              <View style={styles.badgeShield}>
                <Ionicons name="shield-checkmark" size={14} color="#15803D" />
                <Text style={styles.badgeShieldText}>Vaccinated</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders ({orders?.length || 0})</Text>
        </View>
        {orders && orders.map(ord => (
          <TouchableOpacity
            key={ord.id}
            style={styles.orderTile}
            onPress={() => navigation.navigate('OrderTracking', { order: ord })}
          >
            <View style={styles.orderLeft}>
              <Text style={styles.orderId}>{ord.id}</Text>
              <Text style={styles.orderDate}>{ord.date} • ₹{ord.total}</Text>
              <Text style={styles.orderStatusText}>Status: {ord.status}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Account Settings / Links */}
      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="location-outline" size={20} color={colors.textPrimary} />
          <Text style={styles.menuText}>Saved Delivery Addresses</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="card-outline" size={20} color={colors.textPrimary} />
          <Text style={styles.menuText}>Payment Methods & UPI</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChatBot')}>
          <Ionicons name="help-buoy-outline" size={20} color={colors.textPrimary} />
          <Text style={styles.menuText}>Help & Pet Care Support</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          await logout();
          navigation.replace('Auth');
        }}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.logoutBtnText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Add Pet Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Furry Family Member 🐶</Text>

            <Text style={styles.inputLabel}>Pet Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Bella"
              value={petName}
              onChangeText={setPetName}
            />

            <Text style={styles.inputLabel}>Pet Type</Text>
            <View style={styles.typeRow}>
              {['Dog', 'Cat', 'Bird', 'Fish'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeBtn, species === type && styles.typeBtnActive]}
                  onPress={() => setSpecies(type)}
                >
                  <Text style={[styles.typeText, species === type && styles.typeTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Breed</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Golden Retriever / Persian"
              value={breed}
              onChangeText={setBreed}
            />

            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2 Years"
              value={age}
              onChangeText={setAge}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={handleSavePet}
              >
                <Text style={styles.modalSaveText}>Save Pet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  profileHeader: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userPhone: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  addPetBtn: {
    backgroundColor: colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  addPetBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  petsList: {
    gap: 10,
  },
  petCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  petAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  petName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  petSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  badgeShield: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 3,
  },
  badgeShieldText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },
  orderTile: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  orderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutBtnText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: colors.textPrimary,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: colors.primaryDark,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  typeTextActive: {
    color: '#FFF',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalSave: {
    flex: 2,
    backgroundColor: colors.primaryDark,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
  },
});

