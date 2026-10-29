import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import StoreCard from '../components/StoreCard';
import ServiceCard from '../components/ServiceCard';
import LocationModal from '../components/LocationModal';
import BookingModal from '../components/BookingModal';
import { CATEGORIES } from '../data/mockData';
import { api } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prods, strs, servs] = await Promise.all([
        api.getProducts(),
        api.getStores(),
        api.getServices()
      ]);
      setProducts(prods);
      setStores(strs);
      setServices(servs);
    } catch (e) {
      console.warn('Error loading home data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigation.navigate('CatalogTab', {
        screen: 'CatalogList',
        params: { search: searchQuery.trim() }
      });
    }
  };

  const handleCategoryPress = (cat) => {
    navigation.navigate('CatalogTab', {
      screen: 'CatalogList',
      params: { category: cat.id }
    });
  };

  const handleProductPress = (prod) => {
    navigation.navigate('ProductDetail', { productId: prod.id });
  };

  const topPicks = products.filter(p => p.tags?.includes('top_pick') || p.rating >= 4.8);
  const trending = products.filter(p => p.tags?.includes('trending') || p.category === 'accessories');

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <Header
        navigation={navigation}
        onOpenLocationModal={() => setIsLocationModalVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primaryDark]} />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search dog food, treats, toys, medicines..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Promo Hero Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerBadge}>
                <Text style={styles.bannerBadgeText}>⚡ 15-MIN EXPRESS</Text>
              </View>
              <Text style={styles.bannerTitle}>Fast Pet Care & Food Delivery</Text>
              <Text style={styles.bannerSub}>Get up to ₹200 OFF on your first pet order!</Text>
              <TouchableOpacity
                style={styles.bannerBtn}
                onPress={() => navigation.navigate('CatalogTab')}
                activeOpacity={0.8}
              >
                <Text style={styles.bannerBtnText}>Shop Now</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80' }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CatalogTab')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onPress={handleCategoryPress}
            />
          ))}
        </ScrollView>

        {/* Top Picks - Horizontal Scroll */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Top Picks For Your Pets 🐾</Text>
            <Text style={styles.sectionSubtitle}>Handpicked premium food & health care</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('CatalogTab')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalProducts}
        >
          {topPicks.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              horizontal
              onPress={handleProductPress}
            />
          ))}
        </ScrollView>

        {/* 24/7 AI Pet Assistant Teaser */}
        <TouchableOpacity
          style={styles.aiTeaser}
          onPress={() => navigation.navigate('ChatBot')}
          activeOpacity={0.88}
        >
          <View style={styles.aiIconBubble}>
            <Text style={{ fontSize: 24 }}>🤖</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.aiTag}>
              <Text style={styles.aiTagText}>AI VET ASSISTANT</Text>
            </View>
            <Text style={styles.aiTitle}>Need Pet Advice or Health Tips?</Text>
            <Text style={styles.aiSub}>Ask questions about diet, puppy care & symptoms</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
        </TouchableOpacity>

        {/* Verified Stores Nearby */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Verified Stores & Salons</Text>
            <Text style={styles.sectionSubtitle}>Fastest fulfillment from local partners</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('StoresTab')}>
            <Text style={styles.seeAllText}>All Stores</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.storesList}>
          {stores.slice(0, 2).map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onPress={() => navigation.navigate('StoresTab')}
            />
          ))}
        </View>

        {/* Trending Pet Accessories & Care - Grid */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Trending Accessories & Food</Text>
            <Text style={styles.sectionSubtitle}>Popular items loved by pet parents</Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {trending.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onPress={handleProductPress}
            />
          ))}
        </View>

        {/* Pet Services & Grooming */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Book Pet Services</Text>
            <Text style={styles.sectionSubtitle}>Certified grooming, vet checkups & stays</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ServicesTab')}>
            <Text style={styles.seeAllText}>All Services</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.servicesContainer}>
          {services.slice(0, 1).map((serv) => (
            <ServiceCard
              key={serv.id}
              service={serv}
              onBook={(s) => setSelectedService(s)}
            />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Location Modal */}
      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />

      {/* Booking Modal */}
      <BookingModal
        visible={!!selectedService}
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  bannerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  banner: {
    backgroundColor: '#023047',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
    padding: spacing.lg,
  },
  bannerBadge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    marginBottom: 6,
  },
  bannerBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#023047',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 12,
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  bannerBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  bannerImage: {
    width: 120,
    height: 140,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  horizontalProducts: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  aiTeaser: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: '#E0F2FE',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTag: {
    backgroundColor: '#0284C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 2,
  },
  aiTagText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369A1',
  },
  aiSub: {
    fontSize: 11,
    color: '#0284C7',
    marginTop: 1,
  },
  storesList: {
    paddingHorizontal: spacing.lg,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  servicesContainer: {
    paddingHorizontal: spacing.lg,
  },
});
