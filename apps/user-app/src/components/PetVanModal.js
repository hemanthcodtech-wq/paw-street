import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const VAN_PACKAGES = [
  {
    id: 'van-spa-full',
    title: 'Luxury Doorstep Pet Spa Van',
    tagline: 'Warm hydrobath, blowout, haircut & aroma mist inside customized AC van',
    duration: '75 mins',
    price: 1299,
    originalPrice: 1799,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
    features: ['Zero travel stress', 'Warm water hydro-bath', 'Nail clipping & paw balm', 'Organic coat aroma']
  },
  {
    id: 'van-vet-vaccine',
    title: 'Doorstep Mobile Vet & Vaccine Van',
    tagline: 'Certified veterinary consultation, 9-in-1 vaccine & health passport',
    duration: '45 mins',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
    features: ['Physical health checkup', 'Annual vaccination', 'Deworming dose', 'Digital health card']
  },
  {
    id: 'van-medicated-flea',
    title: 'Anti-Tick & Flea Medicated Wash Van',
    tagline: 'Doctor-approved herbal medicated dip & parasite extraction',
    duration: '60 mins',
    price: 1099,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    features: ['Herbal anti-tick dip', 'Skin soothing spray', 'Flea prevention coat barrier', 'Ozone sterilized van']
  }
];

const TIME_SLOTS = [
  '09:00 AM - 10:30 AM',
  '11:00 AM - 12:30 PM',
  '02:00 PM - 03:30 PM',
  '04:30 PM - 06:00 PM'
];

