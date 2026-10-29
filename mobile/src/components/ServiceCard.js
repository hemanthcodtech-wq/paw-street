import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';

export default function ServiceCard({ service, onBook }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: service.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{service.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>{service.rating || 4.9}</Text>
          </View>
        </View>

        <Text style={styles.providerText}>
          <Ionicons name="business-outline" size={12} color={colors.textSecondary} /> {service.provider} • {service.duration}
        </Text>

        <Text style={styles.descText} numberOfLines={2}>{service.description}</Text>

        {service.includes && (
          <View style={styles.includesList}>
            {service.includes.slice(0, 3).map((item, idx) => (
              <View key={idx} style={styles.includeItem}>
                <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{service.price}</Text>
            {service.mrp && <Text style={styles.mrp}>₹{service.mrp}</Text>}
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => onBook && onBook(service)}
            activeOpacity={0.8}
          >
            <Text style={styles.bookBtnText}>Book Appointment</Text>
            <Ionicons name="calendar-outline" size={14} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
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
  providerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  descText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  includesList: {
    marginBottom: 12,
    gap: 4,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  includeText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  mrp: {
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  bookBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
