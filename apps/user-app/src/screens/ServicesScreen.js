import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Alert, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SERVICES } from '../data/mockData';
import { colors } from '../theme/colors';
import SafeScreen from '../components/SafeScreen';
import PetVanModal from '../components/PetVanModal';
import LostPetSOSModal from '../components/LostPetSOSModal';
import PetRelocationModal from '../components/PetRelocationModal';

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'van' | 'relocation' | 'lostpet'
  
  // Flagship modals
  const [isVanModalOpen, setIsVanModalOpen] = useState(false);
  const [isRelocationModalOpen, setIsRelocationModalOpen] = useState(false);
  const [isLostPetModalOpen, setIsLostPetModalOpen] = useState(false);

  const handleBook = (srv) => {
    setSelectedService(srv);
    setModalVisible(true);
  };

  const confirmBooking = () => {
    setModalVisible(false);
    Alert.alert('Booking Confirmed! 🎉', `Your appointment for ${selectedService.title} has been placed. Our specialist will contact you shortly.`);
  };

  return (
    <SafeScreen backgroundColor={colors.background}>
      <View style={styles.container}>
        {/* Modals */}
        <PetVanModal
          visible={isVanModalOpen}
          onClose={() => setIsVanModalOpen(false)}
        />
        <LostPetSOSModal
          visible={isLostPetModalOpen}
          onClose={() => setIsLostPetModalOpen(false)}
        />
        <PetRelocationModal
          visible={isRelocationModalOpen}
          onClose={() => setIsRelocationModalOpen(false)}
        />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pet Wellness & Care</Text>
          <Text style={styles.headerSubtitle}>Doorstep Van, Global Travel, Community SOS & Clinic Care</Text>
        </View>

        {/* Flagship Specialty Cards Row */}
        <View style={styles.flagshipContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.flagshipScroll}>
            {/* 1. Pet Van */}
            <TouchableOpacity
              style={[styles.flagshipCard, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}
              onPress={() => setIsVanModalOpen(true)}
              activeOpacity={0.85}
            >
              <View style={[styles.flagshipIconCircle, { backgroundColor: '#D97706' }]}>
                <Ionicons name="bus" size={20} color="#FFF" />
              </View>
              <Text style={styles.flagshipCardTitle}>Doorstep Pet Van</Text>
              <Text style={styles.flagshipCardSub}>Luxury Spa & Vet inside AC van at your gate</Text>
              <View style={styles.flagshipBadge}>
                <Text style={styles.flagshipBadgeText}>Book Slot 🚐</Text>
              </View>
            </TouchableOpacity>

            {/* 2. Pet Relocation */}
            <TouchableOpacity
              style={[styles.flagshipCard, { backgroundColor: '#E0F2FE', borderColor: '#BAE6FD' }]}
              onPress={() => setIsRelocationModalOpen(true)}
              activeOpacity={0.85}
            >
              <View style={[styles.flagshipIconCircle, { backgroundColor: '#0284C7' }]}>
                <Ionicons name="airplane" size={20} color="#FFF" />
              </View>
              <Text style={styles.flagshipCardTitle}>Pet Relocation</Text>
              <Text style={styles.flagshipCardSub}>Domestic cab/flight & Global IATA crates</Text>
              <View style={[styles.flagshipBadge, { backgroundColor: '#0284C7' }]}>
                <Text style={styles.flagshipBadgeText}>Instant Quote ✈️</Text>
              </View>
            </TouchableOpacity>

            {/* 3. Lost Pet SOS */}
            <TouchableOpacity
              style={[styles.flagshipCard, { backgroundColor: '#FEE2E2', borderColor: '#FECACA' }]}
              onPress={() => setIsLostPetModalOpen(true)}
              activeOpacity={0.85}
            >
              <View style={[styles.flagshipIconCircle, { backgroundColor: '#DC2626' }]}>
                <Ionicons name="megaphone" size={20} color="#FFF" />
              </View>
              <Text style={[styles.flagshipCardTitle, { color: '#991B1B' }]}>Lost Pet Alert</Text>
              <Text style={styles.flagshipCardSub}>Broadcast lost pet to 10km radius fleet</Text>
              <View style={[styles.flagshipBadge, { backgroundColor: '#DC2626' }]}>
                <Text style={styles.flagshipBadgeText}>Community SOS 🚨</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.regularHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>In-Home & Clinic Services</Text>
        </View>

        <FlatList
          data={SERVICES}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.listContainer, { paddingBottom: 110 }]}
          renderItem={({ item }) => (
            <View style={styles.serviceCard}>
              <Image source={{ uri: item.image }} style={styles.serviceImage} />
              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={colors.star} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={styles.desc}>{item.description}</Text>
                <View style={styles.bottomRow}>
                  <View>
                    <Text style={styles.duration}>⏱ {item.duration}</Text>
                    <Text style={styles.price}>₹{item.price}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => handleBook(item)}
                  >
                    <Text style={styles.bookButtonText}>Book Appointment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />

      {/* Booking Confirmation Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
            <Text style={styles.modalTitle}>Confirm Pet Service</Text>
            {selectedService && (
              <>
                <Text style={styles.modalSubtitle}>{selectedService.title}</Text>
                <Text style={styles.modalPrice}>Total: ₹{selectedService.price} ({selectedService.duration})</Text>
                <Text style={styles.modalHint}>Our certified professional will arrive with sanitized equipment.</Text>
                <View style={styles.modalBtnRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={confirmBooking}
                  >
                    <Text style={styles.confirmText}>Confirm & Book</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  serviceCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  serviceImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  desc: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  duration: {
    fontSize: 11,
    color: colors.textMuted,
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.accent,
  },
  bookButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 4,
  },
  modalPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.accent,
    marginVertical: 10,
  },
  modalHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: colors.primaryDark,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
  },
  flagshipContainer: {
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  flagshipScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  flagshipCard: {
    width: 175,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  flagshipIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  flagshipCardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  flagshipCardSub: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginBottom: 10,
  },
  flagshipBadge: {
    backgroundColor: '#D97706',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  flagshipBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
  regularHeaderRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
});

