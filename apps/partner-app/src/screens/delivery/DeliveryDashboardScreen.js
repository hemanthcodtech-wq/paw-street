import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartnerAuth } from '../../context/PartnerAuthContext';
import { useDelivery } from '../../context/DeliveryContext';
import { colors } from '../../theme/colors';

export default function DeliveryDashboardScreen({ navigation }) {
  const { partnerUser, switchRole } = usePartnerAuth();
  const {
    isDutyOnline,
    toggleDuty,
    todayTrips,
    todayEarnings,
    cashInHand,
    orderPool,
    acceptOrder,
    activeTask
  } = useDelivery();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.riderInfo}>
          <Text style={styles.riderName}>{partnerUser?.name || 'Raju Kumar (Fleet)'}</Text>
          <Text style={styles.riderVehicle}>{partnerUser?.vehicleType} • {partnerUser?.vehicleNumber}</Text>
        </View>

        {/* Duty Toggle Button */}
        <TouchableOpacity
          style={[styles.dutyToggle, isDutyOnline ? styles.dutyOnline : styles.dutyOffline]}
          onPress={toggleDuty}
        >
          <View style={[styles.dutyDot, isDutyOnline ? styles.dotOnline : styles.dotOffline]} />
          <Text style={styles.dutyToggleText}>{isDutyOnline ? 'ON DUTY' : 'OFF DUTY'}</Text>
        </TouchableOpacity>
      </View>


      {/* Daily Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statTile}>
          <Ionicons name="wallet-outline" size={22} color={colors.delivery} />
          <Text style={styles.statTileVal}>₹{todayEarnings}</Text>
          <Text style={styles.statTileLabel}>Today's Earnings</Text>
        </View>

        <View style={styles.statTile}>
          <Ionicons name="bicycle-outline" size={22} color={colors.accent} />
          <Text style={styles.statTileVal}>{todayTrips}</Text>
          <Text style={styles.statTileLabel}>Trips Completed</Text>
        </View>

        <View style={styles.statTile}>
          <Ionicons name="cash-outline" size={22} color="#F59E0B" />
          <Text style={styles.statTileVal}>₹{cashInHand}</Text>
          <Text style={styles.statTileLabel}>COD in Hand</Text>
        </View>

        <View style={styles.statTile}>
          <Ionicons name="star" size={22} color="#F59E0B" />
          <Text style={styles.statTileVal}>4.92 ★</Text>
          <Text style={styles.statTileLabel}>Rider Rating</Text>
        </View>
      </View>

      {/* Active Order Card Alert if present */}
      {activeTask && (
        <View style={styles.activeBanner}>
          <View style={styles.activeTop}>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE TRIP ASSIGNED</Text>
            </View>
            <Text style={styles.activePayout}>{activeTask.estimatedFee}</Text>
          </View>
          <Text style={styles.activeStoreName}>Pickup: {activeTask.pickupStore}</Text>
          <Text style={styles.activeDrop}>Drop: {activeTask.dropAddress}</Text>

          <TouchableOpacity
            style={styles.resumeTaskBtn}
            onPress={() => navigation.navigate('ActiveDeliveryTab')}
          >
            <Ionicons name="navigate" size={16} color={colors.white} />
            <Text style={styles.resumeTaskBtnText}>Navigate & Complete Trip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Available Order Pool */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {isDutyOnline ? `Available Nearby Trips (${orderPool.length})` : 'You are currently OFF DUTY'}
        </Text>
      </View>

      {!isDutyOnline ? (
        <View style={styles.offlineBox}>
          <Ionicons name="moon-outline" size={48} color={colors.textMuted} />
          <Text style={styles.offlineTitle}>Go On Duty to Receive Trips</Text>
          <Text style={styles.offlineSub}>
            Tap "OFF DUTY" in top right corner to start receiving instant delivery orders.
          </Text>
        </View>
      ) : orderPool.length === 0 ? (
        <View style={styles.offlineBox}>
          <Ionicons name="checkmark-done-circle-outline" size={48} color={colors.delivery} />
          <Text style={styles.offlineTitle}>All Clear in Your Zone!</Text>
          <Text style={styles.offlineSub}>Scanning for new incoming store dispatches...</Text>
        </View>
      ) : (
        orderPool.map(poolItem => (
          <View key={poolItem.id} style={styles.poolCard}>
            <View style={styles.poolTopRow}>
              <View style={styles.payoutTag}>
                <Text style={styles.payoutTagText}>{poolItem.estEarnings}</Text>
              </View>
              <Text style={styles.distanceText}>📍 {poolItem.distance}</Text>
            </View>

            <View style={styles.routeBox}>
              <View style={styles.routeStop}>
                <Ionicons name="storefront" size={16} color={colors.vendor} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.stopName}>{poolItem.storeName}</Text>
                  <Text style={styles.stopSub}>{poolItem.pickupAddress}</Text>
                </View>
              </View>

              <View style={styles.routeStop}>
                <Ionicons name="location" size={16} color={colors.delivery} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.stopName}>Customer Destination</Text>
                  <Text style={styles.stopSub}>{poolItem.customerAddress}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => {
                acceptOrder(poolItem);
                navigation.navigate('ActiveDeliveryTab');
              }}
            >
              <Ionicons name="flash" size={16} color={colors.white} />
              <Text style={styles.acceptBtnText}>ACCEPT TRIP ({poolItem.estEarnings})</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  riderVehicle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dutyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  dutyOnline: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E',
  },
  dutyOffline: {
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
    borderColor: '#64748B',
  },
  dutyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: {
    backgroundColor: '#22C55E',
  },
  dotOffline: {
    backgroundColor: '#64748B',
  },
  dutyToggleText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  switchRoleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    gap: 8,
  },
  switchRoleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.vendor,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  statTile: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  statTileVal: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  statTileLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  activeBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.delivery,
    marginBottom: 16,
  },
  activeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeBadge: {
    backgroundColor: colors.delivery,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  activePayout: {
    fontSize: 14,
    fontWeight: '900',
    color: '#22C55E',
  },
  activeStoreName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  activeDrop: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  resumeTaskBtn: {
    backgroundColor: colors.delivery,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    gap: 6,
  },
  resumeTaskBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  offlineBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  offlineTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 12,
  },
  offlineSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  poolCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 12,
  },
  poolTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  payoutTag: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  payoutTagText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#22C55E',
  },
  distanceText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  routeBox: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 12,
  },
  routeStop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stopName: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  stopSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  acceptBtn: {
    backgroundColor: colors.delivery,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  acceptBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
});

