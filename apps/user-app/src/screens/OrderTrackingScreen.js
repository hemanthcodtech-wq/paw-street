import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function OrderTrackingScreen({ route, navigation }) {
  const { order } = route.params || {};

  const orderData = order || {
    id: 'PAW-782910',
    status: 'Out for Delivery',
    estimatedDelivery: 'Today by 4:30 PM',
    otp: '4821',
    rider: {
      name: 'Raju Kumar (Paw Captain)',
      phone: '+91 98451 22334',
      vehicle: 'EV Scooter (TS 09 EQ 4421)',
      rating: 4.9
    },
    items: [
      {
        name: 'Royal Canin Maxi Adult Dog Food',
        quantity: 1,
        price: 3499,
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80'
      }
    ],
    deliveryAddress: 'Flat 402, Green Valley Apts, Road 12, Banjara Hills, Hyderabad'
  };

  const steps = [
    { label: 'Order Confirmed', time: '2:15 PM', done: true },
    { label: 'Store Packing Goods', time: '2:18 PM', done: true },
    { label: 'Rider Picked Up Package', time: '2:24 PM', done: true },
    { label: 'Rider on the Way to You', time: '2:27 PM', done: true, current: true },
    { label: 'Delivered', time: 'Est. 2:35 PM', done: false }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Top Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>Arriving in 8-12 Minutes</Text>
          <View style={styles.liveBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <Text style={styles.statusSubtitle}>Rider is 1.4 km away from your location</Text>

        <View style={styles.otpBox}>
          <Text style={styles.otpLabel}>Delivery Verification Code</Text>
          <Text style={styles.otpCode}>{orderData.otp || '4821'}</Text>
        </View>
      </View>

      {/* Rider Info Card */}
      <View style={styles.riderCard}>
        <View style={styles.riderAvatar}>
          <Ionicons name="person" size={24} color="#FFF" />
        </View>
        <View style={styles.riderInfo}>
          <Text style={styles.riderName}>{orderData.rider?.name}</Text>
          <Text style={styles.riderVehicle}>{orderData.rider?.vehicle}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={colors.star} />
            <Text style={styles.ratingVal}>{orderData.rider?.rating || '4.9'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Tracking Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>Order Progress</Text>
        {steps.map((s, idx) => (
          <View key={idx} style={styles.stepRow}>
            <View style={styles.stepIndicator}>
              <View style={[styles.circle, s.done && styles.circleDone, s.current && styles.circleCurrent]}>
                {s.done && <Ionicons name="checkmark" size={12} color="#FFF" />}
              </View>
              {idx < steps.length - 1 && (
                <View style={[styles.line, s.done && styles.lineDone]} />
              )}
            </View>
            <View style={styles.stepTextGroup}>
              <Text style={[styles.stepLabel, s.current && styles.stepLabelCurrent]}>{s.label}</Text>
              <Text style={styles.stepTime}>{s.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Destination Card */}
      <View style={styles.destCard}>
        <Ionicons name="location" size={18} color={colors.primaryDark} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.destTitle}>Delivery Location</Text>
          <Text style={styles.destAddress}>{orderData.deliveryAddress}</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  liveBadge: {
    backgroundColor: '#DCFCE7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#15803D',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  statusSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  otpBox: {
    backgroundColor: '#FFF8E7',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 2,
  },
  otpCode: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 4,
  },
  riderCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
  },
  riderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  riderName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  riderVehicle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  ratingVal: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 44,
  },
  stepIndicator: {
    alignItems: 'center',
    width: 24,
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  circleCurrent: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primaryDark,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.borderLight,
    marginVertical: 2,
  },
  lineDone: {
    backgroundColor: colors.accent,
  },
  stepTextGroup: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 16,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  stepLabelCurrent: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  stepTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  destCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  destTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  destAddress: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

