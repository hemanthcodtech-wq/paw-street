import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, borderRadius } from '../theme/colors';

export default function CategoryCard({ category, onPress, isSelected }) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: isSelected ? colors.primaryLight : category.color || colors.surfaceAlt },
        isSelected && styles.cardSelected
      ]}
      onPress={() => onPress && onPress(category)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{category.icon}</Text>
      </View>
      <Text style={[styles.nameText, isSelected && styles.nameSelected]} numberOfLines={1}>
        {category.name}
      </Text>
      {category.badge && !isSelected && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{category.badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 96,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: colors.primaryDark,
    backgroundColor: '#FFFBEB',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconText: {
    fontSize: 22,
  },
  nameText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  nameSelected: {
    color: colors.primaryDark,
  },
  badgeContainer: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
});
