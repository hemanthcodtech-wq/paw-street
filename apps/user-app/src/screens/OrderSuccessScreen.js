import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function OrderSuccessScreen({ route, navigation }) {
  const { order } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark-circle" size={72} color={colors.accent} />
      </View>
      <Text style={styles.title}>Order Placed Successfully! 🐾</Text>
      <Text style={styles.subtitle}>
        Your pet's happiness is on its way! Our partner store is preparing your items.
      </Text>

      <View style={styles.orderInfoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Order ID</Text>
          <Text style={styles.infoVal}>{order?.id || 'PAW-782910'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estimated Delivery</Text>
          <Text style={styles.infoValHighlight}>{order?.estimatedDelivery || '15-20 Mins'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Delivery OTP</Text>
          <Text style={styles.otpVal}>{order?.otp || '4821'}</Text>
        </View>
        <Text style={styles.otpNote}>Share this OTP with the delivery partner upon arrival.</Text>
      </View>

      <TouchableOpacity
        style={styles.trackBtn}
        onPress={() => navigation.replace('OrderTracking', { order })}
      >
        <Ionicons name="location" size={18} color="#FFF" />
        <Text style={styles.trackBtnText}>Track Live Delivery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.replace('MainTabs')}
      >
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconCircle: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
    marginBottom: 24,
  },
  orderInfoCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  infoValHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.accent,
  },
  otpVal: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primaryDark,
    letterSpacing: 2,
  },
  otpNote: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  trackBtn: {
    width: '100%',
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  trackBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  homeBtn: {
    paddingVertical: 10,
  },
  homeBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
});

