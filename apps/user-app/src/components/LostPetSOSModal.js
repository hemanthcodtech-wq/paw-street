import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const SAMPLE_LOST_PETS = [
  {
    id: 'lost-1',
    petName: 'Milo',
    breed: 'Beagle',
    color: 'Tri-color (White, Black & Brown)',
    lastSeen: 'Near KBR Park Gate 2, Jubilee Hills',
    distance: '1.4 km from your pin',
    reward: '₹3,000 Reward',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
    contact: '+91 98450 12345',
    notes: 'Very friendly, responds to Milo. Has a white patch on tail.'
  },
  {
    id: 'lost-2',
    petName: 'Ginger',
    breed: 'Persian Longhair Cat',
    color: 'Ginger Cream',
    lastSeen: 'Road No 12, Banjara Hills',
    distance: '0.8 km from your pin',
    reward: '₹5,000 Reward',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    contact: '+91 99887 66554',
    notes: 'Indoor cat, wearing pink collar with bell. Might hide under parked cars.'
  }
];

export default function LostPetSOSModal({ visible, onClose, selectedLocation }) {
  const [mode, setMode] = useState('browse'); // 'browse' | 'report'
  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [rewardAmount, setRewardAmount] = useState('2000');
  const [lastSeenArea, setLastSeenArea] = useState(selectedLocation?.area || 'Banjara Hills');
  const [notes, setNotes] = useState('');

  const handleReportSubmit = () => {
    if (!petName.trim() || !breed.trim() || !contactPhone.trim()) {
      Alert.alert('Required Fields', 'Please enter Pet Name, Breed, and Contact Phone Number.');
      return;
    }
    Alert.alert(
      '🚨 SOS Alert Broadcasted!',
      `Emergency lost pet alert for ${petName} has been broadcasted to all pet owners and delivery captains in ${lastSeenArea}.`,
      [{ text: 'OK', onPress: () => { setMode('browse'); if (onClose) onClose(); } }]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.sosIconCircle}>
                <Ionicons name="warning" size={20} color="#FFF" />
              </View>
              <View>
                <Text style={styles.modalTitle}>🚨 Lost Pet SOS Community</Text>
                <Text style={styles.modalSubtitle}>Nearby pet emergency & rescue broadcast</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Mode Switch Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, mode === 'browse' && styles.tabBtnActive]}
              onPress={() => setMode('browse')}
            >
              <Text style={[styles.tabBtnText, mode === 'browse' && styles.tabBtnTextActive]}>
                Lost Pets Near You (2)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, mode === 'report' && styles.tabBtnActiveAlert]}
              onPress={() => setMode('report')}
            >
              <Text style={[styles.tabBtnText, mode === 'report' && styles.tabBtnTextAlertActive]}>
                + Report a Lost Pet
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {mode === 'browse' ? (
              <>
                <View style={styles.infoBanner}>
                  <Ionicons name="megaphone" size={16} color="#DC2626" />
                  <Text style={styles.infoBannerText}>
                    Showing lost pet sightings within 5 km of <Text style={{ fontWeight: '800' }}>{selectedLocation?.area || 'Banjara Hills'}</Text>. If spotted, call the parent immediately.
                  </Text>
                </View>

                {SAMPLE_LOST_PETS.map(pet => (
                  <View key={pet.id} style={styles.petCard}>
                    <Image source={{ uri: pet.image }} style={styles.petImg} />
                    <View style={styles.petDetails}>
                      <View style={styles.petHeader}>
                        <Text style={styles.petName}>{pet.petName}</Text>
                        <View style={styles.rewardBadge}>
                          <Text style={styles.rewardText}>{pet.reward}</Text>
                        </View>
                      </View>
                      <Text style={styles.breedText}>{pet.breed} • {pet.color}</Text>
                      <Text style={styles.locText}>📍 {pet.lastSeen}</Text>
                      <Text style={styles.distText}>⚡ {pet.distance}</Text>
                      <Text style={styles.notesText} numberOfLines={2}>"{pet.notes}"</Text>

                      <View style={styles.btnRow}>
                        <TouchableOpacity
                          style={styles.callBtn}
                          onPress={() => Alert.alert('Contacting Owner', `Calling ${pet.contact}...`)}
                        >
                          <Ionicons name="call" size={14} color="#FFF" />
                          <Text style={styles.callBtnText}>Call Owner</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.sightBtn}
                          onPress={() => Alert.alert('Thank You!', `Sighting logged for ${pet.petName}. Owner has been sent your notification.`)}
                        >
                          <Ionicons name="eye" size={14} color="#059669" />
                          <Text style={styles.sightBtnText}>I Spotted Him</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.formHelp}>
                  Broadcast emergency alert to thousands of pet parents and 15-minute delivery fleet captains in your area.
                </Text>

                <Text style={styles.label}>Pet Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Bruno / Bella"
                  placeholderTextColor="#94A3B8"
                  value={petName}
                  onChangeText={setPetName}
                />

                <Text style={styles.label}>Breed / Color *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Golden Retriever (Cream color)"
                  placeholderTextColor="#94A3B8"
                  value={breed}
                  onChangeText={setBreed}
                />

                <Text style={styles.label}>Last Seen Location / Landmark *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Near Banjara Hills Road 12 Park"
                  placeholderTextColor="#94A3B8"
                  value={lastSeenArea}
                  onChangeText={setLastSeenArea}
                />

                <Text style={styles.label}>Contact Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 98450 11223"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={contactPhone}
                  onChangeText={setContactPhone}
                />

                <Text style={styles.label}>Reward Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 2000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={rewardAmount}
                  onChangeText={setRewardAmount}
                />

                <Text style={styles.label}>Identifying Marks / Collar Details</Text>
                <TextInput
                  style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                  placeholder="e.g. Wearing red collar with bell, white patch on chest..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                />

                <TouchableOpacity
                  style={styles.submitSosBtn}
                  onPress={handleReportSubmit}
                  activeOpacity={0.85}
                >
                  <Ionicons name="radio" size={18} color="#FFF" />
                  <Text style={styles.submitSosBtnText}>Broadcast Nearby SOS Alert 🚨</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#FAF7F2',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sosIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  closeBtn: {
    padding: 4,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  tabBtnActiveAlert: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  tabBtnTextAlertActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  scroll: {
    maxHeight: 520,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  infoBannerText: {
    fontSize: 11,
    color: '#991B1B',
    flex: 1,
    lineHeight: 15,
  },
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    flexDirection: 'row',
    gap: 12,
  },
  petImg: {
    width: 85,
    height: 85,
    borderRadius: 14,
  },
  petDetails: {
    flex: 1,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  rewardBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rewardText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  breedText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  locText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  distText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 2,
  },
  notesText: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 6,
  },
  callBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  sightBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    paddingVertical: 6,
  },
  sightBtnText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '800',
  },
  formContainer: {
    gap: 8,
    paddingBottom: 20,
  },
  formHelp: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0F172A',
  },
  submitSosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 12,
  },
  submitSosBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 13,
  },
});
