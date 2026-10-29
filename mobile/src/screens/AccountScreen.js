import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function AccountScreen({ navigation }) {
  const { user, pets, addPet, logout, selectedLocation } = useAuth();
  const { wishlist } = useCart();

  const [isAddPetVisible, setIsAddPetVisible] = useState(false);
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');

  const handleSavePet = () => {
    if (!petName.trim() || !breed.trim()) {
      Alert.alert('Required Info', 'Please enter your pet name and breed');
      return;
    }
    addPet({
      name: petName.trim(),
      species,
      breed: breed.trim(),
      age: age ? `${age} Years` : '1 Year',
      weight: weight ? `${weight} kg` : '10 kg'
    });
    setPetName('');
    setBreed('');
    setAge('');
    setWeight('');
    setIsAddPetVisible(false);
    Alert.alert('Pet Added! 🐾', `${petName} has been added to your profile!`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* User Profile Header Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.name || 'Pet Parent'}</Text>
            <Text style={styles.userPhone}>{user?.phone || '+91 98765 43210'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'customer@thepawstreet.com'}</Text>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>⭐ PAW PRESTIGE CLUB MEMBER</Text>
            </View>
          </View>
        </View>

        {/* My Pets Carousel */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>My Furry Family ({pets.length})</Text>
            <Text style={styles.sectionSub}>Tailored diet & grooming recommendations</Text>
          </View>
          <TouchableOpacity
            style={styles.addPetBtn}
            onPress={() => setIsAddPetVisible(true)}
          >
            <Ionicons name="add" size={16} color="#B45309" />
            <Text style={styles.addPetBtnText}>Add Pet</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsScroll}>
          {pets.map((pet) => (
            <View key={pet.id} style={styles.petCard}>
              <Image
                source={{ uri: pet.avatar || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80' }}
                style={styles.petAvatar}
              />
              <Text style={styles.petNameText}>{pet.name}</Text>
              <Text style={styles.petBreedText}>{pet.breed}</Text>
              <View style={styles.petDetailsRow}>
                <Text style={styles.petDetailTag}>{pet.age || '2 Yrs'}</Text>
                <Text style={styles.petDetailTag}>{pet.gender || 'Pet'}</Text>
                <Text style={styles.petDetailTag}>{pet.weight || '15kg'}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Quick Menu */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('OrderTracking')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="receipt-outline" size={18} color="#B45309" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>My Orders & Live Tracking</Text>
              <Text style={styles.menuSub}>Track current orders & past receipts</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('CatalogTab')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="heart-outline" size={18} color="#BE185D" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Wishlist ({wishlist.length})</Text>
              <Text style={styles.menuSub}>Saved treats, collars and essentials</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ChatBot')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="chatbubbles-outline" size={18} color="#0369A1" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>24/7 AI Pet Assistant</Text>
              <Text style={styles.menuSub}>Veterinary guidance and health queries</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Alert.alert(
                'Delivery Address',
                `${selectedLocation?.area || 'Banjara Hills, Hyderabad'}\nPincode: ${selectedLocation?.pincode || '500034'}`
              );
            }}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="location-outline" size={18} color="#15803D" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuTitle}>Saved Addresses</Text>
              <Text style={styles.menuSub}>{selectedLocation?.area || 'Hyderabad'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert(
              'Sign Out',
              'Do you want to log out of your account?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: async () => {
                    await logout();
                    navigation.replace('Auth');
                  }
                }
              ]
            );
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Sign Out / Switch Account</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Pet Modal */}
      <Modal visible={isAddPetVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Pet 🐾</Text>
              <TouchableOpacity onPress={() => setIsAddPetVisible(false)}>
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Species selector */}
              <Text style={styles.inputLabel}>PET TYPE</Text>
              <View style={styles.speciesRow}>
                {['Dog', 'Cat', 'Bird', 'Fish'].map((sp) => (
                  <TouchableOpacity
                    key={sp}
                    style={[styles.speciesChip, species === sp && styles.speciesChipSelected]}
                    onPress={() => setSpecies(sp)}
                  >
                    <Text style={{ fontSize: 16 }}>{sp === 'Dog' ? '🐶' : sp === 'Cat' ? '🐱' : sp === 'Bird' ? '🦜' : '🐠'}</Text>
                    <Text style={[styles.speciesText, species === sp && styles.speciesTextSelected]}>{sp}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>PET NAME</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Bruno, Bella, Simba"
                placeholderTextColor={colors.textMuted}
                value={petName}
                onChangeText={setPetName}
              />

              <Text style={styles.inputLabel}>BREED</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Golden Retriever, Persian, Beagle"
                placeholderTextColor={colors.textMuted}
                value={breed}
                onChangeText={setBreed}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>AGE (YEARS)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 2"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textMuted}
                    value={age}
                    onChangeText={setAge}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>WEIGHT (KG)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 25"
                    keyboardType="numeric"
                    placeholderTextColor={colors.textMuted}
                    value={weight}
                    onChangeText={setWeight}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.savePetBtn}
                onPress={handleSavePet}
                activeOpacity={0.8}
              >
                <Text style={styles.savePetBtnText}>Save Pet Profile</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceAlt,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userPhone: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  badgePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#B45309',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addPetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    gap: 3,
  },
  addPetBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  petsScroll: {
    marginBottom: spacing.xl,
  },
  petCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  petAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surfaceAlt,
    marginBottom: 6,
  },
  petNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  petBreedText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 6,
  },
  petDetailsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  petDetailTag: {
    fontSize: 9,
    fontWeight: '700',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    color: colors.textSecondary,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: 12,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  menuSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    gap: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EF4444',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: 36,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 10,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  speciesChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    gap: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  speciesChipSelected: {
    borderColor: colors.primaryDark,
    backgroundColor: '#FFFBEB',
  },
  speciesText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  speciesTextSelected: {
    color: colors.primaryDark,
  },
  textInput: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    fontSize: 13,
    color: colors.textPrimary,
  },
  savePetBtn: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  savePetBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
