import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { PET_CATEGORIES, PRODUCTS, SERVICES, STORES } from '../data/mockData';
import { colors } from '../theme/colors';
import SafeScreen from '../components/SafeScreen';
import LocationPinModal from '../components/LocationPinModal';
import { haversineDistanceKm } from '../services/geocoding';

export default function HomeScreen({ navigation }) {
  const {
    user,
    selectedLocation,
    pets,
    hasPinnedLocation,
    isLocationModalOpen,
    openLocationModal,
    closeLocationModal
  } = useAuth();
  const { addToCart } = useCart();
  const [selectedPetCategory, setSelectedPetCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically compute nearby stores sorted by proximity to user's pinned location
  const nearbyStores = STORES.map(s => {
    const dist = haversineDistanceKm(
      selectedLocation?.lat || 17.4156,
      selectedLocation?.lng || 78.4350,
      s.lat || 17.4156,
      s.lng || 78.4350
    );
    const eta = Math.max(15, Math.round(15 + dist * 3));
    return {
      ...s,
      calculatedDistance: dist,
      dynamicDistance: `${dist} km away`,
      dynamicEta: `${eta}-${eta + 5} min`
    };
  }).sort((a, b) => a.calculatedDistance - b.calculatedDistance);

  const filteredProducts = PRODUCTS.filter(p => {
    const matchCategory = selectedPetCategory === 'all' || p.petType === selectedPetCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <SafeScreen backgroundColor={colors.background}>
      {/* Fresh Launch / On-Demand Location Pin Popup */}
      <LocationPinModal
        visible={!hasPinnedLocation || isLocationModalOpen}
        onClose={closeLocationModal}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Address & Location Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.locationWrapper}
          onPress={openLocationModal}
          activeOpacity={0.8}
        >
          <View style={styles.locationBadge}>
            <Ionicons name="flash" size={14} color="#FFF" />
            <Text style={styles.locationBadgeText}>15 MINS</Text>
          </View>
          <View style={styles.locationTextGroup}>
            <View style={styles.locationRow}>
              <Text style={styles.locationTitle}>{selectedLocation.label || 'Home'} - {selectedLocation.city}</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textPrimary} />
            </View>
            <Text style={styles.locationSubtitle} numberOfLines={1}>{selectedLocation.area}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aiChatButton}
          onPress={() => navigation.navigate('ChatBot')}
        >
          <Ionicons name="sparkles" size={18} color="#FFF" />
          <Text style={styles.aiChatButtonText}>PawBot</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search food, treats, toys, meds..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Pet Profiles Quick Selector */}
      {pets && pets.length > 0 && (
        <View style={styles.myPetsSection}>
          <Text style={styles.sectionTitle}>Shop For Your Furry Kids</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petScroll}>
            {pets.map(pet => (
              <View key={pet.id} style={styles.petChip}>
                <Image source={{ uri: pet.avatar }} style={styles.petAvatar} />
                <View>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petBreed}>{pet.breed} • {pet.age}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Pet Category Pills */}
      <View style={styles.categoriesSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {PET_CATEGORIES.map(cat => {
            const isSelected = selectedPetCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive
                ]}
                onPress={() => setSelectedPetCategory(cat.id)}
              >
                <View style={[styles.catIconBox, { backgroundColor: cat.bg }]}>
                  <Ionicons name={cat.icon} size={16} color={cat.color} />
                </View>
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Flash Sale Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.bannerText}>
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>MEGA PET CARNIVAL</Text>
          </View>
          <Text style={styles.bannerTitle}>Up to 40% OFF</Text>
          <Text style={styles.bannerSubtitle}>Top Food, Supplements & Grooming</Text>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80' }}
          style={styles.bannerImage}
        />
      </View>

      {/* Nearby Stores Discovery Section */}
      <View style={styles.nearbySection}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.nearbyHeadingGroup}>
            <View style={styles.nearbyIconBadge}>
              <Ionicons name="location" size={14} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Nearby Pet Stores</Text>
              <Text style={styles.nearbySubtitle}>Fast 15-min delivery from local pet shops</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.nearbyActionBtn}
            onPress={() => navigation.navigate('StoresTab')}
            activeOpacity={0.7}
          >
            <Ionicons name="compass" size={13} color="#D97706" />
            <Text style={styles.nearbyActionBtnText}>All Stores →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nearbyScroll}>
          {nearbyStores.map(store => (
            <TouchableOpacity
              key={store.id}
              style={styles.nearbyStoreCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('CatalogTab')}
            >
              <Image source={{ uri: store.image }} style={styles.nearbyStoreImg} />
              <View style={styles.nearbyStoreBody}>
                <View style={styles.nearbyStoreTopRow}>
                  <Text style={styles.nearbyStoreName} numberOfLines={1}>{store.name}</Text>
                  {store.verified && (
                    <Ionicons name="checkmark-circle" size={14} color="#0284C7" />
                  )}
                </View>
                <Text style={styles.nearbyStoreAddress} numberOfLines={1}>{store.address}</Text>

                <View style={styles.nearbyBadgesRow}>
                  <View style={styles.distanceBadge}>
                    <Ionicons name="navigate" size={10} color="#D97706" />
                    <Text style={styles.distanceBadgeText}>{store.dynamicDistance}</Text>
                  </View>
                  <View style={styles.timeBadge}>
                    <Ionicons name="flash" size={10} color="#059669" />
                    <Text style={styles.timeBadgeText}>{store.dynamicEta}</Text>
                  </View>
                </View>

                <View style={styles.nearbyFooterRow}>
                  <Text style={styles.nearbyOpenStatus}>{store.openStatus?.split('•')?.[0] || 'Open Now'}</Text>
                  <Text style={styles.visitStoreLink}>Shop →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View style={styles.productsSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Popular Pet Essentials</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CatalogTab')}>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {filteredProducts.map(prod => (
            <TouchableOpacity
              key={prod.id}
              style={styles.productCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ProductDetail', { product: prod })}
            >
              {prod.badge && (
                <View style={styles.productBadge}>
                  <Text style={styles.productBadgeText}>{prod.badge}</Text>
                </View>
              )}
              <Image source={{ uri: prod.image }} style={styles.productImg} />
              <Text style={styles.productBrand}>{prod.brand}</Text>
              <Text style={styles.productName} numberOfLines={2}>{prod.name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color={colors.star} />
                <Text style={styles.ratingText}>{prod.rating}</Text>
                <Text style={styles.weightText}>({prod.weight})</Text>
              </View>
              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.price}>₹{prod.price}</Text>
                  {prod.originalPrice && (
                    <Text style={styles.oldPrice}>₹{prod.originalPrice}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.addCartBtn}
                  onPress={() => addToCart(prod)}
                >
                  <Text style={styles.addCartText}>+ ADD</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Services */}
      <View style={styles.servicesSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Book Pet Care Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ServicesTab')}>
            <Text style={styles.seeAllText}>All Services →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesScroll}>
          {SERVICES.map(srv => (
            <TouchableOpacity
              key={srv.id}
              style={styles.serviceCard}
              onPress={() => navigation.navigate('ServicesTab')}
            >
              <Image source={{ uri: srv.image }} style={styles.serviceImg} />
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>{srv.title}</Text>
                <Text style={styles.serviceDuration}>⏱ {srv.duration}</Text>
                <View style={styles.serviceBottom}>
                  <Text style={styles.servicePrice}>From ₹{srv.price}</Text>
                  <View style={styles.bookBadge}>
                    <Text style={styles.bookBadgeText}>Book</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  locationBadge: {
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  locationBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  locationTextGroup: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  locationSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  aiChatButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
  },
  aiChatButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  myPetsSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  petScroll: {
    flexDirection: 'row',
  },
  petChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  petAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  petName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  petBreed: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  categoriesSection: {
    marginTop: 14,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 6,
  },
  categoryPillActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  catIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  categoryTextActive: {
    color: '#FFF',
  },
  promoBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bannerText: {
    flex: 1,
  },
  saleBadge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  saleBadgeText: {
    color: colors.textPrimary,
    fontSize: 9,
    fontWeight: '900',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  bannerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  productsSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    position: 'relative',
  },
  productBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 2,
  },
  productBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#B45309',
  },
  productImg: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  productBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 4,
    minHeight: 32,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  weightText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  oldPrice: {
    fontSize: 10,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  addCartBtn: {
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addCartText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  servicesSection: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  servicesScroll: {
    flexDirection: 'row',
  },
  serviceCard: {
    width: 220,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  serviceImg: {
    width: '100%',
    height: 100,
  },
  serviceContent: {
    padding: 12,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  serviceBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.accent,
  },
  bookBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bookBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  nearbySection: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  nearbyHeadingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nearbyIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#FB8500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbySubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  nearbyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  nearbyActionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  nearbyScroll: {
    paddingVertical: 8,
    gap: 12,
  },
  nearbyStoreCard: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nearbyStoreImg: {
    width: '100%',
    height: 95,
  },
  nearbyStoreBody: {
    padding: 10,
  },
  nearbyStoreTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  nearbyStoreName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  nearbyStoreAddress: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  nearbyBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 6,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  distanceBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
  },
  nearbyFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
    marginTop: 2,
  },
  nearbyOpenStatus: {
    fontSize: 9,
    fontWeight: '700',
    color: '#059669',
  },
  visitStoreLink: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
});

