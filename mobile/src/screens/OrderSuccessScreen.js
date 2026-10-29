import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';

export default function OrderSuccessScreen({ navigation, route }) {
  const orderId = route.params?.orderId || 'ORD-98412';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Celebration Icon Circle */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-done" size={54} color="#FFF" />
        </View>

        <Text style={styles.title}>Order Placed Successfully! 🐾</Text>
        <Text style={styles.orderIdText}>Order ID: #{orderId}</Text>

        <View style={styles.etaCard}>
          <View style={styles.etaHeader}>
            <Ionicons name="flash" size={18} color="#D97706" />
            <Text style={styles.etaTitle}>Estimated Delivery</Text>
          </View>
          <Text style={styles.etaTime}>15 - 20 Minutes</Text>
          <Text style={styles.etaSub}>Paw Street partner store is packing your order</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigation.replace('OrderTracking', { orderId })}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate" size={18} color="#FFF" />
            <Text style={styles.trackBtnText}>Track Order Live</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('HomeTab')}
            activeOpacity={0.7}
          >
            <Text style={styles.homeBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  orderIdText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  etaCard: {
    width: '100%',
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  etaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  etaTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  etaTime: {
    fontSize: 26,
    fontWeight: '900',
    color: '#78350F',
    marginVertical: 4,
  },
  etaSub: {
    fontSize: 12,
    color: '#B45309',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    gap: 8,
  },
  trackBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  homeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  homeBtnText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});
