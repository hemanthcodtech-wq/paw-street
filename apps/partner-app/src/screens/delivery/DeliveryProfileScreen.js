import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartnerAuth } from '../../context/PartnerAuthContext';
import { useDelivery } from '../../context/DeliveryContext';
import { colors } from '../../theme/colors';

export default function DeliveryProfileScreen({ navigation }) {
  const { partnerUser, logoutPartner, switchRole } = usePartnerAuth();
  const { isDutyOnline, toggleDuty } = useDelivery();

  return (
    <ScrollView style={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={colors.white} />
        </View>
        <View style={styles.profileText}>
          <Text style={styles.name}>{partnerUser?.name || 'Raju Kumar'}</Text>
          <Text style={styles.role}>Paw Fleet Delivery Captain</Text>
          <Text style={styles.phone}>{partnerUser?.phone} • {partnerUser?.email}</Text>
        </View>
      </View>

      {/* Duty Status */}
      <View style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Rider Duty Availability</Text>
            <Text style={styles.settingSub}>
              {isDutyOnline ? 'You are receiving nearby store pickup pings' : 'Duty is paused'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.dutyBtn, isDutyOnline ? styles.dutyOnline : styles.dutyOffline]}
            onPress={toggleDuty}
          >
            <Text style={styles.dutyBtnText}>{isDutyOnline ? 'ONLINE' : 'OFFLINE'}</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Rider Vehicle & KYC info */}
      <View style={styles.menuCard}>
        <View style={styles.menuItem}>
          <Ionicons name="bicycle-outline" size={20} color={colors.textPrimary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.menuLabel}>Registered Vehicle</Text>
            <Text style={styles.menuVal}>
              {partnerUser?.vehicleType || 'EV Scooter'} • {partnerUser?.vehicleNumber || 'TS 09 EQ 4421'}
            </Text>
          </View>
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="card-outline" size={20} color={colors.textPrimary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.menuLabel}>Driving License KYC</Text>
            <Text style={styles.menuVal}>{partnerUser?.drivingLicense || 'DL-0420190021345'} (Verified ✅)</Text>
          </View>
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="location-outline" size={20} color={colors.textPrimary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.menuLabel}>Operating Delivery Zone</Text>
            <Text style={styles.menuVal}>Banjara Hills, Jubilee Hills, Madhapur (Hyderabad)</Text>
          </View>
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="call-outline" size={20} color={colors.textPrimary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.menuLabel}>24/7 Rider Emergency Helpline</Text>
            <Text style={styles.menuVal}>1800-PAW-HELP (Toll Free)</Text>
          </View>
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          await logoutPartner();
          navigation.replace('PartnerWelcome');
        }}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.logoutBtnText}>Sign Out of Partner Portal</Text>
      </TouchableOpacity>

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
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.delivery,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  role: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '700',
    marginTop: 2,
  },
  phone: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  settingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  settingSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dutyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dutyOnline: {
    backgroundColor: '#22C55E',
  },
  dutyOffline: {
    backgroundColor: '#64748B',
  },
  dutyBtnText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  switchModeCard: {
    backgroundColor: 'rgba(255, 183, 3, 0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.vendor,
    marginBottom: 14,
  },
  switchModeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.vendor,
  },
  switchModeSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  menuVal: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  logoutBtnText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
});

