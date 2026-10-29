import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STORES } from '../data/mockData';
import { colors } from '../theme/colors';

export default function StoresScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Pet Stores</Text>
        <Text style={styles.headerSubtitle}>Verified local shops offering 15-minute delivery & pickup</Text>
      </View>

      <FlatList
        data={STORES}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.storeCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('CatalogTab')}
          >
            <Image source={{ uri: item.image }} style={styles.storeImg} />
            <View style={styles.storeInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.storeName}>{item.name}</Text>
                {item.verified && (
                  <Ionicons name="checkmark-circle" size={18} color="#0284C7" />
                )}
              </View>

              <Text style={styles.address}>{item.address}</Text>

              <View style={styles.metaRow}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FFF" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
                <Text style={styles.metaText}>• {item.distance}</Text>
                <Text style={styles.metaText}>• {item.time}</Text>
              </View>

              <View style={styles.tagsRow}>
                {item.categories.map((cat, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{cat}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.bottomRow}>
                <Text style={styles.openStatus}>{item.openStatus}</Text>
                <Text style={styles.viewShopText}>Visit Shop →</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
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
  listContainer: {
    padding: 16,
    gap: 16,
  },
  storeCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  storeImg: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
  },
  storeInfo: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  address: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  openStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  viewShopText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
});

