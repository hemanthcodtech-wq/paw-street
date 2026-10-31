import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STORES } from '../data/mockData';
import { colors } from '../theme/colors';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { haversineDistanceKm } from '../services/geocoding';

export default function StoresScreen({ navigation }) {
  const { selectedLocation, openLocationModal } = useAuth();
  const [filterNearbyOnly, setFilterNearbyOnly] = useState(false);

  // Compute dynamic distance from user's current pinned location
  const storesWithDistance = STORES.map(item => {
    const dist = haversineDistanceKm(
      selectedLocation?.lat || 17.4156,
      selectedLocation?.lng || 78.4350,
      item.lat || 17.4156,
      item.lng || 78.4350
    );
    const eta = Math.max(15, Math.round(15 + dist * 3));
    return {
      ...item,
      calculatedDistance: dist,
      dynamicDistance: `${dist} km away`,
      dynamicEta: `${eta}-${eta + 5} min`
    };
  }).sort((a, b) => a.calculatedDistance - b.calculatedDistance);

  const displayStores = filterNearbyOnly
    ? storesWithDistance.filter(s => s.calculatedDistance <= 5)
    : storesWithDistance;

  return (
    <SafeScreen backgroundColor={colors.background}>
      <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Local Pet Stores</Text>
            <Text style={styles.headerSubtitle}>Verified neighbourhood shops with 15-minute delivery</Text>
          </View>
          <TouchableOpacity
            style={styles.changeLocBtn}
            onPress={openLocationModal}
            activeOpacity={0.8}
          >
            <Ionicons name="location" size={14} color="#D97706" />
            <Text style={styles.changeLocBtnText}>Change Pin</Text>
          </TouchableOpacity>
        </View>

        {/* Location Banner & Nearby Filter Pill */}
        <View style={styles.locFilterRow}>
          <View style={styles.locIndicator}>
            <Ionicons name="pin" size={12} color="#059669" />
            <Text style={styles.locIndicatorText} numberOfLines={1}>
              Near: {selectedLocation?.area || 'Banjara Hills'}, {selectedLocation?.city || 'Hyderabad'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.nearbyFilterToggle, filterNearbyOnly && styles.nearbyFilterToggleActive]}
            onPress={() => setFilterNearbyOnly(!filterNearbyOnly)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={filterNearbyOnly ? 'radio-button-on' : 'radio-button-off'}
              size={14}
              color={filterNearbyOnly ? '#FFF' : '#D97706'}
            />
            <Text style={[styles.nearbyFilterToggleText, filterNearbyOnly && styles.nearbyFilterToggleTextActive]}>
              {filterNearbyOnly ? 'Nearby Only (<5km)' : 'Sort: Nearest First'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={displayStores}
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
                <View style={styles.distPill}>
                  <Ionicons name="navigate" size={11} color="#D97706" />
                  <Text style={styles.distPillText}>{item.dynamicDistance}</Text>
                </View>
                <View style={styles.etaPill}>
                  <Ionicons name="flash" size={11} color="#059669" />
                  <Text style={styles.etaPillText}>{item.dynamicEta}</Text>
                </View>
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
    </SafeScreen>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  changeLocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 2,
  },
  changeLocBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  locFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
  },
  locIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  locIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  nearbyFilterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  nearbyFilterToggleActive: {
    backgroundColor: '#D97706',
    borderColor: '#B45309',
  },
  nearbyFilterToggleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  nearbyFilterToggleTextActive: {
    color: '#FFFFFF',
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
  distPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  distPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  etaPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
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

