import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';

export default function StoreCard({ store, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(store)}
      activeOpacity={0.88}
    >
      <Image source={{ uri: store.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.overlayInfo}>
        <View style={styles.openPill}>
          <View style={styles.greenDot} />
          <Text style={styles.openText}>Open Now</Text>
        </View>
        <View style={styles.etaPill}>
          <Ionicons name="flash" size={12} color="#D97706" />
          <Text style={styles.etaText}>{store.eta || '15 min'}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.storeName} numberOfLines={1}>{store.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>{store.rating || 4.8}</Text>
          </View>
        </View>

        <Text style={styles.cityText} numberOfLines={1}>
          <Ionicons name="location-outline" size={12} color={colors.textMuted} /> {store.city || 'Banjara Hills'} • {store.distance || '1.2 km'}
        </Text>

        <View style={styles.tagsRow}>
          {(store.tags || ['Verified Vendor', 'Fast Delivery']).slice(0, 2).map((tag, idx) => (
            <View key={idx} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
  },
  overlayInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  openPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  openText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 3,
  },
  etaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  info: {
    padding: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  cityText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tagPill: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
