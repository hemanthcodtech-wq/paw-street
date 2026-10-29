import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDelivery } from '../../context/DeliveryContext';
import { colors } from '../../theme/colors';

export default function DeliveryWalletScreen() {
  const { walletBalance, cashInHand, todayEarnings } = useDelivery();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rider Wallet & Payouts</Text>
        <Text style={styles.headerSubtitle}>Instant earnings and cash settlement</Text>
      </View>

      {/* Main Payout Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Withdrawal Balance</Text>
        <Text style={styles.balanceVal}>₹{walletBalance}</Text>
        <Text style={styles.balanceSub}>Direct transfer to UPI ID / Bank Account</Text>

        <TouchableOpacity
          style={styles.withdrawBtn}
          onPress={() => Alert.alert('Instant Transfer', `Withdrawal of ₹${walletBalance} initiated to registered UPI account.`)}
        >
          <Ionicons name="flash" size={16} color={colors.white} />
          <Text style={styles.withdrawBtnText}>Transfer to Bank / UPI</Text>
        </TouchableOpacity>
      </View>

      {/* Cash in Hand (COD Settlement) */}
      <View style={styles.codCard}>
        <View style={styles.codHeader}>
          <Ionicons name="cash" size={22} color="#F59E0B" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.codTitle}>Cash in Hand (COD Collected)</Text>
            <Text style={styles.codVal}>₹{cashInHand}</Text>
          </View>
        </View>
        <Text style={styles.codNote}>
          This cash is automatically deducted from your upcoming weekly payout cycle or can be deposited at partner hubs.
        </Text>
      </View>

      {/* Summary Tiles */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryTile}>
          <Text style={styles.tileLabel}>Today's Base Pay</Text>
          <Text style={styles.tileVal}>₹{todayEarnings - 120}</Text>
        </View>
        <View style={styles.summaryTile}>
          <Text style={styles.tileLabel}>Surge & Peak Bonus</Text>
          <Text style={styles.tileVal}>₹120</Text>
        </View>
        <View style={styles.summaryTile}>
          <Text style={styles.tileLabel}>Customer Tips</Text>
          <Text style={styles.tileValGreen}>+₹90</Text>
        </View>
        <View style={styles.summaryTile}>
          <Text style={styles.tileLabel}>Fuel Allowance</Text>
          <Text style={styles.tileValGreen}>+₹150</Text>
        </View>
      </View>

      {/* Bank & UPI Linked */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark" size={18} color="#22C55E" />
          <Text style={styles.infoTitle}>Linked UPI Account</Text>
        </View>
        <Text style={styles.infoDetail}>raju.kumar@okhdfcbank (Verified)</Text>
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
  header: {
    paddingTop: 12,
    paddingBottom: 14,
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
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  balanceVal: {
    fontSize: 32,
    fontWeight: '900',
    color: '#22C55E',
    marginVertical: 6,
  },
  balanceSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 16,
  },
  withdrawBtn: {
    backgroundColor: colors.delivery,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  withdrawBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  codCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: 16,
  },
  codHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  codVal: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.accent,
    marginTop: 2,
  },
  codNote: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  summaryTile: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  tileLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tileVal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  tileValGreen: {
    fontSize: 15,
    fontWeight: '900',
    color: '#22C55E',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  infoDetail: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