export default function PetVanModal({ visible, onClose, selectedLocation }) {
  const insets = useSafeAreaInsets();
  const [selectedPkg, setSelectedPkg] = useState(VAN_PACKAGES[0]);
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);

  const handleConfirmBooking = () => {
    const booking = {
      id: `VAN-${Math.floor(100000 + Math.random() * 900000)}`,
      package: selectedPkg.title,
      price: selectedPkg.price,
      date: selectedDate,
      slot: selectedSlot,
      address: `${selectedLocation?.area || 'Banjara Hills'}, ${selectedLocation?.city || 'Hyderabad'}`,
      vanNumber: 'TS 09 PV 2026 (Force Urbania AC Spa Van)',
      groomer: 'Mahesh Sharma (Certified Master Groomer)',
      status: 'confirmed'
    };
    setActiveBooking(booking);
    setBookingConfirmed(true);
  };

  const handleReset = () => {
    setBookingConfirmed(false);
    setActiveBooking(null);
    if (onClose) onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { paddingBottom: Math.max(insets.bottom, 16) + 14 }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="bus" size={20} color="#FFF" />
              </View>
              <View>
                <Text style={styles.modalTitle}>🚐 Doorstep Pet Van Services</Text>
                <Text style={styles.modalSubtitle}>Scheduled AC Van at your gate • No salon travel</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleReset} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
            {bookingConfirmed && activeBooking ? (
              <View style={styles.successCard}>
                <View style={styles.successIconWrap}>
                  <Ionicons name="checkmark-circle" size={54} color="#10B981" />
                </View>
                <Text style={styles.successTitle}>Pet Van Appointment Confirmed! 🎉</Text>
                <Text style={styles.successSub}>
                  Booking ID: <Text style={{ fontWeight: '800', color: '#0F172A' }}>{activeBooking.id}</Text>
                </Text>

                {/* Scheduled Details */}
                <View style={styles.bookingDetailsBox}>
                  <Text style={styles.detailRow}>🚐 <Text style={styles.bold}>{activeBooking.package}</Text></Text>
                  <Text style={styles.detailRow}>📅 Date: <Text style={styles.bold}>{activeBooking.date}</Text></Text>
                  <Text style={styles.detailRow}>⏰ Slot: <Text style={styles.bold}>{activeBooking.slot}</Text></Text>
                  <Text style={styles.detailRow}>📍 Doorstep: <Text style={styles.bold}>{activeBooking.address}</Text></Text>
                  <Text style={styles.detailRow}>💳 Total Payable: <Text style={styles.boldGreen}>₹{activeBooking.price}</Text></Text>
                </View>

                {/* Status Timeline */}
                <View style={styles.timelineBox}>
                  <Text style={styles.timelineHeading}>Appointment Timeline (Scheduled Model)</Text>
                  <View style={styles.timelineItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.timelineText}>1. Slot Confirmed & Sanitized Van Assigned</Text>
                  </View>
                  <View style={styles.timelineItem}>
                    <Ionicons name="time" size={16} color="#F59E0B" />
                    <Text style={styles.timelineText}>2. Van will dispatch for your slot ({activeBooking.slot})</Text>
                  </View>
                  <View style={styles.timelineItem}>
                    <Ionicons name="location-outline" size={16} color="#94A3B8" />
                    <Text style={styles.timelineTextMuted}>3. Groomer calls upon doorstep arrival</Text>
                  </View>
                  <View style={styles.timelineItem}>
                    <Ionicons name="sparkles-outline" size={16} color="#94A3B8" />
                    <Text style={styles.timelineTextMuted}>4. 75-min Stress-Free Spa inside AC Van</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.actionBtn} onPress={handleReset}>
                  <Text style={styles.actionBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* 1. Choose Van Package */}
                <Text style={styles.sectionHeading}>1. Select Doorstep Van Package</Text>
                {VAN_PACKAGES.map(pkg => (
                  <TouchableOpacity
                    key={pkg.id}
                    style={[styles.pkgCard, selectedPkg.id === pkg.id && styles.pkgCardActive]}
                    onPress={() => setSelectedPkg(pkg)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: pkg.image }} style={styles.pkgImg} />
                    <View style={styles.pkgInfo}>
                      <View style={styles.pkgHeaderRow}>
                        <Text style={styles.pkgTitle} numberOfLines={1}>{pkg.title}</Text>
                        <Text style={styles.pkgPrice}>₹{pkg.price}</Text>
                      </View>
                      <Text style={styles.pkgTagline} numberOfLines={2}>{pkg.tagline}</Text>
                      <View style={styles.pkgMetaRow}>
                        <Text style={styles.pkgDuration}>⏱ {pkg.duration}</Text>
                        <Text style={styles.pkgOriginal}>₹{pkg.originalPrice}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

                {/* 2. Select Date */}
                <Text style={styles.sectionHeading}>2. Pick Appointment Date</Text>
                <View style={styles.pillsRow}>
                  {['Today', 'Tomorrow', 'This Weekend', 'Monday'].map(d => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.pill, selectedDate === d && styles.pillActive]}
                      onPress={() => setSelectedDate(d)}
                    >
                      <Text style={[styles.pillText, selectedDate === d && styles.pillTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* 3. Select Time Slot */}
                <Text style={styles.sectionHeading}>3. Choose Arrival Time Slot</Text>
                <View style={styles.slotsGrid}>
                  {TIME_SLOTS.map(slot => (
                    <TouchableOpacity
                      key={slot}
                      style={[styles.slotCard, selectedSlot === slot && styles.slotCardActive]}
                      onPress={() => setSelectedSlot(slot)}
                    >
                      <Ionicons
                        name={selectedSlot === slot ? 'radio-button-on' : 'radio-button-off'}
                        size={15}
                        color={selectedSlot === slot ? '#FB8500' : '#94A3B8'}
                      />
                      <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Location Notice */}
                <View style={styles.locationNotice}>
                  <Ionicons name="pin" size={16} color="#FB8500" />
                  <Text style={styles.locationNoticeText}>
                    Van will park outside: <Text style={{ fontWeight: '800' }}>{selectedLocation?.area || 'Banjara Hills, Road No 12'}</Text>
                  </Text>
                </View>

                {/* Confirm CTA */}
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handleConfirmBooking}
                  activeOpacity={0.85}
                >
                  <Text style={styles.confirmBtnText}>Schedule Pet Van (₹{selectedPkg.price})</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFF" />
                </TouchableOpacity>
              </>
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
    maxHeight: '90%',
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
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FB8500',
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
  scroll: {
    maxHeight: 520,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8,
  },
  pkgCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    gap: 10,
  },
  pkgCardActive: {
    borderColor: '#FB8500',
    backgroundColor: '#FFF7ED',
  },
  pkgImg: {
    width: 75,
    height: 75,
    borderRadius: 12,
  },
  pkgInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  pkgHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pkgTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  pkgPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#D97706',
    marginLeft: 6,
  },
  pkgTagline: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  pkgMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  pkgDuration: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  pkgOriginal: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  pill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: '#FB8500',
    borderColor: '#FB8500',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  slotsGrid: {
    gap: 8,
    marginBottom: 12,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotCardActive: {
    borderColor: '#FB8500',
    backgroundColor: '#FFF7ED',
  },
  slotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  slotTextActive: {
    fontWeight: '800',
    color: '#0F172A',
  },
  locationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 12,
    marginVertical: 8,
  },
  locationNoticeText: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FB8500',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
  },
  successCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successIconWrap: {
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  successSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16,
  },
  bookingDetailsBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  detailRow: {
    fontSize: 12,
    color: '#334155',
  },
  bold: {
    fontWeight: '800',
    color: '#0F172A',
  },
  boldGreen: {
    fontWeight: '900',
    color: '#059669',
    fontSize: 14,
  },
  timelineBox: {
    width: '100%',
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  timelineHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9A3412',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timelineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  timelineTextMuted: {
    fontSize: 11,
    color: '#64748B',
  },
  actionBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  actionBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
