import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

const DATES = [
  { day: 'Today', date: '22 Oct' },
  { day: 'Tomorrow', date: '23 Oct' },
  { day: 'Friday', date: '24 Oct' },
  { day: 'Saturday', date: '25 Oct' }
];

const SLOTS = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'];

export default function BookingModal({ visible, service, onClose }) {
  const { pets } = useAuth();
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || 'pet-1');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('11:30 AM');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!service) return null;

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      setIsConfirmed(false);
      onClose();
      Alert.alert(
        'Appointment Confirmed! 🐾',
        `Your booking for ${service.name} has been booked for ${selectedDate} at ${selectedSlot}. The clinic/salon will send you an SMS confirmation shortly.`
      );
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Book Appointment</Text>
              <Text style={styles.subtitle} numberOfLines={1}>{service.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 1. Choose Pet */}
            <Text style={styles.sectionLabel}>SELECT YOUR PET</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petScroll}>
              {pets.map((p) => {
                const isSelected = selectedPet === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.petCard, isSelected && styles.petCardSelected]}
                    onPress={() => setSelectedPet(p.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.petAvatarBadge}>
                      <Text style={{ fontSize: 20 }}>{p.species === 'Dog' ? '🐶' : '🐱'}</Text>
                    </View>
                    <Text style={[styles.petName, isSelected && styles.petNameSelected]}>{p.name}</Text>
                    <Text style={styles.petBreed}>{p.breed}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* 2. Choose Date */}
            <Text style={styles.sectionLabel}>SELECT DATE</Text>
            <View style={styles.dateRow}>
              {DATES.map((d) => {
                const isSelected = selectedDate === d.day;
                return (
                  <TouchableOpacity
                    key={d.day}
                    style={[styles.dateChip, isSelected && styles.dateChipSelected]}
                    onPress={() => setSelectedDate(d.day)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>{d.day}</Text>
                    <Text style={[styles.dateDate, isSelected && styles.dateDateSelected]}>{d.date}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. Choose Time Slot */}
            <Text style={styles.sectionLabel}>SELECT TIME SLOT</Text>
            <View style={styles.slotsGrid}>
              {SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[styles.slotChip, isSelected && styles.slotChipSelected]}
                    onPress={() => setSelectedSlot(slot)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="time-outline"
                      size={13}
                      color={isSelected ? colors.primaryDark : colors.textSecondary}
                    />
                    <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>{slot}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Price Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Fee</Text>
                <Text style={styles.summaryValue}>₹{service.price}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Booking Convenience</Text>
                <Text style={[styles.summaryValue, { color: '#059669' }]}>FREE</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <Text style={styles.totalValue}>₹{service.price}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmBtn, isConfirmed && styles.confirmBtnSuccess]}
            onPress={handleConfirm}
            disabled={isConfirmed}
            activeOpacity={0.8}
          >
            {isConfirmed ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.confirmBtnText}>Booking Confirmed!</Text>
              </View>
            ) : (
              <Text style={styles.confirmBtnText}>Confirm Booking (₹{service.price})</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingBottom: 28,
    paddingTop: 12,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  petScroll: {
    flexDirection: 'row',
  },
  petCard: {
    width: 110,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.lg,
    padding: 10,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  petCardSelected: {
    borderColor: colors.primaryDark,
    backgroundColor: '#FFFBEB',
  },
  petAvatarBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  petName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  petNameSelected: {
    color: colors.primaryDark,
  },
  petBreed: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateChip: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dateChipSelected: {
    borderColor: colors.primaryDark,
    backgroundColor: '#FFFBEB',
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dateDaySelected: {
    color: colors.primaryDark,
  },
  dateDate: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dateDateSelected: {
    color: '#92400E',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  slotChipSelected: {
    borderColor: colors.primaryDark,
    backgroundColor: '#FFFBEB',
  },
  slotText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  slotTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.secondary,
  },
  confirmBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  confirmBtnSuccess: {
    backgroundColor: '#059669',
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
