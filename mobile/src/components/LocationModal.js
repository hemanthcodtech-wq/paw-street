import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function LocationModal({ visible, onClose }) {
  const { user, selectedLocation, updateLocation } = useAuth();

  const savedAddresses = user?.addresses || [
    {
      id: 'addr-1',
      label: 'Home',
      street: 'Flat 402, Royal Palms Residency, Road No 12, Banjara Hills',
      city: 'Hyderabad',
      pincode: '500034',
      isDefault: true
    },
    {
      id: 'addr-2',
      label: 'Office',
      street: 'Cyber Towers, Hitech City',
      city: 'Hyderabad',
      pincode: '500081',
      isDefault: false
    }
  ];

  const handleSelect = (addr) => {
    updateLocation({
      city: addr.city,
      area: addr.street,
      pincode: addr.pincode,
      label: addr.label
    });
    onClose();
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
            <View>
              <Text style={styles.title}>Choose Delivery Location</Text>
              <Text style={styles.subtitle}>Select where you want your pet supplies delivered</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Current Location Quick Button */}
          <TouchableOpacity 
            style={styles.currentLocBtn}
            onPress={() => {
              updateLocation({
                city: 'Hyderabad',
                area: 'Current GPS Location (Banjara Hills)',
                pincode: '500034',
                label: 'Current Location'
              });
              onClose();
            }}
            activeOpacity={0.7}
          >
            <View style={styles.gpsIcon}>
              <Ionicons name="locate" size={18} color="#EA580C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.gpsTitle}>Use Current Location</Text>
              <Text style={styles.gpsSub}>Enable GPS for precision 15-minute delivery</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>SAVED ADDRESSES</Text>

          <ScrollView style={styles.list}>
            {savedAddresses.map((addr) => {
              const isSelected = selectedLocation?.area === addr.street || selectedLocation?.label === addr.label;
              return (
                <TouchableOpacity
                  key={addr.id}
                  style={[styles.addressItem, isSelected && styles.addressItemSelected]}
                  onPress={() => handleSelect(addr)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.addrIcon, isSelected && styles.addrIconSelected]}>
                    <Ionicons
                      name={addr.label === 'Home' ? 'home' : 'business'}
                      size={18}
                      color={isSelected ? colors.primaryDark : colors.textSecondary}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>{addr.label}</Text>
                      {addr.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>DEFAULT</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.street} numberOfLines={2}>{addr.street}</Text>
                    <Text style={styles.cityZip}>{addr.city} - {addr.pincode}</Text>
                  </View>

                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primaryDark} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
    paddingBottom: 32,
    paddingTop: 12,
    maxHeight: '75%',
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
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
  currentLocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    gap: 12,
  },
  gpsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9A3412',
  },
  gpsSub: {
    fontSize: 11,
    color: '#C2410C',
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: spacing.md,
  },
  list: {
    marginBottom: spacing.md,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
    marginBottom: spacing.sm,
    gap: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  addressItemSelected: {
    borderColor: colors.primaryDark,
    backgroundColor: '#FFFBEB',
  },
  addrIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addrIconSelected: {
    backgroundColor: '#FEF3C7',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  defaultBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  street: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  cityZip: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
