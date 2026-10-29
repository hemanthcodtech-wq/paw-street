import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartnerAuth } from '../../context/PartnerAuthContext';
import { colors } from '../../theme/colors';

export default function VendorEarningsScreen() {
  const { partnerUser } = usePartnerAuth();

  const payouts = [
    { id: 'PAY-401', date: 'Yesterday, 8:00 PM', amount: 18450, status: 'Settled to HDFC Bank' },
    { id: 'PAY-400', date: '27 Oct 2026', amount: 22100, status: 'Settled to HDFC Bank' },
    { id: 'PAY-399', date: '25 Oct 2026', amount: 14600, status: 'Settled to HDFC Bank' }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financials & Settlements</Text>
        <Text style={styles.headerSubtitle}>Real-time sales revenue & payout audit</Text>
      </View>

      {/* Main Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Payout Balance</Text>
        <Text style={styles.balanceVal}>₹48,920</Text>
        <Text style={styles.balanceSub}>Next automated direct transfer: Tomorrow, 6:00 AM</Text>

        <TouchableOpacity
          style={styles.withdrawBtn}
          onPress={() => Alert.alert('Instant Payout', 'Payout request of ₹48,920 triggered to registered bank account ending in **8921.')}
        >
          <Ionicons name="flash" size={16} color={colors.white} />
          <Text style={styles.withdrawBtnText}>Request Instant Payout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Breakdown */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>This Week Sales</Text>
          <Text style={styles.statVal}>₹76,400</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Platform Fee (10%)</Text>
          <Text style={styles.statValMuted}>-₹7,640</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Net Earnings</Text>
          <Text style={styles.statValGreen}>₹68,760</Text>
        </View>
      </View>

      {/* Payout History */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Payout Transfer History</Text>
        {payouts.map(p => (
          <View key={p.id} style={styles.payoutTile}>
            <View>
              <Text style={styles.payoutId}>{p.id}</Text>
              <Text style={styles.payoutDate}>{p.date}</Text>
              <Text style={styles.payoutStatus}>{p.status}</Text>
            </View>
            <Text style={styles.payoutAmount}>₹{p.amount}</Text>
          </View>
        ))}
      </View>

      {/* Bank Account Details */}
      <View style={styles.bankCard}>
        <View style={styles.bankHeader}>
          <Ionicons name="card" size={20} color={colors.vendor} />
          <Text style={styles.bankTitle}>Registered Settlement Account</Text>
        </View>
        <Text style={styles.bankDetail}>HDFC Bank Ltd • Current Account</Text>
        <Text style={styles.bankDetail}>A/C: **********8921 | IFSC: HDFC0001244</Text>
        <Text style={styles.verifiedText}>✅ Verified for instant IMPS settlements</Text>
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
    color: colors.textPrimary,
    marginVertical: 6,
  },
  balanceSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 16,
  },
  withdrawBtn: {
    backgroundColor: colors.vendor,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  statValMuted: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textMuted,
    marginTop: 4,
  },
  statValGreen: {
    fontSize: 15,
    fontWeight: '900',
    color: '#22C55E',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  payoutTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  payoutId: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  payoutDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  payoutStatus: {
    fontSize: 10,
    color: '#22C55E',
    fontWeight: '700',
    marginTop: 2,
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  bankCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  bankTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bankDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  verifiedText: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '700',
    marginTop: 6,
  },
});

