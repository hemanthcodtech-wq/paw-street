import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header({ navigation, onOpenLocationModal }) {
  const { selectedLocation } = useAuth();
  const { totalItemCount } = useCart();
  const insets = useSafeAreaInsets();

  // On real Android APK / iOS, use safe area inset so status bar/notch never cuts the header
  const isWeb = Platform.OS === 'web';
  const topPadding = isWeb ? spacing.sm : Math.max(insets.top + 4, 12);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Location Bar */}
      <View style={styles.topRow}>
        <TouchableOpacity 
          style={styles.locationSelector}
          onPress={onOpenLocationModal}
          activeOpacity={0.7}
        >
          <View style={styles.pinIconContainer}>
            <Ionicons name="location" size={18} color="#EA580C" />
          </View>
          <View style={styles.locationTextContainer}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationLabel}>{selectedLocation?.label || 'Delivering to'}</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textPrimary} style={{ marginLeft: 2 }} />
            </View>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {selectedLocation?.area || selectedLocation?.city || 'Banjara Hills, Hyderabad'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.rightActions}>
          {/* Quick Pet Tag */}
          <View style={styles.speedBadge}>
            <Ionicons name="flash" size={12} color="#D97706" />
            <Text style={styles.speedText}>15 MIN</Text>
          </View>

          {/* Cart Icon */}
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('CartTab')}
            activeOpacity={0.7}
          >
            <Ionicons name="bag-handle-outline" size={22} color={colors.secondary} />
            {totalItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  pinIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  locationAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  speedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    gap: 3,
  },
  speedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  cartButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
