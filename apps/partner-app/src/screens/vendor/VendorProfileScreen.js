import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartnerAuth } from '../../context/PartnerAuthContext';
import { useVendor } from '../../context/VendorContext';
import { colors } from '../../theme/colors';

export default function VendorProfileScreen({ navigation }) {
  const { partnerUser, logoutPartner, switchRole } = usePartnerAuth();
  const { isStoreOpen, toggleStoreStatus } = useVendor();

  return (
    <ScrollView style={styles.container}>
      {/* Store Header */}
      <View style={styles.profileHeader}>
        <View style={styles.storeAvatar}>
          <Ionicons name="storefront" size={28} color={colors.white} />
        </View>
        <View style={styles.profileText}>
          <Text style={styles.storeName}>{partnerUser?.storeName || 'Paw Street Central Store'}</Text>
          <Text style={styles.ownerText}>Owner: {partnerUser?.ownerName || 'Rajesh Sharma'}</Text>
          <Text style={styles.contactText}>{partnerUser?.phone} • {partnerUser?.email}</Text>
        </View>
      </View>

      {/* Store Open Status Setting */}
      <View style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Accepting Customer Orders</Text>
            <Text style={styles.settingSub}>
              {isStoreOpen ? 'Store is online and visible in customer feed' : 'Store is paused / closed'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleBtn, isStoreOpen ? styles.toggleOpen : styles.toggleClosed]}
            onPress={toggleStoreStatus}
          >
            <Text style={styles.toggleBtnText}>{isStoreOpen ? 'ACTIVE' : 'PAUSED'}</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Store Details List */}
      <View style={styles.menuCard}>
        <View style={styles.menuItem}>
          <Ionicons name="location-outline" size={20} color={colors.textPrimary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.menuLabel}>Store Address</Text>
            <Text style={styles.menuVal}>Road No 12, Banjara Hills, Hyderabad, 500034</Text>
          </View>
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="time-outline" size={20} color={colors.textPrimary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.menuLabel}>Operating Hours</Text>
            <Text style={styles.menuVal}>Monday - Sunday: 9:00 AM – 10:30 PM</Text>
          </View>
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={20} color={colors.textPrimary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.menuLabel}>GST & Trade License</Text>
            <Text style={styles.menuVal}>GSTIN: 36AAECP1245K1Z9 (Verified)</Text>
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
  profileHeader: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 14,
  },
  storeAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.vendor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    flex: 1,
    marginLeft: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  ownerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contactText: {
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
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleOpen: {
    backgroundColor: '#22C55E',
  },
  toggleClosed: {
    backgroundColor: '#EF4444',
  },
  toggleBtnText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  switchModeCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.delivery,
    marginBottom: 14,
  },
  switchModeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.delivery,
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

