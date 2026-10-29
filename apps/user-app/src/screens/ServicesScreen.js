import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SERVICES } from '../data/mockData';
import { colors } from '../theme/colors';

export default function ServicesScreen() {
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleBook = (srv) => {
    setSelectedService(srv);
    setModalVisible(true);
  };

  const confirmBooking = () => {
    setModalVisible(false);
    Alert.alert('Booking Confirmed! 🎉', `Your appointment for ${selectedService.title} has been placed. Our specialist will contact you shortly.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pet Wellness & Services</Text>
        <Text style={styles.headerSubtitle}>Verified Groomers, Doctors, Walkers & Boarding</Text>
      </View>

      <FlatList
        data={SERVICES}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
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
          <View style={styles.modalCard}>
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
});

