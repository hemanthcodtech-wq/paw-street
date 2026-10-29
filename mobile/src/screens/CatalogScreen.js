import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/mockData';
import { api } from '../services/api';

const SORT_OPTIONS = [
  { id: 'popular', label: 'Popular' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' }
];

export default function CatalogScreen({ navigation, route }) {
  const initialCategory = route.params?.category || 'all';
  const initialSearch = route.params?.search || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSort, setSelectedSort] = useState('popular');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
    if (route.params?.search) {
      setSearchQuery(route.params.search);
    }
  }, [route.params]);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (e) {
      console.warn('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.storeName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (selectedSort === 'price_low') return a.price - b.price;
    if (selectedSort === 'price_high') return b.price - a.price;
    if (selectedSort === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // popular / default
  });

  const allCategories = [{ id: 'all', name: 'All Products', icon: '🐾' }, ...CATEGORIES];

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands, essentials..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills Bar */}
      <View style={styles.catBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {allCategories.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.catChip, isSelected && styles.catChipSelected]}
                onPress={() => setSelectedCategory(c.id)}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 13, marginRight: 4 }}>{c.icon}</Text>
                <Text style={[styles.catChipText, isSelected && styles.catChipTextSelected]}>{c.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sort & Result Count Bar */}
      <View style={styles.subBar}>
        <Text style={styles.resultCount}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} found
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScroll}>
          {SORT_OPTIONS.map((sort) => {
            const isSelected = selectedSort === sort.id;
            return (
              <TouchableOpacity
                key={sort.id}
                style={[styles.sortChip, isSelected && styles.sortChipSelected]}
                onPress={() => setSelectedSort(sort.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.sortText, isSelected && styles.sortTextSelected]}>{sort.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Products Grid */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
          <Text style={styles.loadingText}>Fetching pet supplies...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
          <Text style={styles.emptyTitle}>No Products Found</Text>
          <Text style={styles.emptySub}>We couldn't find any products matching your search criteria.</Text>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          >
            <Text style={styles.clearBtnText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
            />
          ))}
          <View style={{ height: 40, width: '100%' }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
  catBar: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  catScroll: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  catChipSelected: {
    backgroundColor: '#FEF3C7',
    borderColor: colors.primary,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  catChipTextSelected: {
    color: '#92400E',
  },
  subBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  resultCount: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  sortScroll: {
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortChipSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  sortText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sortTextSelected: {
    color: '#FFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  clearBtn: {
    marginTop: 16,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  clearBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
