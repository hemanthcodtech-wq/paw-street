import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS, PET_CATEGORIES } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/colors';
import SafeScreen from '../components/SafeScreen';

export default function CatalogScreen({ navigation }) {
  const { addToCart } = useCart();
  const [selectedPet, setSelectedPet] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Food', 'Treats', 'Grooming', 'Toys', 'Beds'];

  const filtered = PRODUCTS.filter(p => {
    const matchPet = selectedPet === 'all' || p.petType === selectedPet;
    const matchCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPet && matchCat && matchQuery;
  });

  return (
    <SafeScreen backgroundColor={colors.background}>
      <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pet Store & Supplies</Text>
        <TouchableOpacity
          style={styles.cartIconWrapper}
          onPress={() => navigation.navigate('CartTab')}
        >
          <Ionicons name="bag-handle-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by brand, item, health benefit..."
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

      {/* Pet filter row */}
      <View style={styles.filterRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={PET_CATEGORIES}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.petFilterBtn,
                selectedPet === item.id && styles.petFilterBtnActive
              ]}
              onPress={() => setSelectedPet(item.id)}
            >
              <Text style={[
                styles.petFilterText,
                selectedPet === item.id && styles.petFilterTextActive
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Product category tags */}
      <View style={styles.catTagsRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.catTag,
                selectedCategory === item && styles.catTagActive
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[
                styles.catTagText,
                selectedCategory === item && styles.catTagTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Products list */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Image source={{ uri: item.image }} style={styles.cardImg} />
            <Text style={styles.cardBrand}>{item.brand}</Text>
            <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={12} color={colors.star} />
              <Text style={styles.ratingVal}>{item.rating}</Text>
              <Text style={styles.weightVal}>• {item.weight}</Text>
            </View>
            <View style={styles.bottomRow}>
              <Text style={styles.cardPrice}>₹{item.price}</Text>
              <TouchableOpacity
                style={styles.quickAddBtn}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.quickAddText}>ADD</Text>
              </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  cartIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  filterRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  petFilterBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  petFilterBtnActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  petFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  petFilterTextActive: {
    color: '#FFF',
  },
  catTagsRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  catTag: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 6,
  },
  catTagActive: {
    backgroundColor: '#FED7AA',
  },
  catTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  catTagTextActive: {
    color: colors.primaryDark,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardImg: {
    width: '100%',
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  cardBrand: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  cardName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 4,
    minHeight: 32,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingVal: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  weightVal: {
    fontSize: 10,
    color: colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  quickAddBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  quickAddText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
});

